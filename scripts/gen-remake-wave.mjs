#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13991;
const baseBuilds = 13990;
const proseCount = "Fourteen thousand forty builds.";

const INGREDIENTS = [
  {
    id: "brazil-nut-powder",
    code: "ING-1130",
    name: "Brazil Nut Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170569 · Nuts, brazilnuts, dried, unblanched (SR Legacy) as brazil nut powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Brazil nut powder (distinct from whole brazil nut). Contains tree nut. Nutrition uses SR Legacy brazil nut until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 659,
      protein_g: 14.3,
      fat_g: 67.1,
      saturated_fat_g: 16.1,
      carbohydrate_g: 12.3,
      sugars_g: 2.3,
      fibre_g: 7.5,
      sodium_mg: 3,
      calcium_mg: 160,
      iron_mg: 2.4,
      magnesium_mg: 376,
      potassium_mg: 659,
      zinc_mg: 4.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "chestnut-powder",
    code: "ING-1131",
    name: "Chestnut Powder",
    category: "nut_seed",
    density: 0.65,
    fdc: "FDC 170168 · Nuts, chestnuts, european, raw, peeled (SR Legacy) as chestnut powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Chestnut powder (distinct from whole chestnut). Contains tree nut. Nutrition uses SR Legacy european chestnut until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 196,
      protein_g: 1.6,
      fat_g: 1.3,
      saturated_fat_g: 0.2,
      carbohydrate_g: 44.2,
      sugars_g: 0,
      fibre_g: 8.1,
      sodium_mg: 2,
      calcium_mg: 19,
      iron_mg: 0.9,
      magnesium_mg: 30,
      potassium_mg: 484,
      zinc_mg: 0.5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 40.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 58,
      caffeine_mg: 0,
    },
  },
  {
    id: "candlenut-powder",
    code: "ING-1132",
    name: "Candlenut Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170178 · Nuts, macadamia nuts, raw (SR Legacy) as candlenut / kemiri powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Candlenut powder (distinct from whole candlenut). Contains tree nut. Must be cooked before eating. Nutrition uses SR Legacy macadamia as kemiri proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 720,
      protein_g: 8,
      fat_g: 75,
      saturated_fat_g: 12,
      carbohydrate_g: 14,
      sugars_g: 4,
      fibre_g: 8,
      sodium_mg: 5,
      calcium_mg: 85,
      iron_mg: 3.7,
      magnesium_mg: 130,
      potassium_mg: 370,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "tiger-nut-powder",
    code: "ING-1133",
    name: "Tiger Nut Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170581 · Nuts, hazelnuts or filberts (SR Legacy) as tiger nut / chufa powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tiger nut powder (chufa; a tuber, not a tree nut — distinct from tiger nut butter). No declared tree-nut allergen. Nutrition uses a hazelnut SR Legacy proxy shaped to typical chufa macros until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 400,
      protein_g: 5,
      fat_g: 25,
      saturated_fat_g: 5,
      carbohydrate_g: 45,
      sugars_g: 15,
      fibre_g: 15,
      sodium_mg: 5,
      calcium_mg: 50,
      iron_mg: 3,
      magnesium_mg: 80,
      potassium_mg: 400,
      zinc_mg: 1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
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
  { ing: "brazil-nut-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "chestnut-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
