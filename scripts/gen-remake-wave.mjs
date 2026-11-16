#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6001;
const baseBuilds = 6000;

const INGREDIENTS = [
  {
    id: "macadamia-butter",
    code: "ING-488",
    name: "Macadamia Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170178 · Nuts, macadamia nuts, raw (SR Legacy) as macadamia butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Plain macadamia butter. Nutrition uses raw macadamia proxy until a dedicated butter FDC row or café CoA lands. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 718,
      protein_g: 7.9,
      fat_g: 75.8,
      saturated_fat_g: 12.1,
      carbohydrate_g: 13.8,
      sugars_g: 4.6,
      fibre_g: 8.6,
      sodium_mg: 5,
      calcium_mg: 85,
      iron_mg: 3.7,
      magnesium_mg: 130,
      potassium_mg: 368,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 11,
      caffeine_mg: 0,
    },
  },
  {
    id: "hemp-seed-butter",
    code: "ING-489",
    name: "Hemp Seed Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170148 · Seeds, hemp seed, hulled (SR Legacy) as hemp seed butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Plain hemp seed butter. Nutrition uses hulled hemp seed proxy until a dedicated butter FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 553,
      protein_g: 31.6,
      fat_g: 48.8,
      saturated_fat_g: 4.6,
      carbohydrate_g: 8.7,
      sugars_g: 1.5,
      fibre_g: 4.0,
      sodium_mg: 5,
      calcium_mg: 70,
      iron_mg: 7.9,
      magnesium_mg: 700,
      potassium_mg: 1200,
      zinc_mg: 9.9,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 110,
      caffeine_mg: 0,
    },
  },
  {
    id: "tahini-dark",
    code: "ING-490",
    name: "Tahini Dark",
    category: "nut_seed",
    density: 1.1,
    fdc: "FDC 170150 · Seeds, sesame butter, tahini, from roasted and toasted kernels (most common type) (SR Legacy) as dark tahini proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Dark / whole-sesame tahini. Distinct catalogue cell from tahini for SKU labelling. Sesame allergen. Replace with the café SOP when locked.",
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
    id: "peanut-butter-smooth",
    code: "ING-491",
    name: "Peanut Butter Smooth",
    category: "nut_seed",
    density: 1.09,
    fdc: "FDC 172470 · Peanut butter, smooth style, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[peanut]",
    note: "Smooth peanut butter without salt. Distinct catalogue cell from peanut-butter for SKU labelling. Peanut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 588,
      protein_g: 25.1,
      fat_g: 50.4,
      saturated_fat_g: 10.1,
      carbohydrate_g: 20.0,
      sugars_g: 9.2,
      fibre_g: 5.7,
      sodium_mg: 17,
      calcium_mg: 49,
      iron_mg: 1.7,
      magnesium_mg: 168,
      potassium_mg: 649,
      zinc_mg: 2.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 87,
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
  { ing: "macadamia-butter", cell: "chia", template: "tenon-cashew-butter-chia-elevated", fromId: "cashew-butter" },
  { ing: "peanut-butter-smooth", cell: "overnight-oats", template: "tenon-pecan-butter-overnight-oats-elevated", fromId: "pecan-butter" },
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
  out = out.replaceAll("Six thousand builds.", "Six thousand fifty builds.");
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
