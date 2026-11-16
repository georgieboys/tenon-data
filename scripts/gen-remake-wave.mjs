#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2601;
const baseBuilds = 2600;

const INGREDIENTS = [
  {
    id: "edamame",
    code: "ING-210",
    name: "Edamame",
    category: "other",
    density: 0.8,
    fdc: "FDC 168411 · Edamame, frozen, prepared (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Prepared edamame. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 121,
      protein_g: 11.91,
      fat_g: 5.2,
      saturated_fat_g: 0.62,
      carbohydrate_g: 8.91,
      sugars_g: 2.18,
      fibre_g: 5.2,
      sodium_mg: 6,
      calcium_mg: 63,
      iron_mg: 2.27,
      magnesium_mg: 64,
      potassium_mg: 436,
      zinc_mg: 1.37,
      vitamin_a_ug: 15,
      vitamin_c_mg: 6.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 26.7,
      vitamin_b12_ug: 0,
      folate_ug: 311,
      caffeine_mg: 0,
    },
  },
  {
    id: "kidney-bean",
    code: "ING-211",
    name: "Kidney Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 173744 · Beans, kidney, all types, mature seeds, cooked, boiled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked kidney beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 127,
      protein_g: 8.67,
      fat_g: 0.5,
      saturated_fat_g: 0.07,
      carbohydrate_g: 22.8,
      sugars_g: 0.32,
      fibre_g: 6.4,
      sodium_mg: 2,
      calcium_mg: 35,
      iron_mg: 2.94,
      magnesium_mg: 45,
      potassium_mg: 405,
      zinc_mg: 1.07,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 8.4,
      vitamin_b12_ug: 0,
      folate_ug: 130,
      caffeine_mg: 0,
    },
  },
  {
    id: "pinto-bean",
    code: "ING-212",
    name: "Pinto Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 175200 · Beans, pinto, mature seeds, cooked, boiled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked pinto beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 143,
      protein_g: 9.01,
      fat_g: 0.65,
      saturated_fat_g: 0.11,
      carbohydrate_g: 26.22,
      sugars_g: 0.34,
      fibre_g: 9.0,
      sodium_mg: 1,
      calcium_mg: 46,
      iron_mg: 2.09,
      magnesium_mg: 50,
      potassium_mg: 436,
      zinc_mg: 0.98,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 172,
      caffeine_mg: 0,
    },
  },
  {
    id: "navy-bean",
    code: "ING-213",
    name: "Navy Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 173746 · Beans, navy, mature seeds, cooked, boiled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked navy beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 140,
      protein_g: 8.2,
      fat_g: 0.62,
      saturated_fat_g: 0.1,
      carbohydrate_g: 26.05,
      sugars_g: 0.37,
      fibre_g: 10.5,
      sodium_mg: 0,
      calcium_mg: 69,
      iron_mg: 2.36,
      magnesium_mg: 53,
      potassium_mg: 389,
      zinc_mg: 1.03,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0,
      folate_ug: 140,
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
  { ing: "edamame", cell: "chia", template: "tenon-artichoke-chia-elevated", fromId: "artichoke" },
  { ing: "navy-bean", cell: "overnight-oats", template: "tenon-snap-pea-overnight-oats-elevated", fromId: "snap-pea" },
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
  out = out.replaceAll("Two thousand six hundred builds.", "Two thousand six hundred fifty builds.");
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
