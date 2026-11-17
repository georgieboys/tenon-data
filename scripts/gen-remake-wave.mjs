#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13341;
const baseBuilds = 13340;
const proseCount = "Thirteen thousand three hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "lotus-petal-powder",
    code: "ING-1078",
    name: "Lotus Petal Powder",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as lotus petal powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried lotus petal powder (distinct from lotus-root powder). Nutrition uses basil as closest SR Legacy flower proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 45,
      protein_g: 2,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 9,
      sugars_g: 1.5,
      fibre_g: 4,
      sodium_mg: 8,
      calcium_mg: 70,
      iron_mg: 1.5,
      magnesium_mg: 25,
      potassium_mg: 180,
      zinc_mg: 0.3,
      vitamin_a_ug: 40,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "violet-powder",
    code: "ING-1079",
    name: "Violet Powder",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as violet flower powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried violet flower powder. Nutrition uses basil as closest SR Legacy flower proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.8,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 8,
      sugars_g: 1.5,
      fibre_g: 4,
      sodium_mg: 8,
      calcium_mg: 80,
      iron_mg: 1.5,
      magnesium_mg: 25,
      potassium_mg: 160,
      zinc_mg: 0.3,
      vitamin_a_ug: 50,
      vitamin_c_mg: 15,
      vitamin_d_ug: 0,
      vitamin_k_ug: 25,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "lavender-powder",
    code: "ING-1080",
    name: "Lavender Powder",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as lavender flower powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Lavender flower powder (distinct from lavender and lavender-flowers). Nutrition uses basil as closest SR Legacy herb/flower proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 50,
      protein_g: 2,
      fat_g: 0.7,
      saturated_fat_g: 0.1,
      carbohydrate_g: 10,
      sugars_g: 0.5,
      fibre_g: 5,
      sodium_mg: 5,
      calcium_mg: 150,
      iron_mg: 2,
      magnesium_mg: 40,
      potassium_mg: 200,
      zinc_mg: 0.4,
      vitamin_a_ug: 50,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 30,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "saffron-powder",
    code: "ING-1081",
    name: "Saffron Powder",
    category: "spice",
    density: 0.35,
    fdc: "FDC 170928 · Spices, saffron (SR Legacy) as saffron powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Saffron powder (distinct from saffron threads). Nutrition uses SR Legacy saffron until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 310,
      protein_g: 11.4,
      fat_g: 5.9,
      saturated_fat_g: 1.6,
      carbohydrate_g: 65.4,
      sugars_g: 0,
      fibre_g: 3.9,
      sodium_mg: 148,
      calcium_mg: 111,
      iron_mg: 11.1,
      magnesium_mg: 264,
      potassium_mg: 1724,
      zinc_mg: 1.1,
      vitamin_a_ug: 27,
      vitamin_c_mg: 80.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 93,
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
  { ing: "lavender-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "saffron-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
