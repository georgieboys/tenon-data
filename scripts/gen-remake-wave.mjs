#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6801;
const baseBuilds = 6800;

const INGREDIENTS = [
  {
    id: "oat-milk",
    code: "ING-552",
    name: "Oat Milk",
    category: "plant_milk",
    density: 1.03,
    fdc: "FDC 2257045 · Oat milk, unsweetened, plain, refrigerated (Foundation) proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Oat milk. May contain gluten depending on oat processing. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 48,
      protein_g: 0.8,
      fat_g: 2.0,
      saturated_fat_g: 0.2,
      carbohydrate_g: 7.0,
      sugars_g: 3.5,
      fibre_g: 0.8,
      sodium_mg: 45,
      calcium_mg: 140,
      iron_mg: 0.3,
      magnesium_mg: 8,
      potassium_mg: 80,
      zinc_mg: 0.2,
      vitamin_a_ug: 60,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.2,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "almond-milk",
    code: "ING-553",
    name: "Almond Milk",
    category: "plant_milk",
    density: 1.02,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Almond milk. Contains tree nut. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 15,
      protein_g: 0.59,
      fat_g: 1.1,
      saturated_fat_g: 0.08,
      carbohydrate_g: 0.58,
      sugars_g: 0,
      fibre_g: 0.2,
      sodium_mg: 72,
      calcium_mg: 188,
      iron_mg: 0.28,
      magnesium_mg: 7,
      potassium_mg: 50,
      zinc_mg: 0.07,
      vitamin_a_ug: 63,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 1,
      caffeine_mg: 0,
    },
  },
  {
    id: "soy-milk",
    code: "ING-554",
    name: "Soy Milk",
    category: "plant_milk",
    density: 1.04,
    fdc: "FDC 175217 · Soymilk, original and vanilla, unfortified (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Soy milk. Contains soy. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 54,
      protein_g: 3.27,
      fat_g: 1.75,
      saturated_fat_g: 0.21,
      carbohydrate_g: 6.28,
      sugars_g: 3.99,
      fibre_g: 0.6,
      sodium_mg: 51,
      calcium_mg: 25,
      iron_mg: 0.64,
      magnesium_mg: 25,
      potassium_mg: 118,
      zinc_mg: 0.12,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.0,
      vitamin_b12_ug: 0,
      folate_ug: 18,
      caffeine_mg: 0,
    },
  },
  {
    id: "rice-milk",
    code: "ING-555",
    name: "Rice Milk",
    category: "plant_milk",
    density: 1.03,
    fdc: "FDC 171870 · Beverages, rice milk, unsweetened (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Rice milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 47,
      protein_g: 0.28,
      fat_g: 0.97,
      saturated_fat_g: 0,
      carbohydrate_g: 9.17,
      sugars_g: 5.28,
      fibre_g: 0.3,
      sodium_mg: 39,
      calcium_mg: 118,
      iron_mg: 0.2,
      magnesium_mg: 11,
      potassium_mg: 27,
      zinc_mg: 0.13,
      vitamin_a_ug: 63,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.63,
      folate_ug: 2,
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
  { ing: "oat-milk", cell: "chia", template: "tenon-amaranth-flour-chia-elevated", fromId: "amaranth-flour" },
  { ing: "rice-milk", cell: "overnight-oats", template: "tenon-corn-flour-overnight-oats-elevated", fromId: "corn-flour" },
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
  out = out.replaceAll("Six thousand eight hundred builds.", "Six thousand eight hundred fifty builds.");
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
