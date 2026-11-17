#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13541;
const baseBuilds = 13540;
const proseCount = "Thirteen thousand five hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "rice-bran-powder",
    code: "ING-1094",
    name: "Rice Bran Powder",
    category: "grain",
    density: 0.45,
    fdc: "FDC 169714 · Rice bran, crude (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Rice bran powder (distinct from rice-bran-oil). Nutrition uses SR Legacy rice bran until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 316,
      protein_g: 13.4,
      fat_g: 20.9,
      saturated_fat_g: 4.2,
      carbohydrate_g: 49.7,
      sugars_g: 0.9,
      fibre_g: 21,
      sodium_mg: 5,
      calcium_mg: 57,
      iron_mg: 18.5,
      magnesium_mg: 781,
      potassium_mg: 1485,
      zinc_mg: 6,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 63,
      caffeine_mg: 0,
    },
  },
  {
    id: "oat-bran-powder",
    code: "ING-1095",
    name: "Oat Bran Powder",
    category: "grain",
    density: 0.5,
    fdc: "FDC 173904 · Oat bran, raw (SR Legacy) as oat bran powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Oat bran powder (finer mill of oat bran). Contains gluten (oats; cross-contact risk). Nutrition uses SR Legacy oat bran until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 246,
      protein_g: 17.3,
      fat_g: 7,
      saturated_fat_g: 1.3,
      carbohydrate_g: 66.2,
      sugars_g: 1.5,
      fibre_g: 15.4,
      sodium_mg: 4,
      calcium_mg: 58,
      iron_mg: 5.4,
      magnesium_mg: 235,
      potassium_mg: 566,
      zinc_mg: 3.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 52,
      caffeine_mg: 0,
    },
  },
  {
    id: "wheat-bran-powder",
    code: "ING-1096",
    name: "Wheat Bran Powder",
    category: "grain",
    density: 0.4,
    fdc: "FDC 169722 · Wheat bran, crude (SR Legacy) as wheat bran powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Wheat bran powder (finer mill of wheat bran). Contains gluten. Nutrition uses SR Legacy wheat bran until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 216,
      protein_g: 15.6,
      fat_g: 4.3,
      saturated_fat_g: 0.6,
      carbohydrate_g: 64.5,
      sugars_g: 0.4,
      fibre_g: 42.8,
      sodium_mg: 2,
      calcium_mg: 73,
      iron_mg: 10.6,
      magnesium_mg: 611,
      potassium_mg: 1182,
      zinc_mg: 7.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 79,
      caffeine_mg: 0,
    },
  },
  {
    id: "barley-bran-powder",
    code: "ING-1097",
    name: "Barley Bran Powder",
    category: "grain",
    density: 0.4,
    fdc: "FDC 170283 · Barley, hulled (SR Legacy) as barley bran powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Barley bran powder. Contains gluten. Nutrition uses hulled barley as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 12,
      fat_g: 3,
      saturated_fat_g: 0.5,
      carbohydrate_g: 60,
      sugars_g: 1,
      fibre_g: 25,
      sodium_mg: 10,
      calcium_mg: 40,
      iron_mg: 4,
      magnesium_mg: 120,
      potassium_mg: 500,
      zinc_mg: 2.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2,
      vitamin_b12_ug: 0,
      folate_ug: 30,
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
  { ing: "rice-bran-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "wheat-bran-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
