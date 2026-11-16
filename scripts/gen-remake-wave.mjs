#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8315;
const baseBuilds = 8314;

const INGREDIENTS = [
  {
    id: "monterey-jack",
    code: "ING-674",
    name: "Monterey Jack",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170844 · Cheese, monterey (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Monterey Jack. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 373,
      protein_g: 24.5,
      fat_g: 30.3,
      saturated_fat_g: 19.1,
      carbohydrate_g: 0.7,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 536,
      calcium_mg: 746,
      iron_mg: 0.7,
      magnesium_mg: 27,
      potassium_mg: 81,
      zinc_mg: 3.0,
      vitamin_a_ug: 233,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.5,
      vitamin_b12_ug: 0.8,
      folate_ug: 18,
      caffeine_mg: 0,
    },
  },
  {
    id: "pepper-jack",
    code: "ING-675",
    name: "Pepper Jack",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170844 · Cheese, monterey (SR Legacy) as pepper jack proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Pepper Jack. Contains milk. Nutrition uses Monterey Jack proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 373,
      protein_g: 24.5,
      fat_g: 30.3,
      saturated_fat_g: 19.1,
      carbohydrate_g: 0.7,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 600,
      calcium_mg: 746,
      iron_mg: 0.7,
      magnesium_mg: 27,
      potassium_mg: 81,
      zinc_mg: 3.0,
      vitamin_a_ug: 233,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.5,
      vitamin_b12_ug: 0.8,
      folate_ug: 18,
      caffeine_mg: 0,
    },
  },
  {
    id: "gouda-smoked",
    code: "ING-676",
    name: "Gouda Smoked",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171241 · Cheese, gouda (SR Legacy) as smoked gouda proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Smoked Gouda. Contains milk. Nutrition uses Gouda proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 356,
      protein_g: 24.9,
      fat_g: 27.4,
      saturated_fat_g: 17.6,
      carbohydrate_g: 2.2,
      sugars_g: 2.2,
      fibre_g: 0,
      sodium_mg: 819,
      calcium_mg: 700,
      iron_mg: 0.2,
      magnesium_mg: 29,
      potassium_mg: 121,
      zinc_mg: 3.9,
      vitamin_a_ug: 165,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 1.5,
      folate_ug: 21,
      caffeine_mg: 0,
    },
  },
  {
    id: "edam",
    code: "ING-677",
    name: "Edam",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173420 · Cheese, edam (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Edam. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 357,
      protein_g: 25.0,
      fat_g: 27.8,
      saturated_fat_g: 17.6,
      carbohydrate_g: 1.4,
      sugars_g: 1.4,
      fibre_g: 0,
      sodium_mg: 965,
      calcium_mg: 731,
      iron_mg: 0.4,
      magnesium_mg: 30,
      potassium_mg: 188,
      zinc_mg: 3.8,
      vitamin_a_ug: 243,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 1.5,
      folate_ug: 16,
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
  { ing: "monterey-jack", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "edam", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand three hundred sixty-four builds.");
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
