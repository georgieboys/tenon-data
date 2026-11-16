#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11041;
const baseBuilds = 11040;
const proseCount = "Eleven thousand ninety builds.";

const INGREDIENTS = [
  {
    id: "fermented-chili-paste",
    code: "ING-894",
    name: "Fermented Chili Paste",
    category: "spice",
    density: 1.1,
    fdc: "FDC 170000 · Peppers, hot chili, red, canned, excluding seeds, solids and liquids (SR Legacy) as fermented chili paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fermented chili paste. Nutrition uses canned hot chili as a loose proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 8,
      sugars_g: 4,
      fibre_g: 2,
      sodium_mg: 900,
      calcium_mg: 20,
      iron_mg: 0.8,
      magnesium_mg: 15,
      potassium_mg: 200,
      zinc_mg: 0.2,
      vitamin_a_ug: 80,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "carob-chips",
    code: "ING-895",
    name: "Carob Chips",
    category: "other",
    density: 0.6,
    fdc: "FDC 170677 · Carob flour (SR Legacy) as carob chips proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Carob chips. Nutrition uses carob flour as proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 222,
      protein_g: 4.6,
      fat_g: 0.7,
      saturated_fat_g: 0.1,
      carbohydrate_g: 89,
      sugars_g: 49,
      fibre_g: 39.8,
      sodium_mg: 35,
      calcium_mg: 348,
      iron_mg: 2.9,
      magnesium_mg: 54,
      potassium_mg: 827,
      zinc_mg: 0.9,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 29,
      caffeine_mg: 0,
    },
  },
  {
    id: "dried-lime",
    code: "ING-896",
    name: "Dried Lime",
    category: "fruit",
    density: 0.4,
    fdc: "FDC 167747 · Limes, raw (SR Legacy) as dried lime (loomi) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried lime (loomi / black lime). Nutrition uses raw lime flesh as a loose proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 120,
      protein_g: 2,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 40,
      sugars_g: 5,
      fibre_g: 20,
      sodium_mg: 10,
      calcium_mg: 80,
      iron_mg: 1.5,
      magnesium_mg: 30,
      potassium_mg: 400,
      zinc_mg: 0.3,
      vitamin_a_ug: 5,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "saffron-threads",
    code: "ING-897",
    name: "Saffron Threads",
    category: "spice",
    density: 0.2,
    fdc: "FDC 170934 · Spices, saffron (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Saffron threads. Nutrition uses USDA saffron spice until a café CoA lands. Replace with the café SOP when locked.",
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
  { ing: "saffron-threads", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "carob-chips", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
