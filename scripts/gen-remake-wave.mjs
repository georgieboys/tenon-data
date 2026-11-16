#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2051;
const baseBuilds = 2050;

const INGREDIENTS = [
  {
    id: "durian",
    code: "ING-165",
    name: "Durian",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 168178 · Durian, raw or frozen (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw/frozen durian. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 147,
      protein_g: 1.47,
      fat_g: 5.33,
      saturated_fat_g: 0,
      carbohydrate_g: 27.09,
      sugars_g: 0,
      fibre_g: 3.8,
      sodium_mg: 2,
      calcium_mg: 6,
      iron_mg: 0.43,
      magnesium_mg: 30,
      potassium_mg: 436,
      zinc_mg: 0.28,
      vitamin_a_ug: 2,
      vitamin_c_mg: 19.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 36,
      caffeine_mg: 0,
    },
  },
  {
    id: "mangosteen",
    code: "ING-166",
    name: "Mangosteen",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 169090 · Mangosteen, canned, syrup pack (SR Legacy) used as flesh proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Mangosteen (canned SR Legacy flesh proxy). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 73,
      protein_g: 0.41,
      fat_g: 0.58,
      saturated_fat_g: 0,
      carbohydrate_g: 17.91,
      sugars_g: 0,
      fibre_g: 1.8,
      sodium_mg: 7,
      calcium_mg: 12,
      iron_mg: 0.3,
      magnesium_mg: 13,
      potassium_mg: 48,
      zinc_mg: 0.21,
      vitamin_a_ug: 2,
      vitamin_c_mg: 2.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 31,
      caffeine_mg: 0,
    },
  },
  {
    id: "longan",
    code: "ING-167",
    name: "Longan",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 169088 · Longans, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw longan. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 60,
      protein_g: 1.31,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 15.14,
      sugars_g: 0,
      fibre_g: 1.1,
      sodium_mg: 0,
      calcium_mg: 1,
      iron_mg: 0.13,
      magnesium_mg: 10,
      potassium_mg: 266,
      zinc_mg: 0.05,
      vitamin_a_ug: 0,
      vitamin_c_mg: 84,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "tamarind",
    code: "ING-168",
    name: "Tamarind",
    category: "fruit",
    density: 1.0,
    fdc: "FDC 169169 · Tamarinds, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw tamarind pulp. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 239,
      protein_g: 2.8,
      fat_g: 0.6,
      saturated_fat_g: 0.27,
      carbohydrate_g: 62.5,
      sugars_g: 57.4,
      fibre_g: 5.1,
      sodium_mg: 28,
      calcium_mg: 74,
      iron_mg: 2.8,
      magnesium_mg: 92,
      potassium_mg: 628,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 3.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.8,
      vitamin_b12_ug: 0,
      folate_ug: 14,
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
  { ing: "durian", cell: "chia", template: "tenon-jackfruit-chia-elevated", fromId: "jackfruit" },
  { ing: "tamarind", cell: "overnight-oats", template: "tenon-starfruit-overnight-oats-elevated", fromId: "starfruit" },
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
  out = out.replaceAll("Two thousand fifty builds.", "Two thousand one hundred builds.");
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
