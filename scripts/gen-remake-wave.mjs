#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7515;
const baseBuilds = 7514;

const INGREDIENTS = [
  {
    id: "champagne-vinegar",
    code: "ING-610",
    name: "Champagne Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as champagne vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Champagne vinegar. Nutrition uses distilled vinegar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 18,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.6,
      sugars_g: 0.4,
      fibre_g: 0,
      sodium_mg: 4,
      calcium_mg: 6,
      iron_mg: 0.1,
      magnesium_mg: 2,
      potassium_mg: 15,
      zinc_mg: 0.01,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "malt-vinegar",
    code: "ING-611",
    name: "Malt Vinegar",
    category: "other",
    density: 1.02,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as malt vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Malt vinegar. Gluten allergen from barley malt. Nutrition uses distilled vinegar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 21,
      protein_g: 0.1,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.9,
      sugars_g: 0.7,
      fibre_g: 0,
      sodium_mg: 6,
      calcium_mg: 7,
      iron_mg: 0.2,
      magnesium_mg: 3,
      potassium_mg: 22,
      zinc_mg: 0.02,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-vinegar",
    code: "ING-612",
    name: "Coconut Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as coconut vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Coconut vinegar. Nutrition uses distilled vinegar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 16,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.5,
      sugars_g: 0.3,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 2,
      potassium_mg: 18,
      zinc_mg: 0.01,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "zaatar",
    code: "ING-613",
    name: "Za'atar",
    category: "spice",
    density: 0.4,
    fdc: "FDC 171328 · Spices, thyme, dried (SR Legacy) as za'atar proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Za'atar blend (thyme/sumac/sesame). Sesame allergen. Nutrition uses dried thyme proxy until a dedicated blend CoA lands. Replace with the café SOP when locked.",
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
  { ing: "champagne-vinegar", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "zaatar", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Seven thousand five hundred sixty-four builds.");
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
