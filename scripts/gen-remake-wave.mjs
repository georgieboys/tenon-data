#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11541;
const baseBuilds = 11540;
const proseCount = "Eleven thousand five hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "mekabu",
    code: "ING-934",
    name: "Mekabu",
    category: "other",
    density: 0.9,
    fdc: "FDC 170495 · Seaweed, wakame, raw (SR Legacy) as mekabu (wakame sporophyll) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Mekabu (wakame sporophyll paste). Nutrition uses wakame proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 45,
      protein_g: 3.0,
      fat_g: 0.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 9.1,
      sugars_g: 0.6,
      fibre_g: 0.5,
      sodium_mg: 872,
      calcium_mg: 150,
      iron_mg: 2.2,
      magnesium_mg: 107,
      potassium_mg: 50,
      zinc_mg: 0.4,
      vitamin_a_ug: 36,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.3,
      vitamin_b12_ug: 0,
      folate_ug: 196,
      caffeine_mg: 0,
    },
  },
  {
    id: "mozuku",
    code: "ING-935",
    name: "Mozuku",
    category: "other",
    density: 0.95,
    fdc: "FDC 168454 · Seaweed, irishmoss, raw (SR Legacy) as mozuku (Cladosiphon) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Mozuku (Okinawan brown alga, often packed in vinegar). Nutrition uses irishmoss proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 49,
      protein_g: 1.5,
      fat_g: 0.2,
      saturated_fat_g: 0.0,
      carbohydrate_g: 12.3,
      sugars_g: 0.5,
      fibre_g: 1.3,
      sodium_mg: 67,
      calcium_mg: 72,
      iron_mg: 8.9,
      magnesium_mg: 144,
      potassium_mg: 63,
      zinc_mg: 2.0,
      vitamin_a_ug: 6,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 182,
      caffeine_mg: 0,
    },
  },
  {
    id: "sea-lettuce",
    code: "ING-936",
    name: "Sea Lettuce",
    category: "other",
    density: 0.3,
    fdc: "FDC 168456 · Seaweed, kelp, raw (SR Legacy) as sea lettuce (Ulva) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sea lettuce (Ulva). Nutrition uses kelp proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 43,
      protein_g: 1.7,
      fat_g: 0.6,
      saturated_fat_g: 0.2,
      carbohydrate_g: 9.6,
      sugars_g: 0.6,
      fibre_g: 1.3,
      sodium_mg: 233,
      calcium_mg: 168,
      iron_mg: 2.9,
      magnesium_mg: 121,
      potassium_mg: 89,
      zinc_mg: 1.2,
      vitamin_a_ug: 6,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 66,
      vitamin_b12_ug: 0,
      folate_ug: 180,
      caffeine_mg: 0,
    },
  },
  {
    id: "irish-moss",
    code: "ING-937",
    name: "Irish Moss",
    category: "other",
    density: 0.4,
    fdc: "FDC 168454 · Seaweed, irishmoss, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Irish moss (Chondrus crispus). Nutrition uses SR Legacy irishmoss until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 49,
      protein_g: 1.5,
      fat_g: 0.2,
      saturated_fat_g: 0.0,
      carbohydrate_g: 12.3,
      sugars_g: 0.5,
      fibre_g: 1.3,
      sodium_mg: 67,
      calcium_mg: 72,
      iron_mg: 8.9,
      magnesium_mg: 144,
      potassium_mg: 63,
      zinc_mg: 2.0,
      vitamin_a_ug: 6,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 182,
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
  { ing: "irish-moss", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "mekabu", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
