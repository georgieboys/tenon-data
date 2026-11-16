#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7965;
const baseBuilds = 7964;

const INGREDIENTS = [
  {
    id: "chlorella-powder",
    code: "ING-646",
    name: "Chlorella Powder",
    category: "other",
    density: 0.5,
    fdc: "FDC 170495 · Seaweed, spirulina, dried (SR Legacy) as chlorella powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Chlorella powder. Nutrition uses spirulina proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 300,
      protein_g: 58.0,
      fat_g: 9.0,
      saturated_fat_g: 1.5,
      carbohydrate_g: 20.0,
      sugars_g: 0.5,
      fibre_g: 5.0,
      sodium_mg: 50,
      calcium_mg: 220,
      iron_mg: 130,
      magnesium_mg: 250,
      potassium_mg: 1000,
      zinc_mg: 7.0,
      vitamin_a_ug: 1500,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 90,
      caffeine_mg: 0,
    },
  },
  {
    id: "acai-powder",
    code: "ING-647",
    name: "Acai Powder",
    category: "fruit",
    density: 0.45,
    fdc: "FDC 171711 · Blueberries, raw (SR Legacy) as acai powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Acai powder. Nutrition uses blueberry proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 489,
      protein_g: 8.0,
      fat_g: 32.0,
      saturated_fat_g: 8.0,
      carbohydrate_g: 52.0,
      sugars_g: 2.0,
      fibre_g: 30.0,
      sodium_mg: 10,
      calcium_mg: 260,
      iron_mg: 4.0,
      magnesium_mg: 80,
      potassium_mg: 900,
      zinc_mg: 1.0,
      vitamin_a_ug: 500,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 10,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "baobab-powder",
    code: "ING-648",
    name: "Baobab Powder",
    category: "fruit",
    density: 0.5,
    fdc: "FDC 167762 · Oranges, raw, all commercial varieties (SR Legacy) as baobab powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Baobab fruit powder. Nutrition uses orange proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 250,
      protein_g: 2.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 76.0,
      sugars_g: 18.0,
      fibre_g: 44.0,
      sodium_mg: 5,
      calcium_mg: 300,
      iron_mg: 5.0,
      magnesium_mg: 150,
      potassium_mg: 2200,
      zinc_mg: 1.0,
      vitamin_a_ug: 10,
      vitamin_c_mg: 150,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "moringa-powder",
    code: "ING-649",
    name: "Moringa Powder",
    category: "other",
    density: 0.45,
    fdc: "FDC 168462 · Spinach, raw (SR Legacy) as moringa powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Moringa leaf powder. Nutrition uses spinach proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 205,
      protein_g: 27.0,
      fat_g: 2.3,
      saturated_fat_g: 0.5,
      carbohydrate_g: 38.0,
      sugars_g: 0,
      fibre_g: 19.0,
      sodium_mg: 20,
      calcium_mg: 1850,
      iron_mg: 28.0,
      magnesium_mg: 350,
      potassium_mg: 1300,
      zinc_mg: 3.0,
      vitamin_a_ug: 1800,
      vitamin_c_mg: 17,
      vitamin_d_ug: 0,
      vitamin_k_ug: 500,
      vitamin_b12_ug: 0,
      folate_ug: 540,
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
  { ing: "chlorella-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "moringa-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand fourteen builds.");
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
