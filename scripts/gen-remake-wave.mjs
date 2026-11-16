#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4751;
const baseBuilds = 4750;

const INGREDIENTS = [
  {
    id: "gochugaru",
    code: "ING-385",
    name: "Gochugaru",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170066 · Peppers, hot chili, red, raw (SR Legacy) as gochugaru chili flake proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Korean chili flakes (gochugaru). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 280,
      protein_g: 12.0,
      fat_g: 14.0,
      saturated_fat_g: 2.0,
      carbohydrate_g: 50.0,
      sugars_g: 10.0,
      fibre_g: 25.0,
      sodium_mg: 30,
      calcium_mg: 150,
      iron_mg: 8.0,
      magnesium_mg: 150,
      potassium_mg: 2000,
      zinc_mg: 2.0,
      vitamin_a_ug: 2000,
      vitamin_c_mg: 100.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.0,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "kimchi",
    code: "ING-386",
    name: "Kimchi",
    category: "other",
    density: 0.95,
    fdc: "FDC 169975 · Cabbage, kimchi (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fermented napa cabbage kimchi. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 15,
      protein_g: 1.1,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 2.4,
      sugars_g: 1.1,
      fibre_g: 1.6,
      sodium_mg: 498,
      calcium_mg: 33,
      iron_mg: 2.5,
      magnesium_mg: 18,
      potassium_mg: 151,
      zinc_mg: 0.2,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 43.0,
      vitamin_b12_ug: 0,
      folate_ug: 52,
      caffeine_mg: 0,
    },
  },
  {
    id: "nori",
    code: "ING-387",
    name: "Nori",
    category: "other",
    density: 0.2,
    fdc: "FDC 168457 · Seaweed, laver, raw (SR Legacy) as nori sheet proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried nori seaweed sheets. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 5.8,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 5.1,
      sugars_g: 0.5,
      fibre_g: 0.3,
      sodium_mg: 48,
      calcium_mg: 70,
      iron_mg: 1.8,
      magnesium_mg: 2,
      potassium_mg: 356,
      zinc_mg: 1.1,
      vitamin_a_ug: 260,
      vitamin_c_mg: 39.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.0,
      vitamin_b12_ug: 0,
      folate_ug: 146,
      caffeine_mg: 0,
    },
  },
  {
    id: "wakame",
    code: "ING-388",
    name: "Wakame",
    category: "other",
    density: 0.3,
    fdc: "FDC 168458 · Seaweed, wakame, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried or rehydrated wakame. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 45,
      protein_g: 3.0,
      fat_g: 0.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 9.1,
      sugars_g: 0.6,
      fibre_g: 0.5,
      sodium_mg: 870,
      calcium_mg: 150,
      iron_mg: 2.2,
      magnesium_mg: 107,
      potassium_mg: 50,
      zinc_mg: 0.4,
      vitamin_a_ug: 18,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0,
      folate_ug: 196,
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
  { ing: "kimchi", cell: "chia", template: "tenon-gochujang-chia-elevated", fromId: "gochujang" },
  { ing: "nori", cell: "overnight-oats", template: "tenon-mirin-overnight-oats-elevated", fromId: "mirin" },
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
  plant_based: true
  vegetarian: true
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
  out = out.replaceAll("Four thousand seven hundred fifty builds.", "Four thousand eight hundred builds.");
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
