#!/usr/bin/env node
/**
 * Clone the raspberry 12-chassis remake matrix for new ingredients.
 * Usage: node scripts/gen-remake-wave.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 851;
const baseBuilds = 850;

const INGREDIENTS = [
  {
    id: "cherry",
    code: "ING-067",
    name: "Cherry",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 171719 · Cherries, sweet, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sweet cherries. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 63,
      protein_g: 1.06,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 16.01,
      sugars_g: 12.82,
      fibre_g: 2.1,
      sodium_mg: 0,
      calcium_mg: 13,
      iron_mg: 0.36,
      magnesium_mg: 11,
      potassium_mg: 222,
      zinc_mg: 0.07,
      vitamin_a_ug: 3,
      vitamin_c_mg: 7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.1,
      vitamin_b12_ug: 0,
      folate_ug: 4,
      caffeine_mg: 0,
    },
  },
  {
    id: "fig",
    code: "ING-068",
    name: "Fig",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 173021 · Figs, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw figs. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 74,
      protein_g: 0.75,
      fat_g: 0.3,
      saturated_fat_g: 0.06,
      carbohydrate_g: 19.18,
      sugars_g: 16.26,
      fibre_g: 2.9,
      sodium_mg: 1,
      calcium_mg: 35,
      iron_mg: 0.37,
      magnesium_mg: 17,
      potassium_mg: 232,
      zinc_mg: 0.15,
      vitamin_a_ug: 7,
      vitamin_c_mg: 2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.7,
      vitamin_b12_ug: 0,
      folate_ug: 6,
      caffeine_mg: 0,
    },
  },
  {
    id: "apricot",
    code: "ING-069",
    name: "Apricot",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 171697 · Apricots, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw apricot. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 48,
      protein_g: 1.4,
      fat_g: 0.39,
      saturated_fat_g: 0.03,
      carbohydrate_g: 11.12,
      sugars_g: 9.24,
      fibre_g: 2,
      sodium_mg: 1,
      calcium_mg: 13,
      iron_mg: 0.39,
      magnesium_mg: 10,
      potassium_mg: 259,
      zinc_mg: 0.2,
      vitamin_a_ug: 96,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.3,
      vitamin_b12_ug: 0,
      folate_ug: 9,
      caffeine_mg: 0,
    },
  },
  {
    id: "broccoli",
    code: "ING-070",
    name: "Broccoli",
    category: "other",
    density: 0.4,
    fdc: "FDC 170379 · Broccoli, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw broccoli. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 34,
      protein_g: 2.82,
      fat_g: 0.37,
      saturated_fat_g: 0.04,
      carbohydrate_g: 6.64,
      sugars_g: 1.7,
      fibre_g: 2.6,
      sodium_mg: 33,
      calcium_mg: 47,
      iron_mg: 0.73,
      magnesium_mg: 21,
      potassium_mg: 316,
      zinc_mg: 0.41,
      vitamin_a_ug: 31,
      vitamin_c_mg: 89.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 101.6,
      vitamin_b12_ug: 0,
      folate_ug: 63,
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
  { ing: "cherry", cell: "chia", template: "tenon-peach-chia-elevated", fromId: "peach" },
  { ing: "fig", cell: "overnight-oats", template: "tenon-pineapple-overnight-oats-elevated", fromId: "pineapple" },
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
    `code: ${kind === "build" ? "BLD" : "MNU"}-${String(codeNum).padStart(3, "0")}`,
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
    `code: ${kind === "build" ? "BLD" : "MNU"}-${String(codeNum).padStart(3, "0")}`,
  );
  out = out.replaceAll(`Elevated ${toId} cell`, `Elevated ${prose} cell`);
  out = out.replaceAll(`elevated ${toId}`, `elevated ${prose}`);
  out = out.replaceAll(`with elevated ${toId}`, `with elevated ${prose}`);
  out = out.replaceAll(`Eight hundred fifty builds.`, "Nine hundred builds.");
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
