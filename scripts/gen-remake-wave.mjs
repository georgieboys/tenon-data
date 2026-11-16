#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3051;
const baseBuilds = 3050;

const INGREDIENTS = [
  {
    id: "rutabaga",
    code: "ING-249",
    name: "Rutabaga",
    category: "other",
    density: 0.75,
    fdc: "FDC 168454 · Rutabagas, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw rutabaga. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 37,
      protein_g: 1.08,
      fat_g: 0.16,
      saturated_fat_g: 0.03,
      carbohydrate_g: 8.62,
      sugars_g: 4.46,
      fibre_g: 2.3,
      sodium_mg: 12,
      calcium_mg: 43,
      iron_mg: 0.44,
      magnesium_mg: 20,
      potassium_mg: 305,
      zinc_mg: 0.24,
      vitamin_a_ug: 0,
      vitamin_c_mg: 25.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 21,
      caffeine_mg: 0,
    },
  },
  {
    id: "celeriac",
    code: "ING-250",
    name: "Celeriac",
    category: "other",
    density: 0.7,
    fdc: "FDC 170400 · Celeriac, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw celeriac. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 42,
      protein_g: 1.5,
      fat_g: 0.3,
      saturated_fat_g: 0.08,
      carbohydrate_g: 9.2,
      sugars_g: 1.6,
      fibre_g: 1.8,
      sodium_mg: 100,
      calcium_mg: 43,
      iron_mg: 0.7,
      magnesium_mg: 20,
      potassium_mg: 300,
      zinc_mg: 0.33,
      vitamin_a_ug: 0,
      vitamin_c_mg: 8.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 41,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "taro",
    code: "ING-251",
    name: "Taro",
    category: "other",
    density: 0.85,
    fdc: "FDC 169308 · Taro, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw taro. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 112,
      protein_g: 1.5,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 26.46,
      sugars_g: 0.4,
      fibre_g: 4.1,
      sodium_mg: 11,
      calcium_mg: 43,
      iron_mg: 0.55,
      magnesium_mg: 33,
      potassium_mg: 591,
      zinc_mg: 0.23,
      vitamin_a_ug: 4,
      vitamin_c_mg: 4.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "plantain",
    code: "ING-252",
    name: "Plantain",
    category: "fruit",
    density: 0.8,
    fdc: "FDC 169130 · Plantains, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw plantain. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 122,
      protein_g: 1.3,
      fat_g: 0.37,
      saturated_fat_g: 0.14,
      carbohydrate_g: 31.89,
      sugars_g: 15.0,
      fibre_g: 2.3,
      sodium_mg: 4,
      calcium_mg: 3,
      iron_mg: 0.6,
      magnesium_mg: 37,
      potassium_mg: 499,
      zinc_mg: 0.14,
      vitamin_a_ug: 56,
      vitamin_c_mg: 18.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.7,
      vitamin_b12_ug: 0,
      folate_ug: 22,
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
  { ing: "rutabaga", cell: "chia", template: "tenon-lotus-root-chia-elevated", fromId: "lotus-root" },
  { ing: "plantain", cell: "overnight-oats", template: "tenon-sunchoke-overnight-oats-elevated", fromId: "sunchoke" },
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
  out = out.replaceAll("Three thousand fifty builds.", "Three thousand one hundred builds.");
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
