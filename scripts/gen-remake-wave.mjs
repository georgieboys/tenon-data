#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7051;
const baseBuilds = 7050;

const INGREDIENTS = [
  {
    id: "mozzarella",
    code: "ING-572",
    name: "Mozzarella",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170845 · Cheese, mozzarella, whole milk (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Mozzarella. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 300,
      protein_g: 22.17,
      fat_g: 22.35,
      saturated_fat_g: 13.15,
      carbohydrate_g: 2.19,
      sugars_g: 1.03,
      fibre_g: 0,
      sodium_mg: 627,
      calcium_mg: 505,
      iron_mg: 0.44,
      magnesium_mg: 20,
      potassium_mg: 76,
      zinc_mg: 2.92,
      vitamin_a_ug: 179,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 2.28,
      folate_ug: 7,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "cheddar",
    code: "ING-573",
    name: "Cheddar",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173414 · Cheese, cheddar (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Cheddar. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 403,
      protein_g: 22.87,
      fat_g: 33.14,
      saturated_fat_g: 18.75,
      carbohydrate_g: 3.37,
      sugars_g: 0.48,
      fibre_g: 0,
      sodium_mg: 653,
      calcium_mg: 710,
      iron_mg: 0.14,
      magnesium_mg: 27,
      potassium_mg: 76,
      zinc_mg: 3.11,
      vitamin_a_ug: 265,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.6,
      vitamin_k_ug: 2.4,
      vitamin_b12_ug: 0.83,
      folate_ug: 18,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "parmesan",
    code: "ING-574",
    name: "Parmesan",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171247 · Cheese, parmesan, hard (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Parmesan. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 392,
      protein_g: 35.75,
      fat_g: 25.83,
      saturated_fat_g: 16.41,
      carbohydrate_g: 3.22,
      sugars_g: 0.8,
      fibre_g: 0,
      sodium_mg: 1529,
      calcium_mg: 1184,
      iron_mg: 0.82,
      magnesium_mg: 44,
      potassium_mg: 92,
      zinc_mg: 2.75,
      vitamin_a_ug: 207,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 1.7,
      vitamin_b12_ug: 1.2,
      folate_ug: 7,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "feta",
    code: "ING-575",
    name: "Feta",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173420 · Cheese, feta (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Feta. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 264,
      protein_g: 14.21,
      fat_g: 21.28,
      saturated_fat_g: 14.92,
      carbohydrate_g: 4.09,
      sugars_g: 4.09,
      fibre_g: 0,
      sodium_mg: 1116,
      calcium_mg: 493,
      iron_mg: 0.65,
      magnesium_mg: 19,
      potassium_mg: 62,
      zinc_mg: 2.88,
      vitamin_a_ug: 125,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 1.8,
      vitamin_b12_ug: 1.69,
      folate_ug: 32,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
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
  { ing: "mozzarella", cell: "chia", template: "tenon-kefir-chia-elevated", fromId: "kefir" },
  { ing: "feta", cell: "overnight-oats", template: "tenon-ricotta-overnight-oats-elevated", fromId: "ricotta" },
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
  const diet = ing.diet || { plant_based: true, vegetarian: true };
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
  plant_based: ${diet.plant_based}
  vegetarian: ${diet.vegetarian}
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
  out = out.replaceAll("Seven thousand fifty builds.", "Seven thousand one hundred builds.");
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
