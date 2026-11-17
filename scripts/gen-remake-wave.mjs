#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 14041;
const baseBuilds = 14040;
const proseCount = "Fourteen thousand ninety builds.";

const INGREDIENTS = [
  {
    id: "black-sesame-seed-powder",
    code: "ING-1134",
    name: "Black Sesame Seed Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170150 · Seeds, sesame seeds, whole, dried (SR Legacy) as black sesame seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Black sesame seed powder (distinct from sesame-seed-powder and whole black sesame). Contains sesame. Nutrition uses whole dried sesame until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 573,
      protein_g: 17.7,
      fat_g: 49.7,
      saturated_fat_g: 7,
      carbohydrate_g: 23.4,
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
    id: "white-sesame-seed-powder",
    code: "ING-1135",
    name: "White Sesame Seed Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 169412 · Seeds, sesame seed kernels, dried (decorticated) (SR Legacy) as white sesame seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "White sesame seed powder (distinct from sesame-seed-powder and whole white sesame). Contains sesame. Nutrition uses decorticated dried sesame until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 631,
      protein_g: 20.5,
      fat_g: 61.2,
      saturated_fat_g: 9.1,
      carbohydrate_g: 11.7,
      sugars_g: 0.5,
      fibre_g: 11.6,
      sodium_mg: 47,
      calcium_mg: 60,
      iron_mg: 6.4,
      magnesium_mg: 345,
      potassium_mg: 370,
      zinc_mg: 6.7,
      vitamin_a_ug: 3,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 115,
      caffeine_mg: 0,
    },
  },
  {
    id: "toasted-sesame-seed-powder",
    code: "ING-1136",
    name: "Toasted Sesame Seed Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170152 · Seeds, sesame seed kernels, toasted, without salt added (decorticated) (SR Legacy) as toasted sesame seed powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Toasted sesame seed powder (distinct from sesame-seed-powder and whole toasted sesame). Contains sesame. Nutrition uses toasted decorticated sesame until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 567,
      protein_g: 17,
      fat_g: 48,
      saturated_fat_g: 6.7,
      carbohydrate_g: 26,
      sugars_g: 0.5,
      fibre_g: 16.9,
      sodium_mg: 39,
      calcium_mg: 131,
      iron_mg: 7.8,
      magnesium_mg: 346,
      potassium_mg: 406,
      zinc_mg: 10,
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
    id: "hemp-hearts-powder",
    code: "ING-1137",
    name: "Hemp Hearts Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170148 · Seeds, hemp seed, hulled (SR Legacy) as hemp hearts powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hemp hearts powder (distinct from hemp-seed-powder and whole hemp hearts). Nutrition uses SR Legacy hulled hemp until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 553,
      protein_g: 31.6,
      fat_g: 48.8,
      saturated_fat_g: 4.6,
      carbohydrate_g: 8.7,
      sugars_g: 1.5,
      fibre_g: 4,
      sodium_mg: 5,
      calcium_mg: 70,
      iron_mg: 8,
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
  { ing: "black-sesame-seed-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "hemp-hearts-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
