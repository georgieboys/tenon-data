#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3651;
const baseBuilds = 3650;

const INGREDIENTS = [
  {
    id: "salsify",
    code: "ING-297",
    name: "Salsify",
    category: "other",
    density: 0.8,
    fdc: "FDC 170557 · Salsify, (vegetable oyster), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw salsify root. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 82,
      protein_g: 3.3,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 18.6,
      sugars_g: 2.9,
      fibre_g: 3.3,
      sodium_mg: 20,
      calcium_mg: 60,
      iron_mg: 0.7,
      magnesium_mg: 23,
      potassium_mg: 380,
      zinc_mg: 0.38,
      vitamin_a_ug: 0,
      vitamin_c_mg: 8.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 26,
      caffeine_mg: 0,
    },
  },
  {
    id: "cardoon",
    code: "ING-298",
    name: "Cardoon",
    category: "other",
    density: 0.55,
    fdc: "FDC 169961 · Artichokes, (globe or french), raw (SR Legacy) as cardoon stem proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw cardoon. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 17,
      protein_g: 0.7,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 4.1,
      sugars_g: 0.8,
      fibre_g: 1.6,
      sodium_mg: 170,
      calcium_mg: 70,
      iron_mg: 0.7,
      magnesium_mg: 42,
      potassium_mg: 400,
      zinc_mg: 0.17,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 68,
      caffeine_mg: 0,
    },
  },
  {
    id: "feijoa",
    code: "ING-299",
    name: "Feijoa",
    category: "fruit",
    density: 0.8,
    fdc: "FDC 168156 · Feijoa, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw feijoa (pineapple guava). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 61,
      protein_g: 0.98,
      fat_g: 0.42,
      saturated_fat_g: 0.1,
      carbohydrate_g: 15.21,
      sugars_g: 8.2,
      fibre_g: 6.4,
      sodium_mg: 3,
      calcium_mg: 17,
      iron_mg: 0.14,
      magnesium_mg: 9,
      potassium_mg: 172,
      zinc_mg: 0.06,
      vitamin_a_ug: 0,
      vitamin_c_mg: 32.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 23,
      caffeine_mg: 0,
    },
  },
  {
    id: "pomelo",
    code: "ING-300",
    name: "Pomelo",
    category: "fruit",
    density: 0.85,
    fdc: "FDC 167747 · Pomelo, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw pomelo. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 38,
      protein_g: 0.76,
      fat_g: 0.04,
      saturated_fat_g: 0.01,
      carbohydrate_g: 9.62,
      sugars_g: 8.0,
      fibre_g: 1.0,
      sodium_mg: 1,
      calcium_mg: 4,
      iron_mg: 0.07,
      magnesium_mg: 6,
      potassium_mg: 216,
      zinc_mg: 0.08,
      vitamin_a_ug: 0,
      vitamin_c_mg: 61.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
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
  { ing: "feijoa", cell: "chia", template: "tenon-sugar-pumpkin-chia-elevated", fromId: "sugar-pumpkin" },
  { ing: "pomelo", cell: "overnight-oats", template: "tenon-burdock-overnight-oats-elevated", fromId: "burdock" },
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
  out = out.replaceAll("Three thousand six hundred fifty builds.", "Three thousand seven hundred builds.");
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
