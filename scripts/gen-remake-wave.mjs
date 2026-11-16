#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10115;
const baseBuilds = 10114;

const INGREDIENTS = [
  {
    id: "lentils-cooked",
    code: "ING-818",
    name: "Lentils Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 172420 · Lentils, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked lentils. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 116,
      protein_g: 9.0,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 20.1,
      sugars_g: 1.8,
      fibre_g: 7.9,
      sodium_mg: 2,
      calcium_mg: 19,
      iron_mg: 3.3,
      magnesium_mg: 36,
      potassium_mg: 369,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.7,
      vitamin_b12_ug: 0,
      folate_ug: 181,
      caffeine_mg: 0,
    },
  },
  {
    id: "chickpeas-cooked",
    code: "ING-819",
    name: "Chickpeas Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 173757 · Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked chickpeas. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 164,
      protein_g: 8.9,
      fat_g: 2.6,
      saturated_fat_g: 0.3,
      carbohydrate_g: 27.4,
      sugars_g: 4.8,
      fibre_g: 7.6,
      sodium_mg: 7,
      calcium_mg: 49,
      iron_mg: 2.9,
      magnesium_mg: 48,
      potassium_mg: 291,
      zinc_mg: 1.5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.0,
      vitamin_b12_ug: 0,
      folate_ug: 172,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-beans-cooked",
    code: "ING-820",
    name: "Black Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 175185 · Beans, black, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked black beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 132,
      protein_g: 8.9,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 23.7,
      sugars_g: 0.3,
      fibre_g: 8.7,
      sodium_mg: 1,
      calcium_mg: 27,
      iron_mg: 2.1,
      magnesium_mg: 70,
      potassium_mg: 355,
      zinc_mg: 1.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.3,
      vitamin_b12_ug: 0,
      folate_ug: 149,
      caffeine_mg: 0,
    },
  },
  {
    id: "kidney-beans-cooked",
    code: "ING-821",
    name: "Kidney Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 175194 · Beans, kidney, red, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked kidney beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 127,
      protein_g: 8.7,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 22.8,
      sugars_g: 0.3,
      fibre_g: 7.4,
      sodium_mg: 2,
      calcium_mg: 28,
      iron_mg: 2.9,
      magnesium_mg: 45,
      potassium_mg: 403,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 8.4,
      vitamin_b12_ug: 0,
      folate_ug: 130,
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
  { ing: "lentils-cooked", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "kidney-beans-cooked", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand one hundred sixty-four builds.");
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
