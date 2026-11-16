#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1851;
const baseBuilds = 1850;

const INGREDIENTS = [
  {
    id: "arrowroot",
    code: "ING-149",
    name: "Arrowroot",
    category: "grain",
    density: 0.55,
    fdc: "FDC 170288 · Arrowroot flour (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Arrowroot flour. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 357,
      protein_g: 0.3,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 88.15,
      sugars_g: 0,
      fibre_g: 3.4,
      sodium_mg: 2,
      calcium_mg: 40,
      iron_mg: 0.33,
      magnesium_mg: 3,
      potassium_mg: 11,
      zinc_mg: 0.07,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "potato-starch",
    code: "ING-150",
    name: "Potato Starch",
    category: "grain",
    density: 0.65,
    fdc: "FDC 170032 · Potato flour (SR Legacy) used as potato starch proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Potato starch (potato flour proxy). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 357,
      protein_g: 6.9,
      fat_g: 0.34,
      saturated_fat_g: 0.09,
      carbohydrate_g: 83.1,
      sugars_g: 3.5,
      fibre_g: 5.9,
      sodium_mg: 55,
      calcium_mg: 65,
      iron_mg: 1.38,
      magnesium_mg: 65,
      potassium_mg: 1001,
      zinc_mg: 0.54,
      vitamin_a_ug: 0,
      vitamin_c_mg: 3.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "cornstarch",
    code: "ING-151",
    name: "Cornstarch",
    category: "grain",
    density: 0.55,
    fdc: "FDC 168875 · Cornstarch (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cornstarch. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 381,
      protein_g: 0.26,
      fat_g: 0.05,
      saturated_fat_g: 0.01,
      carbohydrate_g: 91.27,
      sugars_g: 0,
      fibre_g: 0.9,
      sodium_mg: 9,
      calcium_mg: 2,
      iron_mg: 0.47,
      magnesium_mg: 3,
      potassium_mg: 3,
      zinc_mg: 0.06,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "semolina",
    code: "ING-152",
    name: "Semolina",
    category: "grain",
    density: 0.7,
    fdc: "FDC 168913 · Semolina, unenriched (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Semolina. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 360,
      protein_g: 12.68,
      fat_g: 1.05,
      saturated_fat_g: 0.15,
      carbohydrate_g: 72.83,
      sugars_g: 0,
      fibre_g: 3.9,
      sodium_mg: 1,
      calcium_mg: 17,
      iron_mg: 1.23,
      magnesium_mg: 47,
      potassium_mg: 186,
      zinc_mg: 1.05,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 72,
      caffeine_mg: 0,
    },
  },
];

const CELLS = [
  "yogurt-bowl",
  "cottage-bowl",
  "overnight-oats",
  "chia",
  "oat-bar",
  "date-bites",
  "almond-cookies",
  "fruitcake",
  "cheesecake",
  "ice-cream",
  "protein-sandwich",
  "egg-sandwich",
];

const ELEVATED = [
  { ing: "arrowroot", cell: "chia", template: "tenon-chickpea-flour-chia-elevated", fromId: "chickpea-flour" },
  { ing: "semolina", cell: "overnight-oats", template: "tenon-coconut-flour-overnight-oats-elevated", fromId: "coconut-flour" },
];

function titleCase(id) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ingredientMd(ing) {
  const lines = Object.entries(ing.nutrition)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");
  return `---
id: ${ing.id}
code: ${ing.code}
name: ${ing.name}
version: 0.1.0
description: ${ing.name}. Open lab cell.
category: ${ing.category}
supplier:
  name: TBD
basis: per_100g
density_g_per_ml: ${ing.density}
default_source: usda_fdc
sources:
  usda_fdc:
    type: usda_fdc
    ref: "${ing.fdc}"
nutrition:
${lines}
allergens: ${ing.allergens}
diet:
  plant_based: true
  vegetarian: true
---

${ing.note}
`;
}

