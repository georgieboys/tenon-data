#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7201;
const baseBuilds = 7200;

const INGREDIENTS = [
  {
    id: "evaporated-milk",
    code: "ING-584",
    name: "Evaporated Milk",
    category: "dairy",
    density: 1.07,
    fdc: "FDC 173424 · Milk, canned, evaporated, with added vitamin D and without added vitamin A (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Evaporated milk. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 134,
      protein_g: 6.81,
      fat_g: 7.56,
      saturated_fat_g: 4.59,
      carbohydrate_g: 10.04,
      sugars_g: 10.04,
      fibre_g: 0,
      sodium_mg: 106,
      calcium_mg: 261,
      iron_mg: 0.19,
      magnesium_mg: 24,
      potassium_mg: 303,
      zinc_mg: 0.77,
      vitamin_a_ug: 65,
      vitamin_c_mg: 1.9,
      vitamin_d_ug: 1.9,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0.16,
      folate_ug: 8,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "condensed-milk",
    code: "ING-585",
    name: "Condensed Milk",
    category: "dairy",
    density: 1.3,
    fdc: "FDC 171279 · Milk, canned, condensed, sweetened (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Sweetened condensed milk. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 321,
      protein_g: 7.91,
      fat_g: 8.7,
      saturated_fat_g: 5.49,
      carbohydrate_g: 54.4,
      sugars_g: 54.4,
      fibre_g: 0,
      sodium_mg: 127,
      calcium_mg: 284,
      iron_mg: 0.19,
      magnesium_mg: 26,
      potassium_mg: 371,
      zinc_mg: 0.94,
      vitamin_a_ug: 74,
      vitamin_c_mg: 2.6,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0.44,
      folate_ug: 11,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "heavy-cream-35",
    code: "ING-586",
    name: "Heavy Cream 35%",
    category: "dairy",
    density: 0.99,
    fdc: "FDC 170859 · Cream, fluid, heavy whipping (SR Legacy) as 35% cream proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Heavy cream ~35% fat grade cell. Contains milk. Distinct catalogue cell from heavy-cream for fat grade. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 340,
      protein_g: 2.84,
      fat_g: 36.0,
      saturated_fat_g: 23.0,
      carbohydrate_g: 2.74,
      sugars_g: 2.74,
      fibre_g: 0,
      sodium_mg: 38,
      calcium_mg: 65,
      iron_mg: 0.03,
      magnesium_mg: 7,
      potassium_mg: 75,
      zinc_mg: 0.23,
      vitamin_a_ug: 411,
      vitamin_c_mg: 0.6,
      vitamin_d_ug: 0.6,
      vitamin_k_ug: 3.2,
      vitamin_b12_ug: 0.2,
      folate_ug: 4,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "sour-cream",
    code: "ING-587",
    name: "Sour Cream",
    category: "dairy",
    density: 1.01,
    fdc: "FDC 170897 · Cream, sour, cultured (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Sour cream. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 198,
      protein_g: 2.44,
      fat_g: 19.35,
      saturated_fat_g: 10.14,
      carbohydrate_g: 4.63,
      sugars_g: 3.41,
      fibre_g: 0,
      sodium_mg: 80,
      calcium_mg: 101,
      iron_mg: 0.07,
      magnesium_mg: 10,
      potassium_mg: 125,
      zinc_mg: 0.38,
      vitamin_a_ug: 185,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 1.6,
      vitamin_b12_ug: 0.3,
      folate_ug: 11,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
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
  { ing: "evaporated-milk", cell: "chia", template: "tenon-brie-chia-elevated", fromId: "brie" },
  { ing: "sour-cream", cell: "overnight-oats", template: "tenon-mascarpone-overnight-oats-elevated", fromId: "mascarpone" },
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
  const diet = ing.diet || { plant_based: true, vegetarian: true };
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
  plant_based: ${diet.plant_based}
  vegetarian: ${diet.vegetarian}
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
  out = out.replaceAll("Seven thousand two hundred builds.", "Seven thousand two hundred fifty builds.");
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
