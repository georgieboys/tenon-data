#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1501;
const baseBuilds = 1500;

const INGREDIENTS = [
  {
    id: "fenugreek",
    code: "ING-119",
    name: "Fenugreek",
    category: "spice",
    density: 0.55,
    fdc: "FDC 171324 · Spices, fenugreek seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fenugreek seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 323,
      protein_g: 23,
      fat_g: 6.41,
      saturated_fat_g: 1.46,
      carbohydrate_g: 58.35,
      sugars_g: 0,
      fibre_g: 24.6,
      sodium_mg: 67,
      calcium_mg: 176,
      iron_mg: 33.53,
      magnesium_mg: 191,
      potassium_mg: 770,
      zinc_mg: 2.5,
      vitamin_a_ug: 3,
      vitamin_c_mg: 3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 57,
      caffeine_mg: 0,
    },
  },
  {
    id: "white-pepper",
    code: "ING-120",
    name: "White Pepper",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170931 · Spices, pepper, white (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground white pepper. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 296,
      protein_g: 10.4,
      fat_g: 2.12,
      saturated_fat_g: 0.63,
      carbohydrate_g: 68.61,
      sugars_g: 0,
      fibre_g: 26.2,
      sodium_mg: 5,
      calcium_mg: 265,
      iron_mg: 14.31,
      magnesium_mg: 90,
      potassium_mg: 73,
      zinc_mg: 1.13,
      vitamin_a_ug: 0,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "poppy-seed",
    code: "ING-121",
    name: "Poppy Seed",
    category: "nut_seed",
    density: 0.6,
    fdc: "FDC 171330 · Spices, poppy seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Poppy seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 525,
      protein_g: 17.99,
      fat_g: 41.56,
      saturated_fat_g: 4.52,
      carbohydrate_g: 28.13,
      sugars_g: 0,
      fibre_g: 19.5,
      sodium_mg: 26,
      calcium_mg: 1438,
      iron_mg: 9.76,
      magnesium_mg: 347,
      potassium_mg: 719,
      zinc_mg: 7.9,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 82,
      caffeine_mg: 0,
    },
  },
  {
    id: "hazelnut",
    code: "ING-122",
    name: "Hazelnut",
    category: "nut_seed",
    density: 0.6,
    fdc: "FDC 170581 · Nuts, hazelnuts or filberts (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Hazelnuts. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 628,
      protein_g: 14.95,
      fat_g: 60.75,
      saturated_fat_g: 4.46,
      carbohydrate_g: 16.7,
      sugars_g: 4.34,
      fibre_g: 9.7,
      sodium_mg: 0,
      calcium_mg: 114,
      iron_mg: 4.7,
      magnesium_mg: 163,
      potassium_mg: 680,
      zinc_mg: 2.45,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 14.2,
      vitamin_b12_ug: 0,
      folate_ug: 113,
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
  { ing: "fenugreek", cell: "chia", template: "tenon-caraway-chia-elevated", fromId: "caraway" },
  { ing: "hazelnut", cell: "overnight-oats", template: "tenon-tarragon-overnight-oats-elevated", fromId: "tarragon" },
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
  out = out.replaceAll("One thousand five hundred builds.", "One thousand five hundred fifty builds.");
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
