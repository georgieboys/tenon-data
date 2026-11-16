#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2351;
const baseBuilds = 2350;

const INGREDIENTS = [
  {
    id: "swiss-chard",
    code: "ING-190",
    name: "Swiss Chard",
    category: "other",
    density: 0.4,
    fdc: "FDC 169991 · Chard, swiss, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw Swiss chard. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 19,
      protein_g: 1.8,
      fat_g: 0.2,
      saturated_fat_g: 0.03,
      carbohydrate_g: 3.74,
      sugars_g: 1.1,
      fibre_g: 1.6,
      sodium_mg: 213,
      calcium_mg: 51,
      iron_mg: 1.8,
      magnesium_mg: 81,
      potassium_mg: 379,
      zinc_mg: 0.36,
      vitamin_a_ug: 306,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 830,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "collard",
    code: "ING-191",
    name: "Collard",
    category: "other",
    density: 0.4,
    fdc: "FDC 169991 · Collards, raw (SR Legacy FDC 170406). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw collard greens. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 32,
      protein_g: 3.02,
      fat_g: 0.61,
      saturated_fat_g: 0.06,
      carbohydrate_g: 5.42,
      sugars_g: 0.46,
      fibre_g: 4,
      sodium_mg: 17,
      calcium_mg: 232,
      iron_mg: 0.47,
      magnesium_mg: 27,
      potassium_mg: 213,
      zinc_mg: 0.21,
      vitamin_a_ug: 251,
      vitamin_c_mg: 35.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 437.1,
      vitamin_b12_ug: 0,
      folate_ug: 129,
      caffeine_mg: 0,
    },
  },
  {
    id: "mustard-greens",
    code: "ING-192",
    name: "Mustard Greens",
    category: "other",
    density: 0.35,
    fdc: "FDC 169246 · Mustard greens, raw (SR Legacy FDC 169246 is leek — use FDC 169238). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw mustard greens. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 27,
      protein_g: 2.86,
      fat_g: 0.42,
      saturated_fat_g: 0.01,
      carbohydrate_g: 4.67,
      sugars_g: 1.32,
      fibre_g: 3.2,
      sodium_mg: 20,
      calcium_mg: 115,
      iron_mg: 1.64,
      magnesium_mg: 32,
      potassium_mg: 384,
      zinc_mg: 0.25,
      vitamin_a_ug: 151,
      vitamin_c_mg: 70,
      vitamin_d_ug: 0,
      vitamin_k_ug: 257.5,
      vitamin_b12_ug: 0,
      folate_ug: 12,
      caffeine_mg: 0,
    },
  },
  {
    id: "watercress",
    code: "ING-193",
    name: "Watercress",
    category: "other",
    density: 0.3,
    fdc: "FDC 170068 · Watercress, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw watercress. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 11,
      protein_g: 2.3,
      fat_g: 0.1,
      saturated_fat_g: 0.03,
      carbohydrate_g: 1.29,
      sugars_g: 0.2,
      fibre_g: 0.5,
      sodium_mg: 41,
      calcium_mg: 120,
      iron_mg: 0.2,
      magnesium_mg: 21,
      potassium_mg: 330,
      zinc_mg: 0.11,
      vitamin_a_ug: 160,
      vitamin_c_mg: 43,
      vitamin_d_ug: 0,
      vitamin_k_ug: 250,
      vitamin_b12_ug: 0,
      folate_ug: 9,
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
  { ing: "swiss-chard", cell: "chia", template: "tenon-shallot-chia-elevated", fromId: "shallot" },
  { ing: "watercress", cell: "overnight-oats", template: "tenon-chipotle-overnight-oats-elevated", fromId: "chipotle" },
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
  out = out.replaceAll("Two thousand three hundred fifty builds.", "Two thousand four hundred builds.");
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
