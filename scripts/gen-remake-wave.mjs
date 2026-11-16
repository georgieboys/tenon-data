#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11441;
const baseBuilds = 11440;
const proseCount = "Eleven thousand four hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "black-vinegar-aged",
    code: "ING-926",
    name: "Black Vinegar Aged",
    category: "other",
    density: 1.05,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as aged Chinese black vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Aged black vinegar. Nutrition uses distilled vinegar as proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 25,
      protein_g: 0.2,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 2,
      sugars_g: 1.5,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 10,
      iron_mg: 0.2,
      magnesium_mg: 5,
      potassium_mg: 30,
      zinc_mg: 0.05,
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
    id: "tempeh-starter",
    code: "ING-927",
    name: "Tempeh Starter",
    category: "other",
    density: 0.4,
    fdc: "Branded Rhizopus tempeh starter culture label macros (no dedicated SR Legacy row). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tempeh starter (Rhizopus culture on rice carrier). Nutrition is a starch-carrier proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 350,
      protein_g: 8,
      fat_g: 1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 75,
      sugars_g: 1,
      fibre_g: 2,
      sodium_mg: 10,
      calcium_mg: 20,
      iron_mg: 1,
      magnesium_mg: 30,
      potassium_mg: 100,
      zinc_mg: 1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "shiro-dashi",
    code: "ING-928",
    name: "Shiro Dashi",
    category: "other",
    density: 1.15,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as shiro dashi concentrate proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy, gluten]",
    note: "Shiro dashi concentrate. Contains soy and gluten. Nutrition uses soy-sauce proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 50,
      protein_g: 4,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 8,
      sugars_g: 5,
      fibre_g: 0.2,
      sodium_mg: 5000,
      calcium_mg: 20,
      iron_mg: 0.8,
      magnesium_mg: 30,
      potassium_mg: 150,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "toasted-nori-flakes",
    code: "ING-929",
    name: "Toasted Nori Flakes",
    category: "other",
    density: 0.15,
    fdc: "FDC 168457 · Seaweed, laver, raw (SR Legacy) as toasted nori flakes proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Toasted nori flakes. Nutrition uses laver proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 35,
      protein_g: 5.8,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 5.1,
      sugars_g: 0.5,
      fibre_g: 0.3,
      sodium_mg: 48,
      calcium_mg: 70,
      iron_mg: 1.8,
      magnesium_mg: 2,
      potassium_mg: 356,
      zinc_mg: 1.1,
      vitamin_a_ug: 260,
      vitamin_c_mg: 39.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.0,
      vitamin_b12_ug: 0,
      folate_ug: 146,
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
  { ing: "toasted-nori-flakes", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "black-vinegar-aged", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
