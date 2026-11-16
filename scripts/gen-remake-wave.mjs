#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9315;
const baseBuilds = 9314;

const INGREDIENTS = [
  {
    id: "tahini-hulled",
    code: "ING-754",
    name: "Tahini Hulled",
    category: "nut_seed",
    density: 1.1,
    fdc: "FDC 168588 · Seeds, sesame butter, tahini, from roasted and toasted kernels (SR Legacy) as hulled tahini proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Hulled tahini. Contains sesame. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
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
      iron_mg: 8.9,
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
    id: "flaxseed-meal-golden",
    code: "ING-755",
    name: "Flaxseed Meal Golden",
    category: "nut_seed",
    density: 0.7,
    fdc: "FDC 169414 · Seeds, flaxseed (SR Legacy) as golden flaxseed meal proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Golden flaxseed meal. Nutrition uses flaxseed proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 534,
      protein_g: 18.3,
      fat_g: 42.2,
      saturated_fat_g: 3.7,
      carbohydrate_g: 28.9,
      sugars_g: 1.6,
      fibre_g: 27.3,
      sodium_mg: 30,
      calcium_mg: 255,
      iron_mg: 5.7,
      magnesium_mg: 392,
      potassium_mg: 813,
      zinc_mg: 4.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.3,
      vitamin_b12_ug: 0,
      folate_ug: 87,
      caffeine_mg: 0,
    },
  },
  {
    id: "chia-black",
    code: "ING-756",
    name: "Chia Black",
    category: "nut_seed",
    density: 0.7,
    fdc: "FDC 170554 · Seeds, chia seeds, dried (SR Legacy) as black chia proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Black chia seeds. Nutrition uses dried chia proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 486,
      protein_g: 16.5,
      fat_g: 30.7,
      saturated_fat_g: 3.3,
      carbohydrate_g: 42.1,
      sugars_g: 0,
      fibre_g: 34.4,
      sodium_mg: 16,
      calcium_mg: 631,
      iron_mg: 7.7,
      magnesium_mg: 335,
      potassium_mg: 407,
      zinc_mg: 4.6,
      vitamin_a_ug: 54,
      vitamin_c_mg: 1.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "cashew-yogurt",
    code: "ING-757",
    name: "Cashew Yogurt",
    category: "plant_milk",
    density: 1.04,
    fdc: "FDC 170903 · Yogurt, plain, whole milk (SR Legacy) as cashew yogurt proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Cashew yogurt. Contains tree nut. Nutrition uses whole-milk yogurt proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 80,
      protein_g: 2.5,
      fat_g: 5.5,
      saturated_fat_g: 1.0,
      carbohydrate_g: 6.0,
      sugars_g: 1.5,
      fibre_g: 0.5,
      sodium_mg: 10,
      calcium_mg: 120,
      iron_mg: 0.8,
      magnesium_mg: 40,
      potassium_mg: 100,
      zinc_mg: 0.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 10,
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
  { ing: "tahini-hulled", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "cashew-yogurt", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand three hundred sixty-four builds.");
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