function rewriteFromRaspberry(src, ingId, displayName, codeNum, kind) {
  const title = titleCase(ingId);
  const prose = displayName.toLowerCase();
  let out = src;
  out = out.replaceAll("tenon-raspberry-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("raspberry", ingId);
  out = out.replace(
    kind === "build" ? /code: BLD-\d+/ : /code: MNU-\d+/,
    `code: ${kind === "build" ? "BLD" : "MNU"}-${codeNum}`,
  );
  out = out.replaceAll(`with ${ingId}`, `with ${prose}`);
  out = out.replaceAll(`Fold in honey, ${ingId}`, `Fold in honey, ${prose}`);
  out = out.replaceAll(`, ${ingId},`, `, ${prose},`);
  out = out.replaceAll(`honey, ${ingId}`, `honey, ${prose}`);
  out = out.replaceAll(`Finish with ${ingId}`, `Finish with ${prose}`);
  out = out.replaceAll(`${ingId}, honey`, `${prose}, honey`);
  out = out.replaceAll(`oats, ${ingId}`, `oats, ${prose}`);
  out = out.replaceAll(`Remix with ${ingId}`, `Remix with ${prose}`);
  return out;
}

function rewriteElevated(src, fromId, toId, toName, codeNum, kind) {
  const fromTitle = titleCase(fromId);
  const toTitle = titleCase(toId);
  const prose = toName.toLowerCase();
  let out = src;
  out = out.replaceAll(`tenon-${fromId}-`, `tenon-${toId}-`);
  out = out.replaceAll(`Tenon ${fromTitle} `, `Tenon ${toTitle} `);
  out = out.replaceAll(fromId, toId);
  out = out.replace(
    kind === "build" ? /code: BLD-\d+/ : /code: MNU-\d+/,
    `code: ${kind === "build" ? "BLD" : "MNU"}-${codeNum}`,
  );
  out = out.replaceAll(`Elevated ${toId} cell`, `Elevated ${prose} cell`);
  out = out.replaceAll(`elevated ${toId}`, `elevated ${prose}`);
  out = out.replaceAll(`with elevated ${toId}`, `with elevated ${prose}`);
  out = out.replaceAll("One thousand eight hundred fifty builds.", "One thousand nine hundred builds.");
  return out;
}

let code = startCode;
for (const ing of INGREDIENTS) {
  if (existsSync(path.join(root, "ingredients", `${ing.id}.md`))) {
    console.warn(`! skip existing ingredient ${ing.id}`);
    continue;
  }
  writeFileSync(path.join(root, "ingredients", `${ing.id}.md`), ingredientMd(ing));
  console.log(`+ ingredient ${ing.id}`);
  for (const cell of CELLS) {
    const buildPath = path.join(root, "builds", `tenon-${ing.id}-${cell}.md`);
    if (existsSync(buildPath)) {
      console.warn(`! skip existing build ${ing.id}-${cell}`);
      continue;
    }
    const srcBuild = readFileSync(path.join(root, "builds", `tenon-raspberry-${cell}.md`), "utf8");
    const srcMenu = readFileSync(path.join(root, "menu", `tenon-raspberry-${cell}.md`), "utf8");
    writeFileSync(buildPath, rewriteFromRaspberry(srcBuild, ing.id, ing.name, code, "build"));
    writeFileSync(
      path.join(root, "menu", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcMenu, ing.id, ing.name, code, "menu"),
    );
    code += 1;
  }
}
for (const elev of ELEVATED) {
  const cellSlug = `${elev.cell}-elevated`;
  const buildPath = path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`);
  if (existsSync(buildPath)) {
    console.warn(`! skip existing elevated ${elev.ing}-${cellSlug}`);
    continue;
  }
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.template}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.template}.md`), "utf8");
  const meta = INGREDIENTS.find((i) => i.id === elev.ing);
  writeFileSync(buildPath, rewriteElevated(srcBuild, elev.fromId, elev.ing, meta.name, code, "build"));
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, elev.fromId, elev.ing, meta.name, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}
console.log(
  `done through BLD-${code - 1}; expected builds ${baseBuilds + (code - startCode)}`,
);
