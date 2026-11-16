#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7151;
const baseBuilds = 7150;

const INGREDIENTS = [
  {
    id: "brie",
    code: "ING-580",
    name: "Brie",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 172176 · Cheese, brie (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Brie. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 334,
      protein_g: 20.75,
      fat_g: 27.68,
      saturated_fat_g: 17.41,
      carbohydrate_g: 0.45,
      sugars_g: 0.45,
      fibre_g: 0,
      sodium_mg: 629,
      calcium_mg: 184,
      iron_mg: 0.5,
      magnesium_mg: 20,
      potassium_mg: 152,
      zinc_mg: 2.38,
      vitamin_a_ug: 174,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 1.65,
      folate_ug: 65,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "halloumi",
    code: "ING-581",
    name: "Halloumi",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170845 · Cheese, mozzarella, whole milk (SR Legacy) as halloumi proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Halloumi. Contains milk. Nutrition uses mozzarella proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 321,
      protein_g: 21.0,
      fat_g: 26.0,
      saturated_fat_g: 17.0,
      carbohydrate_g: 2.0,
      sugars_g: 1.5,
      fibre_g: 0,
      sodium_mg: 1200,
      calcium_mg: 700,
      iron_mg: 0.4,
      magnesium_mg: 25,
      potassium_mg: 80,
      zinc_mg: 2.5,
      vitamin_a_ug: 150,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 1.5,
      folate_ug: 10,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "paneer",
    code: "ING-582",
    name: "Paneer",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170845 · Cheese, mozzarella, whole milk (SR Legacy) as paneer proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Paneer. Contains milk. Nutrition uses mozzarella proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 265,
      protein_g: 18.3,
      fat_g: 20.8,
      saturated_fat_g: 13.0,
      carbohydrate_g: 1.2,
      sugars_g: 1.2,
      fibre_g: 0,
      sodium_mg: 20,
      calcium_mg: 480,
      iron_mg: 0.2,
      magnesium_mg: 18,
      potassium_mg: 70,
      zinc_mg: 2.0,
      vitamin_a_ug: 160,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.5,
      vitamin_b12_ug: 0.8,
      folate_ug: 8,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "mascarpone",
    code: "ING-583",
    name: "Mascarpone",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170851 · Cheese, ricotta, whole milk (SR Legacy) as mascarpone proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Mascarpone. Contains milk. Nutrition uses ricotta proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 429,
      protein_g: 4.0,
      fat_g: 45.0,
      saturated_fat_g: 28.0,
      carbohydrate_g: 3.0,
      sugars_g: 3.0,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 80,
      iron_mg: 0.1,
      magnesium_mg: 8,
      potassium_mg: 60,
      zinc_mg: 0.4,
      vitamin_a_ug: 350,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 3.0,
      vitamin_b12_ug: 0.3,
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
  { ing: "brie", cell: "chia", template: "tenon-goat-cheese-chia-elevated", fromId: "goat-cheese" },
  { ing: "mascarpone", cell: "overnight-oats", template: "tenon-blue-cheese-overnight-oats-elevated", fromId: "blue-cheese" },
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
  out = out.replaceAll("Seven thousand one hundred fifty builds.", "Seven thousand two hundred builds.");
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
