#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5951;
const baseBuilds = 5950;

const INGREDIENTS = [
  {
    id: "cashew-butter",
    code: "ING-484",
    name: "Cashew Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 168589 · Nuts, cashew butter, plain, without salt added (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Plain cashew butter without salt. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 587,
      protein_g: 17.6,
      fat_g: 49.4,
      saturated_fat_g: 9.8,
      carbohydrate_g: 27.6,
      sugars_g: 0,
      fibre_g: 2.0,
      sodium_mg: 15,
      calcium_mg: 43,
      iron_mg: 5.0,
      magnesium_mg: 258,
      potassium_mg: 546,
      zinc_mg: 4.4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 69,
      caffeine_mg: 0,
    },
  },
  {
    id: "sunflower-butter",
    code: "ING-485",
    name: "Sunflower Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 168595 · Seeds, sunflower seed butter, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Plain sunflower seed butter without salt. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 617,
      protein_g: 17.3,
      fat_g: 55.2,
      saturated_fat_g: 5.4,
      carbohydrate_g: 23.3,
      sugars_g: 10.5,
      fibre_g: 5.7,
      sodium_mg: 3,
      calcium_mg: 61,
      iron_mg: 4.1,
      magnesium_mg: 311,
      potassium_mg: 576,
      zinc_mg: 4.9,
      vitamin_a_ug: 3,
      vitamin_c_mg: 2.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 237,
      caffeine_mg: 0,
    },
  },
  {
    id: "pumpkin-seed-butter",
    code: "ING-486",
    name: "Pumpkin Seed Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170556 · Seeds, pumpkin and squash seed kernels, dried (SR Legacy) as pumpkin seed butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Plain pumpkin seed butter. Nutrition uses dried pumpkin seed kernel proxy until a dedicated butter FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 559,
      protein_g: 30.2,
      fat_g: 49.1,
      saturated_fat_g: 8.7,
      carbohydrate_g: 10.7,
      sugars_g: 1.4,
      fibre_g: 6.0,
      sodium_mg: 7,
      calcium_mg: 46,
      iron_mg: 8.8,
      magnesium_mg: 592,
      potassium_mg: 809,
      zinc_mg: 7.8,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 7.3,
      vitamin_b12_ug: 0,
      folate_ug: 58,
      caffeine_mg: 0,
    },
  },
  {
    id: "pecan-butter",
    code: "ING-487",
    name: "Pecan Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170182 · Nuts, pecans (SR Legacy) as pecan butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Plain pecan butter. Nutrition uses whole pecan proxy until a dedicated butter FDC row or café CoA lands. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 691,
      protein_g: 9.2,
      fat_g: 72.0,
      saturated_fat_g: 6.2,
      carbohydrate_g: 13.9,
      sugars_g: 4.0,
      fibre_g: 9.6,
      sodium_mg: 0,
      calcium_mg: 70,
      iron_mg: 2.5,
      magnesium_mg: 121,
      potassium_mg: 410,
      zinc_mg: 4.5,
      vitamin_a_ug: 3,
      vitamin_c_mg: 1.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 22,
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
  { ing: "cashew-butter", cell: "chia", template: "tenon-pine-nut-chia-elevated", fromId: "pine-nut" },
  { ing: "pecan-butter", cell: "overnight-oats", template: "tenon-pistachio-butter-overnight-oats-elevated", fromId: "pistachio-butter" },
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
  out = out.replaceAll("Five thousand nine hundred fifty builds.", "Six thousand builds.");
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
