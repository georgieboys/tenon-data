#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13091;
const baseBuilds = 13090;
const proseCount = "Thirteen thousand one hundred forty builds.";

const INGREDIENTS = [
  {
    id: "red-pepper-flakes",
    code: "ING-1058",
    name: "Red Pepper Flakes",
    category: "spice",
    density: 0.4,
    fdc: "FDC 170066 · Peppers, hot chili, red, raw (SR Legacy) as red pepper flakes proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Crushed red pepper flakes. Nutrition uses hot red chili as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 12,
      fat_g: 14,
      saturated_fat_g: 2,
      carbohydrate_g: 50,
      sugars_g: 10,
      fibre_g: 25,
      sodium_mg: 30,
      calcium_mg: 150,
      iron_mg: 8,
      magnesium_mg: 150,
      potassium_mg: 2000,
      zinc_mg: 2,
      vitamin_a_ug: 2000,
      vitamin_c_mg: 100,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "pasilla-powder",
    code: "ING-1059",
    name: "Pasilla Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 171328 · Spices, paprika (SR Legacy) as pasilla powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Pasilla chile powder. Nutrition uses paprika as closest SR Legacy chile-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 282,
      protein_g: 14.1,
      fat_g: 12.9,
      saturated_fat_g: 2.1,
      carbohydrate_g: 53.9,
      sugars_g: 10.3,
      fibre_g: 34.9,
      sodium_mg: 68,
      calcium_mg: 229,
      iron_mg: 21.1,
      magnesium_mg: 178,
      potassium_mg: 2280,
      zinc_mg: 4.3,
      vitamin_a_ug: 2463,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "tamarind-powder",
    code: "ING-1060",
    name: "Tamarind Powder",
    category: "spice",
    density: 0.5,
    fdc: "FDC 167752 · Tamarinds, raw (SR Legacy) as tamarind powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tamarind powder (distinct from tamarind concentrate). Nutrition uses raw tamarind as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 3,
      fat_g: 0.6,
      saturated_fat_g: 0.2,
      carbohydrate_g: 70,
      sugars_g: 55,
      fibre_g: 8,
      sodium_mg: 30,
      calcium_mg: 80,
      iron_mg: 3,
      magnesium_mg: 80,
      potassium_mg: 700,
      zinc_mg: 0.5,
      vitamin_a_ug: 5,
      vitamin_c_mg: 4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "yuzu-powder",
    code: "ING-1061",
    name: "Yuzu Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 167747 · Lemons, raw, without peel (SR Legacy) as yuzu powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Yuzu powder (dried citrus). Nutrition uses lemon as closest SR Legacy citrus proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 250,
      protein_g: 4,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 60,
      sugars_g: 20,
      fibre_g: 20,
      sodium_mg: 10,
      calcium_mg: 100,
      iron_mg: 2,
      magnesium_mg: 40,
      potassium_mg: 600,
      zinc_mg: 0.5,
      vitamin_a_ug: 20,
      vitamin_c_mg: 200,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 30,
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
  { ing: "red-pepper-flakes", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "yuzu-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
