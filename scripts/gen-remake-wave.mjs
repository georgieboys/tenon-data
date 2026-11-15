#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1201;
const baseBuilds = 1200;

const INGREDIENTS = [
  {
    id: "turmeric",
    code: "ING-095",
    name: "Turmeric",
    category: "spice",
    density: 0.6,
    fdc: "FDC 172231 · Spices, turmeric, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground turmeric. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 312,
      protein_g: 9.68,
      fat_g: 3.25,
      saturated_fat_g: 1.84,
      carbohydrate_g: 67.14,
      sugars_g: 3.21,
      fibre_g: 22.7,
      sodium_mg: 27,
      calcium_mg: 168,
      iron_mg: 55,
      magnesium_mg: 208,
      potassium_mg: 2080,
      zinc_mg: 4.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 13.4,
      vitamin_b12_ug: 0,
      folate_ug: 38,
      caffeine_mg: 0,
    },
  },
  {
    id: "cumin",
    code: "ING-096",
    name: "Cumin",
    category: "spice",
    density: 0.5,
    fdc: "FDC 170923 · Spices, cumin seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cumin seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 375,
      protein_g: 17.81,
      fat_g: 22.27,
      saturated_fat_g: 1.54,
      carbohydrate_g: 44.24,
      sugars_g: 2.25,
      fibre_g: 10.5,
      sodium_mg: 168,
      calcium_mg: 931,
      iron_mg: 66.36,
      magnesium_mg: 366,
      potassium_mg: 1788,
      zinc_mg: 4.8,
      vitamin_a_ug: 64,
      vitamin_c_mg: 7.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.4,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "coriander-seed",
    code: "ING-097",
    name: "Coriander Seed",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170920 · Spices, coriander seed (SR Legacy). Proxy until the café SKU is labelled.",
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
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-pepper",
    code: "ING-098",
    name: "Black Pepper",
    category: "spice",
    density: 0.5,
    fdc: "FDC 170931 · Spices, pepper, black (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Black pepper. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 251,
      protein_g: 10.39,
      fat_g: 3.26,
      saturated_fat_g: 1.39,
      carbohydrate_g: 63.95,
      sugars_g: 0.64,
      fibre_g: 25.3,
      sodium_mg: 20,
      calcium_mg: 443,
      iron_mg: 9.71,
      magnesium_mg: 171,
      potassium_mg: 1329,
      zinc_mg: 1.19,
      vitamin_a_ug: 27,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 163.7,
      vitamin_b12_ug: 0,
      folate_ug: 17,
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
  { ing: "turmeric", cell: "chia", template: "tenon-basil-chia-elevated", fromId: "basil" },
  { ing: "cumin", cell: "overnight-oats", template: "tenon-paprika-overnight-oats-elevated", fromId: "paprika" },
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
  out = out.replaceAll(`One thousand two hundred builds.`, "One thousand two hundred fifty builds.");
  return out;
}

let code = startCode;
for (const ing of INGREDIENTS) {
  writeFileSync(path.join(root, "ingredients", `${ing.id}.md`), ingredientMd(ing));
  console.log(`+ ingredient ${ing.id}`);
  for (const cell of CELLS) {
    const srcBuild = readFileSync(path.join(root, "builds", `tenon-raspberry-${cell}.md`), "utf8");
    const srcMenu = readFileSync(path.join(root, "menu", `tenon-raspberry-${cell}.md`), "utf8");
    writeFileSync(
      path.join(root, "builds", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcBuild, ing.id, ing.name, code, "build"),
    );
    writeFileSync(
      path.join(root, "menu", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcMenu, ing.id, ing.name, code, "menu"),
    );
    code += 1;
  }
}
for (const elev of ELEVATED) {
  const cellSlug = `${elev.cell}-elevated`;
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.template}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.template}.md`), "utf8");
  const meta = INGREDIENTS.find((i) => i.id === elev.ing);
  writeFileSync(
    path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcBuild, elev.fromId, elev.ing, meta.name, code, "build"),
  );
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, elev.fromId, elev.ing, meta.name, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}
console.log(
  `done through BLD-${code - 1}; expected builds ${baseBuilds + INGREDIENTS.length * CELLS.length + ELEVATED.length}`,
);
