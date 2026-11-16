#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9065;
const baseBuilds = 9064;

const INGREDIENTS = [
  {
    id: "taleggio",
    code: "ING-734",
    name: "Taleggio",
    category: "dairy",
    density: 1.0,
    fdc: "FDC 172176 · Cheese, camembert (SR Legacy) as taleggio proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Taleggio (washed-rind). Contains milk. Nutrition uses camembert proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 315,
      protein_g: 19.0,
      fat_g: 26.0,
      saturated_fat_g: 16.5,
      carbohydrate_g: 0.9,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 800,
      calcium_mg: 420,
      iron_mg: 0.3,
      magnesium_mg: 20,
      potassium_mg: 120,
      zinc_mg: 2.2,
      vitamin_a_ug: 230,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 1.2,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "gouda-aged",
    code: "ING-735",
    name: "Gouda Aged",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171241 · Cheese, gouda (SR Legacy) as aged gouda proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Aged gouda. Contains milk. Nutrition uses gouda proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
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
    id: "pecorino-romano",
    code: "ING-736",
    name: "Pecorino Romano",
    category: "dairy",
    density: 1.1,
    fdc: "FDC 170849 · Cheese, romano (SR Legacy) as pecorino romano proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Pecorino romano. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 387,
      protein_g: 31.8,
      fat_g: 26.9,
      saturated_fat_g: 17.1,
      carbohydrate_g: 3.6,
      sugars_g: 0.7,
      fibre_g: 0,
      sodium_mg: 1433,
      calcium_mg: 1064,
      iron_mg: 0.8,
      magnesium_mg: 41,
      potassium_mg: 86,
      zinc_mg: 2.6,
      vitamin_a_ug: 115,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.2,
      vitamin_b12_ug: 1.1,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "creme-fraiche-light",
    code: "ING-737",
    name: "Crème Fraîche Light",
    category: "dairy",
    density: 1.0,
    fdc: "FDC 170860 · Cream, sour, reduced fat (SR Legacy) as light crème fraîche proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light crème fraîche. Contains milk. Nutrition uses reduced-fat sour cream proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 170,
      protein_g: 3.0,
      fat_g: 16.0,
      saturated_fat_g: 10.0,
      carbohydrate_g: 4.0,
      sugars_g: 3.5,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 90,
      iron_mg: 0.05,
      magnesium_mg: 8,
      potassium_mg: 110,
      zinc_mg: 0.3,
      vitamin_a_ug: 120,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0.3,
      folate_ug: 6,
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
  { ing: "taleggio", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "creme-fraiche-light", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand one hundred fourteen builds.");
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
