#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10165;
const baseBuilds = 10164;

const INGREDIENTS = [
  {
    id: "cannellini-cooked",
    code: "ING-822",
    name: "Cannellini Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 175180 · Beans, white, mature seeds, cooked, boiled, without salt (SR Legacy) as cannellini proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked cannellini beans. Nutrition uses cooked white beans proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 139,
      protein_g: 9.7,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 25.1,
      sugars_g: 0.3,
      fibre_g: 6.3,
      sodium_mg: 6,
      calcium_mg: 90,
      iron_mg: 3.7,
      magnesium_mg: 63,
      potassium_mg: 561,
      zinc_mg: 1.4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 81,
      caffeine_mg: 0,
    },
  },
  {
    id: "navy-beans-cooked",
    code: "ING-823",
    name: "Navy Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 175183 · Beans, navy, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked navy beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 140,
      protein_g: 8.2,
      fat_g: 0.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 26.1,
      sugars_g: 0.4,
      fibre_g: 10.5,
      sodium_mg: 0,
      calcium_mg: 69,
      iron_mg: 2.4,
      magnesium_mg: 53,
      potassium_mg: 389,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0,
      folate_ug: 140,
      caffeine_mg: 0,
    },
  },
  {
    id: "pinto-beans-cooked",
    code: "ING-824",
    name: "Pinto Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 175199 · Beans, pinto, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked pinto beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 143,
      protein_g: 9.0,
      fat_g: 0.7,
      saturated_fat_g: 0.1,
      carbohydrate_g: 26.2,
      sugars_g: 0.3,
      fibre_g: 9.0,
      sodium_mg: 1,
      calcium_mg: 46,
      iron_mg: 2.1,
      magnesium_mg: 50,
      potassium_mg: 436,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 172,
      caffeine_mg: 0,
    },
  },
  {
    id: "mung-beans-cooked",
    code: "ING-825",
    name: "Mung Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 174257 · Mung beans, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked mung beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 105,
      protein_g: 7.0,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 19.2,
      sugars_g: 2.0,
      fibre_g: 7.6,
      sodium_mg: 2,
      calcium_mg: 27,
      iron_mg: 1.4,
      magnesium_mg: 48,
      potassium_mg: 266,
      zinc_mg: 0.8,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0,
      folate_ug: 159,
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
  { ing: "cannellini-cooked", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "mung-beans-cooked", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand two hundred fourteen builds.");
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
