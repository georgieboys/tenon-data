#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9715;
const baseBuilds = 9714;

const INGREDIENTS = [
  {
    id: "calamansi-juice",
    code: "ING-786",
    name: "Calamansi Juice",
    category: "fruit",
    density: 1.03,
    fdc: "FDC 167747 · Lemon juice, raw (SR Legacy) as calamansi juice proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Calamansi juice. Nutrition uses lemon juice proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 25,
      protein_g: 0.4,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 7.5,
      sugars_g: 2.0,
      fibre_g: 0.3,
      sodium_mg: 1,
      calcium_mg: 10,
      iron_mg: 0.1,
      magnesium_mg: 8,
      potassium_mg: 110,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 45.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "tamarind-paste",
    code: "ING-787",
    name: "Tamarind Paste",
    category: "fruit",
    density: 1.2,
    fdc: "FDC 167781 · Tamarinds, raw (SR Legacy) as tamarind paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tamarind paste. Nutrition uses raw tamarind proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 239,
      protein_g: 2.8,
      fat_g: 0.6,
      saturated_fat_g: 0.3,
      carbohydrate_g: 62.5,
      sugars_g: 57.4,
      fibre_g: 5.1,
      sodium_mg: 28,
      calcium_mg: 74,
      iron_mg: 2.8,
      magnesium_mg: 92,
      potassium_mg: 628,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 3.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.8,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-sugar-dark",
    code: "ING-788",
    name: "Coconut Sugar Dark",
    category: "sweetener",
    density: 0.8,
    fdc: "FDC 168820 · Sugars, brown (SR Legacy) as dark coconut sugar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dark coconut sugar. Nutrition uses brown sugar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 375,
      protein_g: 1.0,
      fat_g: 0.5,
      saturated_fat_g: 0.4,
      carbohydrate_g: 92.0,
      sugars_g: 90.0,
      fibre_g: 0,
      sodium_mg: 30,
      calcium_mg: 30,
      iron_mg: 1.5,
      magnesium_mg: 20,
      potassium_mg: 800,
      zinc_mg: 0.5,
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
    id: "cricket-protein-powder",
    code: "ING-789",
    name: "Cricket Protein Powder",
    category: "protein_powder",
    density: 0.5,
    fdc: "FDC 174270 · Protein supplement, milk based, powder (SR Legacy) as cricket protein powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[crustacean]",
    note: "Cricket protein powder. May trigger crustacean allergy cross-reactivity; labelled crustacean for safety until a dedicated row lands. Not plant-based. Nutrition uses generic protein powder proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: false },
    nutrition: {
      energy_kcal: 400,
      protein_g: 65.0,
      fat_g: 15.0,
      saturated_fat_g: 5.0,
      carbohydrate_g: 10.0,
      sugars_g: 0,
      fibre_g: 5.0,
      sodium_mg: 200,
      calcium_mg: 100,
      iron_mg: 8.0,
      magnesium_mg: 100,
      potassium_mg: 600,
      zinc_mg: 10.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 5.0,
      folate_ug: 50,
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
  { ing: "calamansi-juice", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "cricket-protein-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand seven hundred sixty-four builds.");
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
