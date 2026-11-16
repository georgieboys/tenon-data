#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2301;
const baseBuilds = 2300;

const INGREDIENTS = [
  {
    id: "shallot",
    code: "ING-186",
    name: "Shallot",
    category: "other",
    density: 0.9,
    fdc: "FDC 170150 · Shallots, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw shallot. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 72,
      protein_g: 2.5,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 16.8,
      sugars_g: 7.87,
      fibre_g: 3.2,
      sodium_mg: 12,
      calcium_mg: 37,
      iron_mg: 1.2,
      magnesium_mg: 21,
      potassium_mg: 334,
      zinc_mg: 0.4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.8,
      vitamin_b12_ug: 0,
      folate_ug: 34,
      caffeine_mg: 0,
    },
  },
  {
    id: "scallion",
    code: "ING-187",
    name: "Scallion",
    category: "other",
    density: 0.7,
    fdc: "FDC 170005 · Onions, spring or scallions (includes tops and bulb), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw scallion. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 32,
      protein_g: 1.83,
      fat_g: 0.19,
      saturated_fat_g: 0.03,
      carbohydrate_g: 7.34,
      sugars_g: 2.33,
      fibre_g: 2.6,
      sodium_mg: 16,
      calcium_mg: 72,
      iron_mg: 1.48,
      magnesium_mg: 20,
      potassium_mg: 276,
      zinc_mg: 0.39,
      vitamin_a_ug: 50,
      vitamin_c_mg: 18.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 207,
      vitamin_b12_ug: 0,
      folate_ug: 64,
      caffeine_mg: 0,
    },
  },
  {
    id: "jalapeno",
    code: "ING-188",
    name: "Jalapeño",
    category: "other",
    density: 0.9,
    fdc: "FDC 168576 · Peppers, jalapeno, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw jalapeño. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 29,
      protein_g: 0.91,
      fat_g: 0.37,
      saturated_fat_g: 0.09,
      carbohydrate_g: 6.5,
      sugars_g: 4.12,
      fibre_g: 2.8,
      sodium_mg: 3,
      calcium_mg: 12,
      iron_mg: 0.25,
      magnesium_mg: 15,
      potassium_mg: 248,
      zinc_mg: 0.14,
      vitamin_a_ug: 54,
      vitamin_c_mg: 118.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 18.5,
      vitamin_b12_ug: 0,
      folate_ug: 27,
      caffeine_mg: 0,
    },
  },
  {
    id: "chipotle",
    code: "ING-189",
    name: "Chipotle",
    category: "spice",
    density: 0.4,
    fdc: "FDC 170416 · Spices, pepper, red or cayenne (SR Legacy) used as dried chipotle proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried chipotle (cayenne SR Legacy proxy). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 318,
      protein_g: 12.01,
      fat_g: 17.27,
      saturated_fat_g: 3.26,
      carbohydrate_g: 56.63,
      sugars_g: 10.34,
      fibre_g: 27.2,
      sodium_mg: 30,
      calcium_mg: 148,
      iron_mg: 7.8,
      magnesium_mg: 152,
      potassium_mg: 2014,
      zinc_mg: 2.48,
      vitamin_a_ug: 2081,
      vitamin_c_mg: 76.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 106,
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
  { ing: "shallot", cell: "chia", template: "tenon-radish-chia-elevated", fromId: "radish" },
  { ing: "chipotle", cell: "overnight-oats", template: "tenon-leek-overnight-oats-elevated", fromId: "leek" },
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
  out = out.replaceAll("Two thousand three hundred builds.", "Two thousand three hundred fifty builds.");
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
