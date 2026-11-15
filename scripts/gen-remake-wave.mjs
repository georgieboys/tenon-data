#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 951;
const baseBuilds = 950;

const INGREDIENTS = [
  {
    id: "kiwi",
    code: "ING-075",
    name: "Kiwi",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 168153 · Kiwifruit, green, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw green kiwi. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 61,
      protein_g: 1.14,
      fat_g: 0.52,
      saturated_fat_g: 0.03,
      carbohydrate_g: 14.66,
      sugars_g: 8.99,
      fibre_g: 3,
      sodium_mg: 3,
      calcium_mg: 34,
      iron_mg: 0.31,
      magnesium_mg: 17,
      potassium_mg: 312,
      zinc_mg: 0.14,
      vitamin_a_ug: 4,
      vitamin_c_mg: 92.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 40.3,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "pomegranate",
    code: "ING-076",
    name: "Pomegranate",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 169134 · Pomegranates, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw pomegranate arils. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 83,
      protein_g: 1.67,
      fat_g: 1.17,
      saturated_fat_g: 0.12,
      carbohydrate_g: 18.7,
      sugars_g: 13.67,
      fibre_g: 4,
      sodium_mg: 3,
      calcium_mg: 10,
      iron_mg: 0.3,
      magnesium_mg: 12,
      potassium_mg: 236,
      zinc_mg: 0.35,
      vitamin_a_ug: 0,
      vitamin_c_mg: 10.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 16.4,
      vitamin_b12_ug: 0,
      folate_ug: 38,
      caffeine_mg: 0,
    },
  },
  {
    id: "beetroot",
    code: "ING-077",
    name: "Beetroot",
    category: "other",
    density: 0.7,
    fdc: "FDC 169145 · Beets, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw beetroot. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 43,
      protein_g: 1.61,
      fat_g: 0.17,
      saturated_fat_g: 0.03,
      carbohydrate_g: 9.56,
      sugars_g: 6.76,
      fibre_g: 2.8,
      sodium_mg: 78,
      calcium_mg: 16,
      iron_mg: 0.8,
      magnesium_mg: 23,
      potassium_mg: 325,
      zinc_mg: 0.35,
      vitamin_a_ug: 2,
      vitamin_c_mg: 4.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0,
      folate_ug: 109,
      caffeine_mg: 0,
    },
  },
  {
    id: "zucchini",
    code: "ING-078",
    name: "Zucchini",
    category: "other",
    density: 0.5,
    fdc: "FDC 169291 · Squash, summer, zucchini, includes skin, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw zucchini. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 17,
      protein_g: 1.21,
      fat_g: 0.32,
      saturated_fat_g: 0.08,
      carbohydrate_g: 3.11,
      sugars_g: 2.5,
      fibre_g: 1,
      sodium_mg: 8,
      calcium_mg: 16,
      iron_mg: 0.37,
      magnesium_mg: 18,
      potassium_mg: 261,
      zinc_mg: 0.32,
      vitamin_a_ug: 10,
      vitamin_c_mg: 17.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.3,
      vitamin_b12_ug: 0,
      folate_ug: 24,
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
  { ing: "kiwi", cell: "chia", template: "tenon-plum-chia-elevated", fromId: "plum" },
  { ing: "pomegranate", cell: "overnight-oats", template: "tenon-orange-overnight-oats-elevated", fromId: "orange" },
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
  out = out.replaceAll(`Nine hundred fifty builds.`, "One thousand builds.");
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
