#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8415;
const baseBuilds = 8414;

const INGREDIENTS = [
  {
    id: "jun-tea",
    code: "ING-682",
    name: "Jun Tea",
    category: "other",
    density: 1.0,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as jun tea proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Jun (honey-green tea ferment). Nutrition uses diluted tea proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 15,
      protein_g: 0.1,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 3.5,
      sugars_g: 3.0,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 3,
      potassium_mg: 20,
      zinc_mg: 0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 8,
    },
  },
  {
    id: "tahini-black",
    code: "ING-683",
    name: "Tahini Black",
    category: "nut_seed",
    density: 1.1,
    fdc: "FDC 170150 · Seeds, sesame butter, tahini, from roasted and toasted kernels (most common type) (SR Legacy) as black tahini proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Black sesame tahini. Sesame allergen. Nutrition uses tahini proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 595,
      protein_g: 17.0,
      fat_g: 53.8,
      saturated_fat_g: 7.5,
      carbohydrate_g: 21.2,
      sugars_g: 0.5,
      fibre_g: 9.3,
      sodium_mg: 115,
      calcium_mg: 426,
      iron_mg: 9.0,
      magnesium_mg: 95,
      potassium_mg: 414,
      zinc_mg: 4.6,
      vitamin_a_ug: 3,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 98,
      caffeine_mg: 0,
    },
  },
  {
    id: "almond-butter-roasted",
    code: "ING-684",
    name: "Almond Butter Roasted",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 168588 · Nuts, almond butter, plain, without salt added (SR Legacy) as roasted almond butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Roasted almond butter. Tree nut allergen. Nutrition uses almond butter proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 614,
      protein_g: 21.0,
      fat_g: 55.5,
      saturated_fat_g: 4.2,
      carbohydrate_g: 18.8,
      sugars_g: 6.3,
      fibre_g: 10.3,
      sodium_mg: 7,
      calcium_mg: 347,
      iron_mg: 3.7,
      magnesium_mg: 279,
      potassium_mg: 748,
      zinc_mg: 3.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 53,
      caffeine_mg: 0,
    },
  },
  {
    id: "limburger",
    code: "ING-685",
    name: "Limburger",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170848 · Cheese, limburger (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Limburger. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 327,
      protein_g: 20.1,
      fat_g: 27.3,
      saturated_fat_g: 16.7,
      carbohydrate_g: 0.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 800,
      calcium_mg: 497,
      iron_mg: 0.1,
      magnesium_mg: 21,
      potassium_mg: 128,
      zinc_mg: 2.1,
      vitamin_a_ug: 340,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 1.0,
      folate_ug: 65,
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
  { ing: "tahini-black", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "limburger", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand four hundred sixty-four builds.");
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
