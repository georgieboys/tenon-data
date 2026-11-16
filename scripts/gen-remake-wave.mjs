#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6951;
const baseBuilds = 6950;

const INGREDIENTS = [
  {
    id: "tiger-nut-milk",
    code: "ING-564",
    name: "Tiger Nut Milk",
    category: "plant_milk",
    density: 1.03,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy) as tiger nut milk proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tiger nut (chufa) milk / horchata base. Nutrition uses almond milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 60,
      protein_g: 0.5,
      fat_g: 2.5,
      saturated_fat_g: 0.5,
      carbohydrate_g: 9.0,
      sugars_g: 6.0,
      fibre_g: 1.0,
      sodium_mg: 40,
      calcium_mg: 50,
      iron_mg: 0.5,
      magnesium_mg: 20,
      potassium_mg: 120,
      zinc_mg: 0.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "banana-milk",
    code: "ING-565",
    name: "Banana Milk",
    category: "plant_milk",
    density: 1.04,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy) as banana milk proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Banana milk. Nutrition uses almond milk energy shape until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 55,
      protein_g: 0.5,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 10.0,
      sugars_g: 7.0,
      fibre_g: 0.5,
      sodium_mg: 45,
      calcium_mg: 120,
      iron_mg: 0.2,
      magnesium_mg: 15,
      potassium_mg: 150,
      zinc_mg: 0.1,
      vitamin_a_ug: 20,
      vitamin_c_mg: 2,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.5,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-cream",
    code: "ING-566",
    name: "Coconut Cream",
    category: "plant_milk",
    density: 1.01,
    fdc: "FDC 170172 · Nuts, coconut cream (liquid expressed from grated meat) (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Coconut cream. Contains tree nut (US FDA coconut labelling). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 330,
      protein_g: 3.63,
      fat_g: 34.68,
      saturated_fat_g: 30.75,
      carbohydrate_g: 6.65,
      sugars_g: 0,
      fibre_g: 2.2,
      sodium_mg: 4,
      calcium_mg: 11,
      iron_mg: 2.28,
      magnesium_mg: 28,
      potassium_mg: 325,
      zinc_mg: 0.96,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 23,
      caffeine_mg: 0,
    },
  },
  {
    id: "buttermilk",
    code: "ING-567",
    name: "Buttermilk",
    category: "dairy",
    density: 1.03,
    fdc: "FDC 170874 · Milk, buttermilk, fluid, cultured, lowfat (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Cultured buttermilk. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 3.31,
      fat_g: 0.88,
      saturated_fat_g: 0.55,
      carbohydrate_g: 4.79,
      sugars_g: 4.79,
      fibre_g: 0,
      sodium_mg: 105,
      calcium_mg: 116,
      iron_mg: 0.05,
      magnesium_mg: 11,
      potassium_mg: 151,
      zinc_mg: 0.42,
      vitamin_a_ug: 7,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0.22,
      folate_ug: 5,
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
  { ing: "tiger-nut-milk", cell: "chia", template: "tenon-flax-milk-chia-elevated", fromId: "flax-milk" },
  { ing: "buttermilk", cell: "overnight-oats", template: "tenon-sesame-milk-overnight-oats-elevated", fromId: "sesame-milk" },
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
  out = out.replaceAll("Six thousand nine hundred fifty builds.", "Seven thousand builds.");
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
