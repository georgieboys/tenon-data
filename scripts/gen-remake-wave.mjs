#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12941;
const baseBuilds = 12940;
const proseCount = "Twelve thousand nine hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "onion-flakes",
    code: "ING-1046",
    name: "Onion Flakes",
    category: "spice",
    density: 0.35,
    fdc: "FDC 171327 · Spices, onion powder (SR Legacy) as onion flakes proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried onion flakes (distinct from raw onion). Nutrition uses SR Legacy onion powder as closest dry-onion proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 341,
      protein_g: 10.4,
      fat_g: 1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 79.1,
      sugars_g: 4.8,
      fibre_g: 15.2,
      sodium_mg: 73,
      calcium_mg: 384,
      iron_mg: 3.9,
      magnesium_mg: 113,
      potassium_mg: 985,
      zinc_mg: 2.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 23.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.2,
      vitamin_b12_ug: 0,
      folate_ug: 64,
      caffeine_mg: 0,
    },
  },
  {
    id: "tomato-powder",
    code: "ING-1047",
    name: "Tomato Powder",
    category: "spice",
    density: 0.5,
    fdc: "FDC 170457 · Tomatoes, red, ripe, raw (SR Legacy) as tomato powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tomato powder. Nutrition uses raw tomato as closest SR Legacy proxy until a café CoA lands; solids are concentrated vs fresh. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 302,
      protein_g: 12.9,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 64.8,
      sugars_g: 43.9,
      fibre_g: 12.3,
      sodium_mg: 134,
      calcium_mg: 140,
      iron_mg: 4.5,
      magnesium_mg: 120,
      potassium_mg: 2500,
      zinc_mg: 1.2,
      vitamin_a_ug: 800,
      vitamin_c_mg: 100,
      vitamin_d_ug: 0,
      vitamin_k_ug: 40,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "carrot-powder",
    code: "ING-1048",
    name: "Carrot Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170393 · Carrots, raw (SR Legacy) as carrot powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Carrot powder. Nutrition uses raw carrot as closest SR Legacy proxy until a café CoA lands; solids are concentrated vs fresh. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 320,
      protein_g: 8,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 72,
      sugars_g: 35,
      fibre_g: 22,
      sodium_mg: 250,
      calcium_mg: 200,
      iron_mg: 3,
      magnesium_mg: 80,
      potassium_mg: 1800,
      zinc_mg: 1,
      vitamin_a_ug: 5000,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 50,
      vitamin_b12_ug: 0,
      folate_ug: 60,
      caffeine_mg: 0,
    },
  },
  {
    id: "spinach-powder",
    code: "ING-1049",
    name: "Spinach Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as spinach powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Spinach powder. Nutrition uses raw spinach as closest SR Legacy proxy until a café CoA lands; solids are concentrated vs fresh. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 28,
      fat_g: 3.5,
      saturated_fat_g: 0.5,
      carbohydrate_g: 40,
      sugars_g: 4,
      fibre_g: 20,
      sodium_mg: 400,
      calcium_mg: 900,
      iron_mg: 25,
      magnesium_mg: 600,
      potassium_mg: 4500,
      zinc_mg: 4,
      vitamin_a_ug: 4000,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4000,
      vitamin_b12_ug: 0,
      folate_ug: 800,
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
  { ing: "tomato-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "spinach-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
