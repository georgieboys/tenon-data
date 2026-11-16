#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5251;
const baseBuilds = 5250;

const INGREDIENTS = [
  {
    id: "mayocoba",
    code: "ING-428",
    name: "Mayocoba",
    category: "other",
    density: 0.75,
    fdc: "FDC 175198 · Beans, yellow, mature seeds, raw (SR Legacy) as mayocoba / Peruano proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried mayocoba (Peruano / canary) beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 345,
      protein_g: 22.0,
      fat_g: 2.6,
      saturated_fat_g: 0.7,
      carbohydrate_g: 60.7,
      sugars_g: 0,
      fibre_g: 25.1,
      sodium_mg: 12,
      calcium_mg: 166,
      iron_mg: 7.0,
      magnesium_mg: 183,
      potassium_mg: 1042,
      zinc_mg: 2.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 399,
      caffeine_mg: 0,
    },
  },
  {
    id: "scarlet-runner",
    code: "ING-429",
    name: "Scarlet Runner",
    category: "other",
    density: 0.75,
    fdc: "FDC 173735 · Beans, kidney, all types, mature seeds, raw (SR Legacy) as scarlet runner bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried scarlet runner beans. Nutrition uses kidney-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 333,
      protein_g: 23.6,
      fat_g: 0.8,
      saturated_fat_g: 0.1,
      carbohydrate_g: 60.0,
      sugars_g: 2.2,
      fibre_g: 24.9,
      sodium_mg: 24,
      calcium_mg: 143,
      iron_mg: 8.2,
      magnesium_mg: 140,
      potassium_mg: 1406,
      zinc_mg: 2.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 19.0,
      vitamin_b12_ug: 0,
      folate_ug: 394,
      caffeine_mg: 0,
    },
  },
  {
    id: "calypso-bean",
    code: "ING-430",
    name: "Calypso Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 175186 · Beans, black, mature seeds, raw (SR Legacy) as calypso / yin-yang bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried calypso (yin-yang) beans. Nutrition uses black-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 341,
      protein_g: 21.6,
      fat_g: 1.4,
      saturated_fat_g: 0.4,
      carbohydrate_g: 62.4,
      sugars_g: 2.1,
      fibre_g: 15.5,
      sodium_mg: 5,
      calcium_mg: 123,
      iron_mg: 5.0,
      magnesium_mg: 171,
      potassium_mg: 1483,
      zinc_mg: 3.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6.0,
      vitamin_b12_ug: 0,
      folate_ug: 444,
      caffeine_mg: 0,
    },
  },
  {
    id: "rattlesnake-bean",
    code: "ING-431",
    name: "Rattlesnake Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 175199 · Beans, pinto, mature seeds, raw (SR Legacy) as rattlesnake bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried rattlesnake beans. Nutrition uses pinto-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 347,
      protein_g: 21.4,
      fat_g: 1.2,
      saturated_fat_g: 0.2,
      carbohydrate_g: 62.6,
      sugars_g: 2.1,
      fibre_g: 15.5,
      sodium_mg: 12,
      calcium_mg: 113,
      iron_mg: 5.1,
      magnesium_mg: 176,
      potassium_mg: 1393,
      zinc_mg: 2.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 6.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.6,
      vitamin_b12_ug: 0,
      folate_ug: 525,
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
  { ing: "mayocoba", cell: "chia", template: "tenon-green-split-pea-chia-elevated", fromId: "green-split-pea" },
  { ing: "rattlesnake-bean", cell: "overnight-oats", template: "tenon-soybean-overnight-oats-elevated", fromId: "soybean" },
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
  out = out.replaceAll("Five thousand two hundred fifty builds.", "Five thousand three hundred builds.");
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
