#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7251;
const baseBuilds = 7250;

const INGREDIENTS = [
  {
    id: "creme-fraiche",
    code: "ING-588",
    name: "Crème Fraîche",
    category: "dairy",
    density: 1.01,
    fdc: "FDC 170897 · Cream, sour, cultured (SR Legacy) as crème fraîche proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Crème fraîche. Contains milk. Nutrition uses sour cream proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 292,
      protein_g: 2.4,
      fat_g: 30.0,
      saturated_fat_g: 19.0,
      carbohydrate_g: 2.5,
      sugars_g: 2.5,
      fibre_g: 0,
      sodium_mg: 30,
      calcium_mg: 70,
      iron_mg: 0.05,
      magnesium_mg: 8,
      potassium_mg: 90,
      zinc_mg: 0.3,
      vitamin_a_ug: 280,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 2.5,
      vitamin_b12_ug: 0.3,
      folate_ug: 8,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "clotted-cream",
    code: "ING-589",
    name: "Clotted Cream",
    category: "dairy",
    density: 0.98,
    fdc: "FDC 170859 · Cream, fluid, heavy whipping (SR Legacy) as clotted cream proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Clotted cream. Contains milk. Nutrition uses heavy cream proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 586,
      protein_g: 1.6,
      fat_g: 63.5,
      saturated_fat_g: 40.0,
      carbohydrate_g: 2.3,
      sugars_g: 2.3,
      fibre_g: 0,
      sodium_mg: 20,
      calcium_mg: 40,
      iron_mg: 0.1,
      magnesium_mg: 5,
      potassium_mg: 50,
      zinc_mg: 0.2,
      vitamin_a_ug: 600,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.8,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0.2,
      folate_ug: 3,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "whipping-cream",
    code: "ING-590",
    name: "Whipping Cream",
    category: "dairy",
    density: 0.99,
    fdc: "FDC 170858 · Cream, fluid, light whipping (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light whipping cream. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 292,
      protein_g: 2.17,
      fat_g: 30.91,
      saturated_fat_g: 19.34,
      carbohydrate_g: 2.96,
      sugars_g: 2.96,
      fibre_g: 0,
      sodium_mg: 34,
      calcium_mg: 69,
      iron_mg: 0.03,
      magnesium_mg: 7,
      potassium_mg: 89,
      zinc_mg: 0.23,
      vitamin_a_ug: 324,
      vitamin_c_mg: 0.6,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0.18,
      folate_ug: 4,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "half-and-half",
    code: "ING-591",
    name: "Half and Half",
    category: "dairy",
    density: 1.02,
    fdc: "FDC 170856 · Cream, fluid, half and half (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Half and half. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 131,
      protein_g: 3.13,
      fat_g: 11.5,
      saturated_fat_g: 7.0,
      carbohydrate_g: 4.3,
      sugars_g: 4.3,
      fibre_g: 0,
      sodium_mg: 41,
      calcium_mg: 105,
      iron_mg: 0.05,
      magnesium_mg: 10,
      potassium_mg: 130,
      zinc_mg: 0.35,
      vitamin_a_ug: 97,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 1.3,
      vitamin_b12_ug: 0.32,
      folate_ug: 3,
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
  { ing: "creme-fraiche", cell: "chia", template: "tenon-evaporated-milk-chia-elevated", fromId: "evaporated-milk" },
  { ing: "half-and-half", cell: "overnight-oats", template: "tenon-sour-cream-overnight-oats-elevated", fromId: "sour-cream" },
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
  out = out.replaceAll("Seven thousand two hundred fifty builds.", "Seven thousand three hundred builds.");
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
