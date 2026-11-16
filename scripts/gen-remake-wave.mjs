#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2201;
const baseBuilds = 2200;

const INGREDIENTS = [
  {
    id: "asparagus",
    code: "ING-178",
    name: "Asparagus",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 168462 · Asparagus, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw asparagus. Category uses fruit enum slot for produce; replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 20,
      protein_g: 2.2,
      fat_g: 0.12,
      saturated_fat_g: 0.04,
      carbohydrate_g: 3.88,
      sugars_g: 1.88,
      fibre_g: 2.1,
      sodium_mg: 2,
      calcium_mg: 24,
      iron_mg: 2.14,
      magnesium_mg: 14,
      potassium_mg: 202,
      zinc_mg: 0.54,
      vitamin_a_ug: 38,
      vitamin_c_mg: 5.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 41.6,
      vitamin_b12_ug: 0,
      folate_ug: 52,
      caffeine_mg: 0,
    },
  },
  {
    id: "cabbage",
    code: "ING-179",
    name: "Cabbage",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 169975 · Cabbage, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw cabbage. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 1.28,
      fat_g: 0.1,
      saturated_fat_g: 0.03,
      carbohydrate_g: 5.8,
      sugars_g: 3.2,
      fibre_g: 2.5,
      sodium_mg: 18,
      calcium_mg: 40,
      iron_mg: 0.47,
      magnesium_mg: 12,
      potassium_mg: 170,
      zinc_mg: 0.18,
      vitamin_a_ug: 5,
      vitamin_c_mg: 36.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 76,
      vitamin_b12_ug: 0,
      folate_ug: 43,
      caffeine_mg: 0,
    },
  },
  {
    id: "bok-choy",
    code: "ING-180",
    name: "Bok Choy",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 170390 · Cabbage, chinese (pak-choi), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw bok choy (pak-choi). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 13,
      protein_g: 1.5,
      fat_g: 0.2,
      saturated_fat_g: 0.03,
      carbohydrate_g: 2.18,
      sugars_g: 1.18,
      fibre_g: 1,
      sodium_mg: 65,
      calcium_mg: 105,
      iron_mg: 0.8,
      magnesium_mg: 19,
      potassium_mg: 252,
      zinc_mg: 0.19,
      vitamin_a_ug: 223,
      vitamin_c_mg: 45,
      vitamin_d_ug: 0,
      vitamin_k_ug: 45.5,
      vitamin_b12_ug: 0,
      folate_ug: 66,
      caffeine_mg: 0,
    },
  },
  {
    id: "arugula",
    code: "ING-181",
    name: "Arugula",
    category: "fruit",
    density: 0.3,
    fdc: "FDC 169387 · Arugula, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw arugula. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 2.58,
      fat_g: 0.66,
      saturated_fat_g: 0.09,
      carbohydrate_g: 3.65,
      sugars_g: 2.05,
      fibre_g: 1.6,
      sodium_mg: 27,
      calcium_mg: 160,
      iron_mg: 1.46,
      magnesium_mg: 47,
      potassium_mg: 369,
      zinc_mg: 0.47,
      vitamin_a_ug: 119,
      vitamin_c_mg: 15,
      vitamin_d_ug: 0,
      vitamin_k_ug: 108.6,
      vitamin_b12_ug: 0,
      folate_ug: 97,
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
  { ing: "asparagus", cell: "chia", template: "tenon-cantaloupe-chia-elevated", fromId: "cantaloupe" },
  { ing: "arugula", cell: "overnight-oats", template: "tenon-avocado-overnight-oats-elevated", fromId: "avocado" },
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
  out = out.replaceAll("Two thousand two hundred builds.", "Two thousand two hundred fifty builds.");
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
