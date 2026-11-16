#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3351;
const baseBuilds = 3350;

const INGREDIENTS = [
  {
    id: "broccolini",
    code: "ING-273",
    name: "Broccolini",
    category: "other",
    density: 0.55,
    fdc: "FDC 170379 · Broccoli, raw (SR Legacy) as broccolini proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw broccolini. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 34,
      protein_g: 2.8,
      fat_g: 0.4,
      saturated_fat_g: 0.04,
      carbohydrate_g: 6.6,
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
  {
    id: "chinese-broccoli",
    code: "ING-274",
    name: "Chinese Broccoli",
    category: "other",
    density: 0.55,
    fdc: "FDC 169967 · Broccoli, chinese, cooked (gai lan / kai-lan proxy via SR Legacy chinese broccoli). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Chinese broccoli (gai lan). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 1.14,
      fat_g: 0.72,
      saturated_fat_g: 0.11,
      carbohydrate_g: 3.81,
      sugars_g: 0.84,
      fibre_g: 2.5,
      sodium_mg: 7,
      calcium_mg: 100,
      iron_mg: 0.56,
      magnesium_mg: 18,
      potassium_mg: 261,
      zinc_mg: 0.39,
      vitamin_a_ug: 82,
      vitamin_c_mg: 28.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 85.0,
      vitamin_b12_ug: 0,
      folate_ug: 99,
      caffeine_mg: 0,
    },
  },
  {
    id: "chayote",
    code: "ING-275",
    name: "Chayote",
    category: "other",
    density: 0.7,
    fdc: "FDC 170402 · Chayote, fruit, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw chayote (choko). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 19,
      protein_g: 0.82,
      fat_g: 0.13,
      saturated_fat_g: 0.03,
      carbohydrate_g: 4.51,
      sugars_g: 1.66,
      fibre_g: 1.7,
      sodium_mg: 2,
      calcium_mg: 17,
      iron_mg: 0.34,
      magnesium_mg: 12,
      potassium_mg: 125,
      zinc_mg: 0.74,
      vitamin_a_ug: 0,
      vitamin_c_mg: 7.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.1,
      vitamin_b12_ug: 0,
      folate_ug: 93,
      caffeine_mg: 0,
    },
  },
  {
    id: "tomatillo",
    code: "ING-276",
    name: "Tomatillo",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 168566 · Tomatillos, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw tomatillo. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 32,
      protein_g: 0.96,
      fat_g: 1.02,
      saturated_fat_g: 0.14,
      carbohydrate_g: 5.84,
      sugars_g: 3.93,
      fibre_g: 1.9,
      sodium_mg: 1,
      calcium_mg: 7,
      iron_mg: 0.62,
      magnesium_mg: 20,
      potassium_mg: 268,
      zinc_mg: 0.22,
      vitamin_a_ug: 6,
      vitamin_c_mg: 11.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 10.1,
      vitamin_b12_ug: 0,
      folate_ug: 7,
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
  { ing: "broccolini", cell: "chia", template: "tenon-delicata-chia-elevated", fromId: "delicata" },
  { ing: "tomatillo", cell: "overnight-oats", template: "tenon-summer-squash-overnight-oats-elevated", fromId: "summer-squash" },
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
  out = out.replaceAll("Three thousand three hundred fifty builds.", "Three thousand four hundred builds.");
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
