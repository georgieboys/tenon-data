#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2901;
const baseBuilds = 2900;

const INGREDIENTS = [
  {
    id: "chives",
    code: "ING-237",
    name: "Chives",
    category: "other",
    density: 0.25,
    fdc: "FDC 169994 · Chives, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw chives. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 3.27,
      fat_g: 0.73,
      saturated_fat_g: 0.15,
      carbohydrate_g: 4.35,
      sugars_g: 1.85,
      fibre_g: 2.5,
      sodium_mg: 3,
      calcium_mg: 92,
      iron_mg: 1.6,
      magnesium_mg: 42,
      potassium_mg: 296,
      zinc_mg: 0.56,
      vitamin_a_ug: 218,
      vitamin_c_mg: 58.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 212.7,
      vitamin_b12_ug: 0,
      folate_ug: 105,
      caffeine_mg: 0,
    },
  },
  {
    id: "coriander",
    code: "ING-238",
    name: "Coriander Seed",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170921 · Spices, coriander seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Coriander seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 298,
      protein_g: 12.37,
      fat_g: 17.77,
      saturated_fat_g: 0.99,
      carbohydrate_g: 54.99,
      sugars_g: 0,
      fibre_g: 41.9,
      sodium_mg: 35,
      calcium_mg: 709,
      iron_mg: 16.32,
      magnesium_mg: 330,
      potassium_mg: 1267,
      zinc_mg: 4.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 21.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "clove",
    code: "ING-239",
    name: "Clove",
    category: "spice",
    density: 0.5,
    fdc: "FDC 171328 · Spices, cloves, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground cloves. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 274,
      protein_g: 5.97,
      fat_g: 13.0,
      saturated_fat_g: 3.95,
      carbohydrate_g: 65.53,
      sugars_g: 2.38,
      fibre_g: 33.9,
      sodium_mg: 277,
      calcium_mg: 632,
      iron_mg: 11.83,
      magnesium_mg: 259,
      potassium_mg: 1020,
      zinc_mg: 2.32,
      vitamin_a_ug: 8,
      vitamin_c_mg: 0.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 141.8,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "butterhead",
    code: "ING-240",
    name: "Butterhead Lettuce",
    category: "other",
    density: 0.3,
    fdc: "FDC 169249 · Lettuce, butterhead (includes boston and bibb types), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw butterhead lettuce. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 13,
      protein_g: 1.35,
      fat_g: 0.22,
      saturated_fat_g: 0.03,
      carbohydrate_g: 2.23,
      sugars_g: 0.94,
      fibre_g: 1.1,
      sodium_mg: 5,
      calcium_mg: 35,
      iron_mg: 1.24,
      magnesium_mg: 13,
      potassium_mg: 238,
      zinc_mg: 0.2,
      vitamin_a_ug: 166,
      vitamin_c_mg: 3.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 102.3,
      vitamin_b12_ug: 0,
      folate_ug: 73,
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
  { ing: "chives", cell: "chia", template: "tenon-pumpkin-chia-elevated", fromId: "pumpkin" },
  { ing: "butterhead", cell: "overnight-oats", template: "tenon-iceberg-overnight-oats-elevated", fromId: "iceberg" },
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
  out = out.replaceAll("Two thousand nine hundred builds.", "Two thousand nine hundred fifty builds.");
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
