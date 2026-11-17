#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12791;
const baseBuilds = 12790;
const proseCount = "Twelve thousand eight hundred forty builds.";

const INGREDIENTS = [
  {
    id: "thyme-dried",
    code: "ING-1034",
    name: "Thyme Dried",
    category: "spice",
    density: 0.3,
    fdc: "FDC 170938 · Spices, thyme, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried thyme (distinct from the fresh thyme cell). Nutrition uses SR Legacy dried thyme until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 276,
      protein_g: 9.1,
      fat_g: 7.4,
      saturated_fat_g: 2.7,
      carbohydrate_g: 63.9,
      sugars_g: 1.7,
      fibre_g: 37,
      sodium_mg: 55,
      calcium_mg: 1890,
      iron_mg: 123.6,
      magnesium_mg: 220,
      potassium_mg: 814,
      zinc_mg: 6.2,
      vitamin_a_ug: 190,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1714.5,
      vitamin_b12_ug: 0,
      folate_ug: 274,
      caffeine_mg: 0,
    },
  },
  {
    id: "rosemary-dried",
    code: "ING-1035",
    name: "Rosemary Dried",
    category: "spice",
    density: 0.3,
    fdc: "FDC 171333 · Spices, rosemary, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried rosemary (distinct from the fresh rosemary cell). Nutrition uses SR Legacy dried rosemary until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 331,
      protein_g: 4.9,
      fat_g: 15.2,
      saturated_fat_g: 7.4,
      carbohydrate_g: 64.1,
      sugars_g: 0,
      fibre_g: 42.6,
      sodium_mg: 50,
      calcium_mg: 1280,
      iron_mg: 29.2,
      magnesium_mg: 220,
      potassium_mg: 955,
      zinc_mg: 3.2,
      vitamin_a_ug: 156,
      vitamin_c_mg: 61.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 307,
      caffeine_mg: 0,
    },
  },
  {
    id: "basil-dried",
    code: "ING-1036",
    name: "Basil Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 171317 · Spices, basil, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried basil (distinct from the fresh basil cell). Nutrition uses SR Legacy dried basil until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 233,
      protein_g: 23,
      fat_g: 4.1,
      saturated_fat_g: 2.2,
      carbohydrate_g: 47.8,
      sugars_g: 1.7,
      fibre_g: 37.7,
      sodium_mg: 34,
      calcium_mg: 2240,
      iron_mg: 89.8,
      magnesium_mg: 711,
      potassium_mg: 2630,
      zinc_mg: 5.8,
      vitamin_a_ug: 469,
      vitamin_c_mg: 0.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1714.5,
      vitamin_b12_ug: 0,
      folate_ug: 310,
      caffeine_mg: 0,
    },
  },
  {
    id: "tarragon-dried",
    code: "ING-1037",
    name: "Tarragon Dried",
    category: "spice",
    density: 0.3,
    fdc: "FDC 170937 · Spices, tarragon, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried tarragon (distinct from the existing tarragon cell). Nutrition uses SR Legacy dried tarragon until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 295,
      protein_g: 22.8,
      fat_g: 7.2,
      saturated_fat_g: 1.9,
      carbohydrate_g: 50.2,
      sugars_g: 0,
      fibre_g: 7.4,
      sodium_mg: 62,
      calcium_mg: 1139,
      iron_mg: 32.3,
      magnesium_mg: 347,
      potassium_mg: 3020,
      zinc_mg: 3.9,
      vitamin_a_ug: 210,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 274,
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
  { ing: "basil-dried", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "tarragon-dried", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  let out = src.replaceAll("raspberry", "__ING__");
  out = out.replaceAll("tenon-__ING__-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon __ING__ ", `Tenon ${title} `);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("__ING__", ingId);
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", proseCount);
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
