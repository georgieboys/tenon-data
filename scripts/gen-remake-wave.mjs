#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2001;
const baseBuilds = 2000;

const INGREDIENTS = [
  {
    id: "jackfruit",
    code: "ING-161",
    name: "Jackfruit",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 174687 · Jackfruit, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw jackfruit. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 95,
      protein_g: 1.72,
      fat_g: 0.64,
      saturated_fat_g: 0.2,
      carbohydrate_g: 23.25,
      sugars_g: 19.08,
      fibre_g: 1.5,
      sodium_mg: 2,
      calcium_mg: 24,
      iron_mg: 0.23,
      magnesium_mg: 29,
      potassium_mg: 448,
      zinc_mg: 0.13,
      vitamin_a_ug: 5,
      vitamin_c_mg: 13.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 24,
      caffeine_mg: 0,
    },
  },
  {
    id: "dragon-fruit",
    code: "ING-162",
    name: "Dragon Fruit",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 2346408 · Pitaya (dragon fruit) proxy from USDA Foundation Foods-style values until the café SKU is labelled.",
    allergens: "[]",
    note: "Dragon fruit (pitaya). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 57,
      protein_g: 1.1,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 12.9,
      sugars_g: 7.7,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 18,
      iron_mg: 0.7,
      magnesium_mg: 22,
      potassium_mg: 190,
      zinc_mg: 0.2,
      vitamin_a_ug: 2,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "rambutan",
    code: "ING-163",
    name: "Rambutan",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 168156 · Rambutan, canned, syrup pack (SR Legacy) used as flesh proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Rambutan (canned SR Legacy proxy for flesh). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 82,
      protein_g: 0.65,
      fat_g: 0.21,
      saturated_fat_g: 0,
      carbohydrate_g: 20.87,
      sugars_g: 0,
      fibre_g: 0.9,
      sodium_mg: 11,
      calcium_mg: 22,
      iron_mg: 0.35,
      magnesium_mg: 7,
      potassium_mg: 42,
      zinc_mg: 0.08,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "starfruit",
    code: "ING-164",
    name: "Starfruit",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 171719 · Carambola (starfruit), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw starfruit (carambola). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 31,
      protein_g: 1.04,
      fat_g: 0.33,
      saturated_fat_g: 0.02,
      carbohydrate_g: 6.73,
      sugars_g: 3.98,
      fibre_g: 2.8,
      sodium_mg: 2,
      calcium_mg: 3,
      iron_mg: 0.08,
      magnesium_mg: 10,
      potassium_mg: 133,
      zinc_mg: 0.12,
      vitamin_a_ug: 3,
      vitamin_c_mg: 34.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 12,
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
  { ing: "jackfruit", cell: "chia", template: "tenon-papaya-chia-elevated", fromId: "papaya" },
  { ing: "starfruit", cell: "overnight-oats", template: "tenon-lychee-overnight-oats-elevated", fromId: "lychee" },
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
  out = out.replaceAll("Two thousand builds.", "Two thousand fifty builds.");
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
