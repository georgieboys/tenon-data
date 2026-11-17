#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13191;
const baseBuilds = 13190;
const proseCount = "Thirteen thousand two hundred forty builds.";

const INGREDIENTS = [
  {
    id: "orange-zest-dried",
    code: "ING-1066",
    name: "Orange Zest Dried",
    category: "spice",
    density: 0.3,
    fdc: "FDC 169917 · Orange peel, raw (SR Legacy) as dried orange zest proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried orange zest. Nutrition uses orange peel as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 97,
      protein_g: 1.5,
      fat_g: 0.2,
      saturated_fat_g: 0.05,
      carbohydrate_g: 25,
      sugars_g: 10,
      fibre_g: 10.6,
      sodium_mg: 3,
      calcium_mg: 161,
      iron_mg: 0.8,
      magnesium_mg: 22,
      potassium_mg: 212,
      zinc_mg: 0.25,
      vitamin_a_ug: 21,
      vitamin_c_mg: 136,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 0,
    },
  },
  {
    id: "lime-zest-dried",
    code: "ING-1067",
    name: "Lime Zest Dried",
    category: "spice",
    density: 0.3,
    fdc: "FDC 167748 · Lemon peel, raw (SR Legacy) as dried lime zest proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried lime zest. Nutrition uses lemon peel as closest SR Legacy citrus-peel proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 47,
      protein_g: 1.5,
      fat_g: 0.3,
      saturated_fat_g: 0.05,
      carbohydrate_g: 16,
      sugars_g: 4,
      fibre_g: 10.6,
      sodium_mg: 6,
      calcium_mg: 134,
      iron_mg: 0.7,
      magnesium_mg: 15,
      potassium_mg: 160,
      zinc_mg: 0.25,
      vitamin_a_ug: 3,
      vitamin_c_mg: 129,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 13,
      caffeine_mg: 0,
    },
  },
  {
    id: "grapefruit-zest-dried",
    code: "ING-1068",
    name: "Grapefruit Zest Dried",
    category: "spice",
    density: 0.3,
    fdc: "FDC 169917 · Orange peel, raw (SR Legacy) as dried grapefruit zest proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried grapefruit zest. Nutrition uses orange peel as closest SR Legacy citrus-peel proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 90,
      protein_g: 1.4,
      fat_g: 0.2,
      saturated_fat_g: 0.05,
      carbohydrate_g: 23,
      sugars_g: 8,
      fibre_g: 10,
      sodium_mg: 3,
      calcium_mg: 140,
      iron_mg: 0.7,
      magnesium_mg: 20,
      potassium_mg: 190,
      zinc_mg: 0.2,
      vitamin_a_ug: 15,
      vitamin_c_mg: 120,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "citrus-fiber",
    code: "ING-1069",
    name: "Citrus Fiber",
    category: "spice",
    density: 0.35,
    fdc: "Branded citrus fiber (no dedicated SR Legacy row). Insoluble/soluble citrus pulp fiber proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Citrus fiber (functional pulp fiber). Nutrition is a branded citrus-fiber proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 180,
      protein_g: 5,
      fat_g: 1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 70,
      sugars_g: 5,
      fibre_g: 60,
      sodium_mg: 50,
      calcium_mg: 200,
      iron_mg: 2,
      magnesium_mg: 40,
      potassium_mg: 400,
      zinc_mg: 0.5,
      vitamin_a_ug: 10,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 20,
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
  { ing: "orange-zest-dried", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "citrus-fiber", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
