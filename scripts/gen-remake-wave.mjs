#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8015;
const baseBuilds = 8014;

const INGREDIENTS = [
  {
    id: "wheatgrass-powder",
    code: "ING-650",
    name: "Wheatgrass Powder",
    category: "other",
    density: 0.4,
    fdc: "FDC 168462 · Spinach, raw (SR Legacy) as wheatgrass powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Wheatgrass powder. Gluten allergen (wheat). Nutrition uses spinach proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 200,
      protein_g: 20.0,
      fat_g: 2.0,
      saturated_fat_g: 0.3,
      carbohydrate_g: 40.0,
      sugars_g: 5.0,
      fibre_g: 20.0,
      sodium_mg: 30,
      calcium_mg: 200,
      iron_mg: 15.0,
      magnesium_mg: 100,
      potassium_mg: 800,
      zinc_mg: 2.0,
      vitamin_a_ug: 1000,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 400,
      vitamin_b12_ug: 0,
      folate_ug: 100,
      caffeine_mg: 0,
    },
  },
  {
    id: "barley-grass-powder",
    code: "ING-651",
    name: "Barley Grass Powder",
    category: "other",
    density: 0.4,
    fdc: "FDC 168462 · Spinach, raw (SR Legacy) as barley grass powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Barley grass powder. Gluten allergen (barley). Nutrition uses spinach proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 210,
      protein_g: 22.0,
      fat_g: 2.5,
      saturated_fat_g: 0.3,
      carbohydrate_g: 38.0,
      sugars_g: 4.0,
      fibre_g: 22.0,
      sodium_mg: 25,
      calcium_mg: 250,
      iron_mg: 18.0,
      magnesium_mg: 120,
      potassium_mg: 900,
      zinc_mg: 2.5,
      vitamin_a_ug: 1200,
      vitamin_c_mg: 40,
      vitamin_d_ug: 0,
      vitamin_k_ug: 450,
      vitamin_b12_ug: 0,
      folate_ug: 110,
      caffeine_mg: 0,
    },
  },
  {
    id: "camu-camu-powder",
    code: "ING-652",
    name: "Camu Camu Powder",
    category: "fruit",
    density: 0.5,
    fdc: "FDC 167762 · Oranges, raw, all commercial varieties (SR Legacy) as camu camu powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Camu camu powder. Nutrition uses orange proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 280,
      protein_g: 3.0,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 70.0,
      sugars_g: 10.0,
      fibre_g: 20.0,
      sodium_mg: 5,
      calcium_mg: 50,
      iron_mg: 1.0,
      magnesium_mg: 30,
      potassium_mg: 400,
      zinc_mg: 0.5,
      vitamin_a_ug: 20,
      vitamin_c_mg: 2000,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "beetroot-powder",
    code: "ING-653",
    name: "Beetroot Powder",
    category: "other",
    density: 0.55,
    fdc: "FDC 169145 · Beets, raw (SR Legacy) as beetroot powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Beetroot powder. Nutrition uses raw beet proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 350,
      protein_g: 12.0,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 75.0,
      sugars_g: 50.0,
      fibre_g: 15.0,
      sodium_mg: 200,
      calcium_mg: 80,
      iron_mg: 5.0,
      magnesium_mg: 100,
      potassium_mg: 1500,
      zinc_mg: 1.5,
      vitamin_a_ug: 10,
      vitamin_c_mg: 15,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 200,
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
  { ing: "wheatgrass-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "camu-camu-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand sixty-four builds.");
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
