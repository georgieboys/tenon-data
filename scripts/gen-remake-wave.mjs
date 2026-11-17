#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12891;
const baseBuilds = 12890;
const proseCount = "Twelve thousand nine hundred forty builds.";

const INGREDIENTS = [
  {
    id: "parsley-dried",
    code: "ING-1042",
    name: "Parsley Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 170929 · Spices, parsley, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried parsley (distinct from the fresh parsley cell). Nutrition uses SR Legacy dried parsley until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 292,
      protein_g: 26.6,
      fat_g: 5.5,
      saturated_fat_g: 1.4,
      carbohydrate_g: 50.6,
      sugars_g: 7.3,
      fibre_g: 26.7,
      sodium_mg: 452,
      calcium_mg: 1140,
      iron_mg: 97.9,
      magnesium_mg: 400,
      potassium_mg: 2680,
      zinc_mg: 5.4,
      vitamin_a_ug: 421,
      vitamin_c_mg: 125,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1359.5,
      vitamin_b12_ug: 0,
      folate_ug: 180,
      caffeine_mg: 0,
    },
  },
  {
    id: "cilantro-dried",
    code: "ING-1043",
    name: "Cilantro Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 169997 · Coriander (cilantro) leaves, raw (SR Legacy) as dried cilantro proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried cilantro leaf (distinct from fresh cilantro and coriander seed). Nutrition uses raw cilantro as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 279,
      protein_g: 21.9,
      fat_g: 4.8,
      saturated_fat_g: 0.1,
      carbohydrate_g: 52.1,
      sugars_g: 7.3,
      fibre_g: 10.4,
      sodium_mg: 211,
      calcium_mg: 1246,
      iron_mg: 42.5,
      magnesium_mg: 694,
      potassium_mg: 4466,
      zinc_mg: 4.7,
      vitamin_a_ug: 293,
      vitamin_c_mg: 566.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1359.5,
      vitamin_b12_ug: 0,
      folate_ug: 274,
      caffeine_mg: 0,
    },
  },
  {
    id: "chive-dried",
    code: "ING-1044",
    name: "Chive Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 169994 · Chives, raw (SR Legacy) as dried chive proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried chives (distinct from fresh chive/chives cells). Nutrition uses raw chives as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 311,
      protein_g: 21.2,
      fat_g: 3.5,
      saturated_fat_g: 0.6,
      carbohydrate_g: 64.3,
      sugars_g: 0,
      fibre_g: 26.2,
      sodium_mg: 70,
      calcium_mg: 813,
      iron_mg: 19.6,
      magnesium_mg: 474,
      potassium_mg: 2120,
      zinc_mg: 3.7,
      vitamin_a_ug: 500,
      vitamin_c_mg: 58.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1900,
      vitamin_b12_ug: 0,
      folate_ug: 105,
      caffeine_mg: 0,
    },
  },
  {
    id: "garlic-flakes",
    code: "ING-1045",
    name: "Garlic Flakes",
    category: "spice",
    density: 0.4,
    fdc: "FDC 171325 · Spices, garlic powder (SR Legacy) as garlic flakes proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried garlic flakes (distinct from raw garlic). Nutrition uses SR Legacy garlic powder as closest dry-garlic proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 331,
      protein_g: 16.6,
      fat_g: 0.7,
      saturated_fat_g: 0.2,
      carbohydrate_g: 72.7,
      sugars_g: 2.4,
      fibre_g: 9,
      sodium_mg: 60,
      calcium_mg: 79,
      iron_mg: 5.7,
      magnesium_mg: 77,
      potassium_mg: 1193,
      zinc_mg: 3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.4,
      vitamin_b12_ug: 0,
      folate_ug: 47,
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
  { ing: "parsley-dried", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "garlic-flakes", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
