#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7101;
const baseBuilds = 7100;

const INGREDIENTS = [
  {
    id: "goat-cheese",
    code: "ING-576",
    name: "Goat Cheese",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173430 · Cheese, goat, soft type (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Soft goat cheese. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 268,
      protein_g: 18.52,
      fat_g: 21.08,
      saturated_fat_g: 14.61,
      carbohydrate_g: 0.89,
      sugars_g: 0.89,
      fibre_g: 0,
      sodium_mg: 415,
      calcium_mg: 140,
      iron_mg: 1.9,
      magnesium_mg: 16,
      potassium_mg: 26,
      zinc_mg: 0.66,
      vitamin_a_ug: 288,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 1.8,
      vitamin_b12_ug: 0.19,
      folate_ug: 3,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "gouda",
    code: "ING-577",
    name: "Gouda",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171241 · Cheese, gouda (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Gouda. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 356,
      protein_g: 24.94,
      fat_g: 27.44,
      saturated_fat_g: 17.61,
      carbohydrate_g: 2.22,
      sugars_g: 2.22,
      fibre_g: 0,
      sodium_mg: 819,
      calcium_mg: 700,
      iron_mg: 0.24,
      magnesium_mg: 29,
      potassium_mg: 121,
      zinc_mg: 3.9,
      vitamin_a_ug: 165,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 1.54,
      folate_ug: 21,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "swiss-cheese",
    code: "ING-578",
    name: "Swiss Cheese",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171250 · Cheese, swiss (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Swiss cheese. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 393,
      protein_g: 26.96,
      fat_g: 30.99,
      saturated_fat_g: 19.95,
      carbohydrate_g: 1.44,
      sugars_g: 1.44,
      fibre_g: 0,
      sodium_mg: 187,
      calcium_mg: 791,
      iron_mg: 0.13,
      magnesium_mg: 33,
      potassium_mg: 72,
      zinc_mg: 3.91,
      vitamin_a_ug: 271,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.5,
      vitamin_b12_ug: 3.34,
      folate_ug: 6,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "blue-cheese",
    code: "ING-579",
    name: "Blue Cheese",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 172175 · Cheese, blue (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Blue cheese. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 353,
      protein_g: 21.4,
      fat_g: 28.74,
      saturated_fat_g: 18.67,
      carbohydrate_g: 2.34,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 1146,
      calcium_mg: 528,
      iron_mg: 0.31,
      magnesium_mg: 23,
      potassium_mg: 256,
      zinc_mg: 2.66,
      vitamin_a_ug: 198,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.4,
      vitamin_b12_ug: 1.22,
      folate_ug: 36,
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
  { ing: "goat-cheese", cell: "chia", template: "tenon-mozzarella-chia-elevated", fromId: "mozzarella" },
  { ing: "blue-cheese", cell: "overnight-oats", template: "tenon-feta-overnight-oats-elevated", fromId: "feta" },
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
  out = out.replaceAll("Seven thousand one hundred builds.", "Seven thousand one hundred fifty builds.");
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
