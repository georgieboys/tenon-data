#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4951;
const baseBuilds = 4950;

const INGREDIENTS = [
  {
    id: "chanterelle",
    code: "ING-404",
    name: "Chanterelle",
    category: "other",
    density: 0.45,
    fdc: "FDC 169251 · Mushrooms, shiitake, raw (SR Legacy) as chanterelle proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh chanterelle mushrooms. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 38,
      protein_g: 1.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 6.9,
      sugars_g: 1.2,
      fibre_g: 3.8,
      sodium_mg: 9,
      calcium_mg: 15,
      iron_mg: 3.5,
      magnesium_mg: 13,
      potassium_mg: 506,
      zinc_mg: 0.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 5.3,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 2,
      caffeine_mg: 0,
    },
  },
  {
    id: "crimini",
    code: "ING-405",
    name: "Crimini",
    category: "other",
    density: 0.55,
    fdc: "FDC 168566 · Mushrooms, brown, italian, or crimini, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh crimini (baby bella) mushrooms. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 2.5,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 4.3,
      sugars_g: 1.7,
      fibre_g: 0.6,
      sodium_mg: 6,
      calcium_mg: 18,
      iron_mg: 0.4,
      magnesium_mg: 9,
      potassium_mg: 448,
      zinc_mg: 1.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.1,
      folate_ug: 42,
      caffeine_mg: 0,
    },
  },
  {
    id: "dried-maitake",
    code: "ING-406",
    name: "Dried Maitake",
    category: "other",
    density: 0.3,
    fdc: "FDC 168567 · Mushrooms, shiitake, dried (SR Legacy) as dried maitake proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried maitake. Distinct from fresh maitake. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 290,
      protein_g: 15.0,
      fat_g: 2.0,
      saturated_fat_g: 0.3,
      carbohydrate_g: 60.0,
      sugars_g: 3.0,
      fibre_g: 25.0,
      sodium_mg: 10,
      calcium_mg: 15,
      iron_mg: 3.0,
      magnesium_mg: 100,
      potassium_mg: 1500,
      zinc_mg: 4.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 8.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-fungus",
    code: "ING-407",
    name: "Black Fungus",
    category: "other",
    density: 0.35,
    fdc: "FDC 168580 · Mushrooms, oyster, raw (SR Legacy) as black fungus / mu er proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried black fungus (mu er), rehydrated. Distinct from wood ear SKU when labelled separately. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 1.5,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 6.5,
      sugars_g: 0.2,
      fibre_g: 5.0,
      sodium_mg: 15,
      calcium_mg: 25,
      iron_mg: 2.0,
      magnesium_mg: 25,
      potassium_mg: 120,
      zinc_mg: 0.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
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
  { ing: "chanterelle", cell: "chia", template: "tenon-truffle-chia-elevated", fromId: "truffle" },
  { ing: "porcini", cell: "overnight-oats", template: "tenon-dried-shiitake-overnight-oats-elevated", fromId: "dried-shiitake" },
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
  out = out.replaceAll("Four thousand nine hundred fifty builds.", "Five thousand builds.");
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
  const meta = INGREDIENTS.find((i) => i.id === elev.ing) || { name: titleCase(elev.ing) };
  // porcini elevated uses existing ingredient; name from file if missing in INGREDIENTS
  const toName = meta.name || titleCase(elev.ing);
  writeFileSync(buildPath, rewriteElevated(srcBuild, elev.fromId, elev.ing, toName, code, "build"));
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, elev.fromId, elev.ing, toName, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}
console.log(
  `done through BLD-${code - 1}; expected builds ${baseBuilds + (code - startCode)}`,
);
