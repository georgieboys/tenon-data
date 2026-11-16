#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9215;
const baseBuilds = 9214;

const INGREDIENTS = [
  {
    id: "whey-protein-isolate",
    code: "ING-746",
    name: "Whey Protein Isolate",
    category: "protein_powder",
    density: 0.5,
    fdc: "FDC 173180 · Beverages, Protein powder whey based (SR Legacy) as whey isolate proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Whey protein isolate (~90% protein). Contains milk. Nutrition uses whey-based protein powder proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 370,
      protein_g: 90.0,
      fat_g: 1.0,
      saturated_fat_g: 0.5,
      carbohydrate_g: 2.0,
      sugars_g: 1.0,
      fibre_g: 0,
      sodium_mg: 200,
      calcium_mg: 400,
      iron_mg: 0.5,
      magnesium_mg: 80,
      potassium_mg: 400,
      zinc_mg: 4.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 2.0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "casein-micellar",
    code: "ING-747",
    name: "Casein Micellar",
    category: "protein_powder",
    density: 0.5,
    fdc: "FDC 173180 · Beverages, Protein powder whey based (SR Legacy) as micellar casein proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Micellar casein. Contains milk. Nutrition uses whey-based protein powder proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 360,
      protein_g: 85.0,
      fat_g: 1.5,
      saturated_fat_g: 0.8,
      carbohydrate_g: 4.0,
      sugars_g: 2.0,
      fibre_g: 0,
      sodium_mg: 180,
      calcium_mg: 1200,
      iron_mg: 0.5,
      magnesium_mg: 60,
      potassium_mg: 300,
      zinc_mg: 5.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 2.5,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "hemp-protein-powder",
    code: "ING-748",
    name: "Hemp Protein Powder",
    category: "protein_powder",
    density: 0.55,
    fdc: "FDC 170148 · Seeds, hemp seed, hulled (SR Legacy) as hemp protein powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hemp protein powder. Nutrition uses hulled hemp seed proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 390,
      protein_g: 50.0,
      fat_g: 11.0,
      saturated_fat_g: 1.0,
      carbohydrate_g: 20.0,
      sugars_g: 2.0,
      fibre_g: 15.0,
      sodium_mg: 10,
      calcium_mg: 150,
      iron_mg: 15.0,
      magnesium_mg: 500,
      potassium_mg: 1200,
      zinc_mg: 10.0,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "pea-protein-isolate",
    code: "ING-749",
    name: "Pea Protein Isolate",
    category: "protein_powder",
    density: 0.5,
    fdc: "FDC 174270 · Protein supplement, milk based, powder (SR Legacy) as pea protein isolate proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Pea protein isolate. Nutrition uses generic protein powder proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 380,
      protein_g: 80.0,
      fat_g: 5.0,
      saturated_fat_g: 1.0,
      carbohydrate_g: 5.0,
      sugars_g: 0,
      fibre_g: 2.0,
      sodium_mg: 900,
      calcium_mg: 100,
      iron_mg: 15.0,
      magnesium_mg: 50,
      potassium_mg: 100,
      zinc_mg: 5.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
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
  { ing: "whey-protein-isolate", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "pea-protein-isolate", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand two hundred sixty-four builds.");
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
