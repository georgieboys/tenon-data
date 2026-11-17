#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13841;
const baseBuilds = 13840;
const proseCount = "Thirteen thousand eight hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "sunflower-seed-powder",
    code: "ING-1118",
    name: "Sunflower Seed Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170562 · Seeds, sunflower seed kernels, dried (SR Legacy) as sunflower seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sunflower seed powder (distinct from sunflower-seed). Nutrition uses SR Legacy sunflower seed kernels until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 584,
      protein_g: 20.8,
      fat_g: 51.5,
      saturated_fat_g: 4.5,
      carbohydrate_g: 20,
      sugars_g: 2.6,
      fibre_g: 8.6,
      sodium_mg: 9,
      calcium_mg: 78,
      iron_mg: 5.3,
      magnesium_mg: 325,
      potassium_mg: 645,
      zinc_mg: 5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 227,
      caffeine_mg: 0,
    },
  },
  {
    id: "sesame-seed-powder",
    code: "ING-1119",
    name: "Sesame Seed Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170150 · Seeds, sesame seeds, whole, dried (SR Legacy) as sesame seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: '["sesame"]',
    note: "Sesame seed powder (distinct from whole sesame). Contains sesame. Nutrition uses SR Legacy sesame until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 573,
      protein_g: 17.7,
      fat_g: 49.7,
      saturated_fat_g: 7,
      carbohydrate_g: 23.5,
      sugars_g: 0.3,
      fibre_g: 11.8,
      sodium_mg: 11,
      calcium_mg: 975,
      iron_mg: 14.6,
      magnesium_mg: 351,
      potassium_mg: 468,
      zinc_mg: 7.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 97,
      caffeine_mg: 0,
    },
  },
  {
    id: "watermelon-seed-powder",
    code: "ING-1120",
    name: "Watermelon Seed Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170556 · Seeds, pumpkin and squash seed kernels, dried (SR Legacy) as watermelon seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Watermelon seed powder. Nutrition uses pumpkin seed kernels as closest SR Legacy seed-kernel proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 550,
      protein_g: 28,
      fat_g: 47,
      saturated_fat_g: 8,
      carbohydrate_g: 15,
      sugars_g: 1,
      fibre_g: 5,
      sodium_mg: 10,
      calcium_mg: 50,
      iron_mg: 7,
      magnesium_mg: 500,
      potassium_mg: 700,
      zinc_mg: 7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "poppy-seed-powder",
    code: "ING-1121",
    name: "Poppy Seed Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 171330 · Spices, poppy seed (SR Legacy) as poppy seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Poppy seed powder (distinct from whole poppy-seed). Nutrition uses SR Legacy poppy seed until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 525,
      protein_g: 18,
      fat_g: 42,
      saturated_fat_g: 4.5,
      carbohydrate_g: 28,
      sugars_g: 3,
      fibre_g: 20,
      sodium_mg: 26,
      calcium_mg: 1438,
      iron_mg: 9.8,
      magnesium_mg: 347,
      potassium_mg: 719,
      zinc_mg: 7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 82,
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
  { ing: "sunflower-seed-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "sesame-seed-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
