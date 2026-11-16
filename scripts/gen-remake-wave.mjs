#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6101;
const baseBuilds = 6100;

const INGREDIENTS = [
  {
    id: "date-syrup",
    code: "ING-496",
    name: "Date Syrup",
    category: "sweetener",
    density: 1.4,
    fdc: "FDC 171726 · Dates, medjool (SR Legacy) as date syrup proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Date syrup. Nutrition uses medjool date proxy until a dedicated syrup FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 277,
      protein_g: 1.8,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 75.0,
      sugars_g: 66.5,
      fibre_g: 6.7,
      sodium_mg: 1,
      calcium_mg: 64,
      iron_mg: 0.9,
      magnesium_mg: 54,
      potassium_mg: 696,
      zinc_mg: 0.4,
      vitamin_a_ug: 7,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-nectar",
    code: "ING-497",
    name: "Coconut Nectar",
    category: "sweetener",
    density: 1.35,
    fdc: "FDC 169661 · Syrups, maple (SR Legacy) as coconut nectar / blossom syrup proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Coconut blossom nectar. Nutrition uses maple syrup proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 260,
      protein_g: 0.04,
      fat_g: 0.06,
      saturated_fat_g: 0.01,
      carbohydrate_g: 67.0,
      sugars_g: 60.5,
      fibre_g: 0,
      sodium_mg: 12,
      calcium_mg: 102,
      iron_mg: 0.1,
      magnesium_mg: 21,
      potassium_mg: 212,
      zinc_mg: 0.7,
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
    id: "agave-syrup",
    code: "ING-498",
    name: "Agave Syrup",
    category: "sweetener",
    density: 1.4,
    fdc: "FDC 170277 · Sweetener, syrup, agave (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Agave syrup. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 310,
      protein_g: 0.1,
      fat_g: 0.5,
      saturated_fat_g: 0,
      carbohydrate_g: 76.4,
      sugars_g: 68.2,
      fibre_g: 0.2,
      sodium_mg: 4,
      calcium_mg: 1,
      iron_mg: 0.1,
      magnesium_mg: 1,
      potassium_mg: 4,
      zinc_mg: 0.01,
      vitamin_a_ug: 0,
      vitamin_c_mg: 17.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "maple-syrup-dark",
    code: "ING-499",
    name: "Maple Syrup Dark",
    category: "sweetener",
    density: 1.37,
    fdc: "FDC 169661 · Syrups, maple (SR Legacy) as dark maple syrup grade. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dark maple syrup. Distinct catalogue cell from maple-syrup for SKU grading. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 260,
      protein_g: 0.04,
      fat_g: 0.06,
      saturated_fat_g: 0.01,
      carbohydrate_g: 67.0,
      sugars_g: 60.5,
      fibre_g: 0,
      sodium_mg: 12,
      calcium_mg: 102,
      iron_mg: 0.1,
      magnesium_mg: 21,
      potassium_mg: 212,
      zinc_mg: 0.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
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
  { ing: "date-syrup", cell: "chia", template: "tenon-flax-butter-chia-elevated", fromId: "flax-butter" },
  { ing: "maple-syrup-dark", cell: "overnight-oats", template: "tenon-coconut-butter-overnight-oats-elevated", fromId: "coconut-butter" },
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
  plant_based: true
  vegetarian: true
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
  out = out.replaceAll("Six thousand one hundred builds.", "Six thousand one hundred fifty builds.");
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
