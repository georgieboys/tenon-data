#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12991;
const baseBuilds = 12990;
const proseCount = "Thirteen thousand forty builds.";

const INGREDIENTS = [
  {
    id: "kale-powder",
    code: "ING-1050",
    name: "Kale Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 168421 · Kale, raw (SR Legacy) as kale powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Kale powder. Nutrition uses raw kale as closest SR Legacy proxy until a café CoA lands; solids are concentrated vs fresh. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 20,
      fat_g: 4,
      saturated_fat_g: 0.5,
      carbohydrate_g: 45,
      sugars_g: 5,
      fibre_g: 20,
      sodium_mg: 200,
      calcium_mg: 800,
      iron_mg: 10,
      magnesium_mg: 200,
      potassium_mg: 2500,
      zinc_mg: 2,
      vitamin_a_ug: 3000,
      vitamin_c_mg: 200,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3000,
      vitamin_b12_ug: 0,
      folate_ug: 400,
      caffeine_mg: 0,
    },
  },
  {
    id: "celery-powder",
    code: "ING-1051",
    name: "Celery Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 169988 · Celery, raw (SR Legacy) as celery powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Celery powder (distinct from celery seed). Nutrition uses raw celery as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 220,
      protein_g: 8,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 45,
      sugars_g: 15,
      fibre_g: 18,
      sodium_mg: 800,
      calcium_mg: 400,
      iron_mg: 3,
      magnesium_mg: 100,
      potassium_mg: 2200,
      zinc_mg: 1,
      vitamin_a_ug: 200,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200,
      vitamin_b12_ug: 0,
      folate_ug: 150,
      caffeine_mg: 0,
    },
  },
  {
    id: "mushroom-powder",
    code: "ING-1052",
    name: "Mushroom Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 169251 · Mushrooms, white, raw (SR Legacy) as mushroom powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Generic white-mushroom powder (distinct from named medicinal mushroom powders). Nutrition uses white mushroom as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 250,
      protein_g: 25,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 40,
      sugars_g: 5,
      fibre_g: 15,
      sodium_mg: 50,
      calcium_mg: 50,
      iron_mg: 5,
      magnesium_mg: 80,
      potassium_mg: 2500,
      zinc_mg: 4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 10,
      vitamin_d_ug: 2,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 100,
      caffeine_mg: 0,
    },
  },
  {
    id: "shallot-flakes",
    code: "ING-1053",
    name: "Shallot Flakes",
    category: "spice",
    density: 0.35,
    fdc: "FDC 170150 · Shallots, raw (SR Legacy) as shallot flakes proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried shallot flakes (distinct from raw shallot). Nutrition uses raw shallot as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 330,
      protein_g: 10,
      fat_g: 0.8,
      saturated_fat_g: 0.1,
      carbohydrate_g: 75,
      sugars_g: 30,
      fibre_g: 12,
      sodium_mg: 50,
      calcium_mg: 150,
      iron_mg: 4,
      magnesium_mg: 80,
      potassium_mg: 1200,
      zinc_mg: 1.5,
      vitamin_a_ug: 10,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 80,
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
  { ing: "kale-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "mushroom-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
