#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1051;
const baseBuilds = 1050;

const INGREDIENTS = [
  {
    id: "bell-pepper",
    code: "ING-083",
    name: "Bell Pepper",
    category: "other",
    density: 0.5,
    fdc: "FDC 170427 · Peppers, sweet, red, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw red bell pepper. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 31,
      protein_g: 0.99,
      fat_g: 0.3,
      saturated_fat_g: 0.06,
      carbohydrate_g: 6.03,
      sugars_g: 4.2,
      fibre_g: 2.1,
      sodium_mg: 4,
      calcium_mg: 7,
      iron_mg: 0.43,
      magnesium_mg: 12,
      potassium_mg: 211,
      zinc_mg: 0.25,
      vitamin_a_ug: 157,
      vitamin_c_mg: 127.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.9,
      vitamin_b12_ug: 0,
      folate_ug: 46,
      caffeine_mg: 0,
    },
  },
  {
    id: "onion",
    code: "ING-084",
    name: "Onion",
    category: "other",
    density: 0.6,
    fdc: "FDC 170000 · Onions, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw onion. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.1,
      fat_g: 0.1,
      saturated_fat_g: 0.04,
      carbohydrate_g: 9.34,
      sugars_g: 4.24,
      fibre_g: 1.7,
      sodium_mg: 4,
      calcium_mg: 23,
      iron_mg: 0.21,
      magnesium_mg: 10,
      potassium_mg: 146,
      zinc_mg: 0.17,
      vitamin_a_ug: 0,
      vitamin_c_mg: 7.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.4,
      vitamin_b12_ug: 0,
      folate_ug: 19,
      caffeine_mg: 0,
    },
  },
  {
    id: "garlic",
    code: "ING-085",
    name: "Garlic",
    category: "spice",
    density: 0.7,
    fdc: "FDC 169230 · Garlic, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw garlic. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 149,
      protein_g: 6.36,
      fat_g: 0.5,
      saturated_fat_g: 0.09,
      carbohydrate_g: 33.06,
      sugars_g: 1,
      fibre_g: 2.1,
      sodium_mg: 17,
      calcium_mg: 181,
      iron_mg: 1.7,
      magnesium_mg: 25,
      potassium_mg: 401,
      zinc_mg: 1.16,
      vitamin_a_ug: 0,
      vitamin_c_mg: 31.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.7,
      vitamin_b12_ug: 0,
      folate_ug: 3,
      caffeine_mg: 0,
    },
  },
  {
    id: "lentil",
    code: "ING-086",
    name: "Lentil",
    category: "other",
    density: 0.85,
    fdc: "FDC 172420 · Lentils, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dry lentils. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 352,
      protein_g: 24.63,
      fat_g: 1.06,
      saturated_fat_g: 0.15,
      carbohydrate_g: 63.35,
      sugars_g: 2.03,
      fibre_g: 10.7,
      sodium_mg: 6,
      calcium_mg: 35,
      iron_mg: 6.51,
      magnesium_mg: 47,
      potassium_mg: 677,
      zinc_mg: 3.27,
      vitamin_a_ug: 2,
      vitamin_c_mg: 4.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 479,
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
  { ing: "garlic", cell: "chia", template: "tenon-mushroom-chia-elevated", fromId: "mushroom" },
  { ing: "lentil", cell: "overnight-oats", template: "tenon-sweet-potato-overnight-oats-elevated", fromId: "sweet-potato" },
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
  out = out.replaceAll(`One thousand fifty builds.`, "One thousand one hundred builds.");
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
