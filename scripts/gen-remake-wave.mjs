#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11941;
const baseBuilds = 11940;
const proseCount = "Eleven thousand nine hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "calcium-alginate",
    code: "ING-966",
    name: "Calcium Alginate",
    category: "other",
    density: 0.7,
    fdc: "FDC 168456 · Seaweed, kelp, raw (SR Legacy) as calcium alginate proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Calcium alginate. Nutrition uses kelp as closest SR Legacy seaweed proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 43,
      protein_g: 1.7,
      fat_g: 0.6,
      saturated_fat_g: 0.2,
      carbohydrate_g: 9.6,
      sugars_g: 0.6,
      fibre_g: 1.3,
      sodium_mg: 50,
      calcium_mg: 2000,
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
    id: "tara-gum",
    code: "ING-967",
    name: "Tara Gum",
    category: "other",
    density: 0.55,
    fdc: "Branded tara gum (Caesalpinia spinosa) (no dedicated SR Legacy row). Fibre-gum proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tara gum. Nutrition is a branded fibre-gum proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 160,
      protein_g: 3.0,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 82.0,
      sugars_g: 0.5,
      fibre_g: 78.0,
      sodium_mg: 25,
      calcium_mg: 80,
      iron_mg: 1.5,
      magnesium_mg: 30,
      potassium_mg: 150,
      zinc_mg: 0.4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "tragacanth",
    code: "ING-968",
    name: "Tragacanth",
    category: "other",
    density: 0.55,
    fdc: "Branded gum tragacanth (no dedicated SR Legacy row). Fibre-gum proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Gum tragacanth. Nutrition is a branded fibre-gum proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 150,
      protein_g: 2.0,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 84.0,
      sugars_g: 0.5,
      fibre_g: 80.0,
      sodium_mg: 20,
      calcium_mg: 120,
      iron_mg: 2.0,
      magnesium_mg: 40,
      potassium_mg: 180,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "acacia-fiber",
    code: "ING-969",
    name: "Acacia Fiber",
    category: "other",
    density: 0.55,
    fdc: "Branded acacia fiber / gum arabic soluble fibre (no dedicated SR Legacy row). Soluble-fibre proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Acacia fiber (soluble gum arabic fibre). Nutrition is a branded soluble-fibre proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 200,
      protein_g: 1.5,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 90.0,
      sugars_g: 0.5,
      fibre_g: 85.0,
      sodium_mg: 25,
      calcium_mg: 180,
      iron_mg: 0.8,
      magnesium_mg: 45,
      potassium_mg: 280,
      zinc_mg: 0.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 5,
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
  { ing: "acacia-fiber", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "tara-gum", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
