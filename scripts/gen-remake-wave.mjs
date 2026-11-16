#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6501;
const baseBuilds = 6500;

const INGREDIENTS = [
  {
    id: "ketchup",
    code: "ING-528",
    name: "Ketchup",
    category: "other",
    density: 1.15,
    fdc: "FDC 168462 · Catsup (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ketchup / catsup. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 101,
      protein_g: 1.04,
      fat_g: 0.1,
      saturated_fat_g: 0.01,
      carbohydrate_g: 27.4,
      sugars_g: 21.3,
      fibre_g: 0.3,
      sodium_mg: 907,
      calcium_mg: 15,
      iron_mg: 0.35,
      magnesium_mg: 13,
      potassium_mg: 281,
      zinc_mg: 0.17,
      vitamin_a_ug: 26,
      vitamin_c_mg: 4.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3,
      vitamin_b12_ug: 0,
      folate_ug: 9,
      caffeine_mg: 0,
    },
  },
  {
    id: "mayo",
    code: "ING-529",
    name: "Mayonnaise",
    category: "fat",
    density: 0.91,
    fdc: "FDC 171009 · Salad dressing, mayonnaise, regular (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[egg]",
    note: "Mayonnaise. Contains egg. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 680,
      protein_g: 0.96,
      fat_g: 74.85,
      saturated_fat_g: 11.75,
      carbohydrate_g: 0.57,
      sugars_g: 0.57,
      fibre_g: 0,
      sodium_mg: 635,
      calcium_mg: 8,
      iron_mg: 0.21,
      magnesium_mg: 1,
      potassium_mg: 20,
      zinc_mg: 0.15,
      vitamin_a_ug: 13,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 163,
      vitamin_b12_ug: 0.12,
      folate_ug: 5,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "pesto",
    code: "ING-530",
    name: "Pesto",
    category: "other",
    density: 1.0,
    fdc: "FDC 171009 · Salad dressing, mayonnaise, regular (SR Legacy) as pesto energy proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut, milk]",
    note: "Basil pesto. Contains tree nut and dairy. Nutrition uses mayo energy proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 418,
      protein_g: 5.0,
      fat_g: 42.0,
      saturated_fat_g: 7.5,
      carbohydrate_g: 4.0,
      sugars_g: 1.0,
      fibre_g: 1.5,
      sodium_mg: 600,
      calcium_mg: 150,
      iron_mg: 1.5,
      magnesium_mg: 40,
      potassium_mg: 200,
      zinc_mg: 0.8,
      vitamin_a_ug: 150,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 180,
      vitamin_b12_ug: 0.2,
      folate_ug: 30,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "harissa",
    code: "ING-531",
    name: "Harissa",
    category: "other",
    density: 1.1,
    fdc: "FDC 174066 · Sauce, peppers, hot (SR Legacy) as harissa proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Harissa paste. Nutrition uses hot pepper sauce proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 120,
      protein_g: 2.5,
      fat_g: 8.0,
      saturated_fat_g: 1.0,
      carbohydrate_g: 10.0,
      sugars_g: 4.0,
      fibre_g: 3.0,
      sodium_mg: 900,
      calcium_mg: 40,
      iron_mg: 1.5,
      magnesium_mg: 25,
      potassium_mg: 300,
      zinc_mg: 0.3,
      vitamin_a_ug: 200,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 10,
      vitamin_b12_ug: 0,
      folate_ug: 15,
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
  { ing: "ketchup", cell: "chia", template: "tenon-chili-oil-chia-elevated", fromId: "chili-oil" },
  { ing: "harissa", cell: "overnight-oats", template: "tenon-hot-sauce-overnight-oats-elevated", fromId: "hot-sauce" },
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
  out = out.replaceAll("Six thousand five hundred builds.", "Six thousand five hundred fifty builds.");
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
