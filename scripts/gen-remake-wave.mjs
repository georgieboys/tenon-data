#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12491;
const baseBuilds = 12490;
const proseCount = "Twelve thousand five hundred forty builds.";

const INGREDIENTS = [
  {
    id: "sencha-powder",
    code: "ING-1010",
    name: "Sencha Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as sencha powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sencha powder. Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 22,
      fat_g: 3,
      saturated_fat_g: 0.4,
      carbohydrate_g: 42,
      sugars_g: 0,
      fibre_g: 32,
      sodium_mg: 6,
      calcium_mg: 320,
      iron_mg: 12,
      magnesium_mg: 160,
      potassium_mg: 1900,
      zinc_mg: 2,
      vitamin_a_ug: 900,
      vitamin_c_mg: 40,
      vitamin_d_ug: 0,
      vitamin_k_ug: 700,
      vitamin_b12_ug: 0,
      folate_ug: 70,
      caffeine_mg: 1800,
    },
  },
  {
    id: "gyokuro-powder",
    code: "ING-1011",
    name: "Gyokuro Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as gyokuro powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Gyokuro powder (shade-grown green tea). Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 320,
      protein_g: 28,
      fat_g: 4,
      saturated_fat_g: 0.5,
      carbohydrate_g: 38,
      sugars_g: 0,
      fibre_g: 35,
      sodium_mg: 5,
      calcium_mg: 400,
      iron_mg: 15,
      magnesium_mg: 200,
      potassium_mg: 2400,
      zinc_mg: 2.5,
      vitamin_a_ug: 2000,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1000,
      vitamin_b12_ug: 0,
      folate_ug: 90,
      caffeine_mg: 2500,
    },
  },
  {
    id: "kukicha",
    code: "ING-1012",
    name: "Kukicha",
    category: "spice",
    density: 0.3,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as kukicha (twig tea) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Kukicha (twig tea). Nutrition uses matcha powder as closest SR Legacy tea proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 250,
      protein_g: 12,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 40,
      sugars_g: 0,
      fibre_g: 28,
      sodium_mg: 8,
      calcium_mg: 200,
      iron_mg: 6,
      magnesium_mg: 80,
      potassium_mg: 1000,
      zinc_mg: 1,
      vitamin_a_ug: 200,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 300,
    },
  },
  {
    id: "mugicha",
    code: "ING-1013",
    name: "Mugicha",
    category: "spice",
    density: 0.35,
    fdc: "FDC 170283 · Barley, hulled (SR Legacy) as mugicha (roasted barley tea) proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Mugicha (roasted barley tea). Contains gluten. Nutrition uses hulled barley as proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 320,
      protein_g: 10,
      fat_g: 2,
      saturated_fat_g: 0.4,
      carbohydrate_g: 70,
      sugars_g: 0.5,
      fibre_g: 15,
      sodium_mg: 10,
      calcium_mg: 30,
      iron_mg: 3,
      magnesium_mg: 100,
      potassium_mg: 400,
      zinc_mg: 2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2,
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
  { ing: "gyokuro-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "mugicha", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
