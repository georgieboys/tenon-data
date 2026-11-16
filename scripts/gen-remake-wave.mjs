#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1901;
const baseBuilds = 1900;

const INGREDIENTS = [
  {
    id: "goji",
    code: "ING-153",
    name: "Goji",
    category: "fruit",
    density: 0.55,
    fdc: "FDC 168634 · Goji berries, dried (SR Legacy-style proxy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried goji berries. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 349,
      protein_g: 14.26,
      fat_g: 0.39,
      saturated_fat_g: 0,
      carbohydrate_g: 77.06,
      sugars_g: 45.61,
      fibre_g: 13,
      sodium_mg: 298,
      calcium_mg: 190,
      iron_mg: 6.8,
      magnesium_mg: 0,
      potassium_mg: 0,
      zinc_mg: 0,
      vitamin_a_ug: 1341,
      vitamin_c_mg: 48.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "cranberry",
    code: "ING-154",
    name: "Cranberry",
    category: "fruit",
    density: 0.6,
    fdc: "FDC 171722 · Cranberries, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw cranberries. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 46,
      protein_g: 0.39,
      fat_g: 0.13,
      saturated_fat_g: 0.01,
      carbohydrate_g: 12.2,
      sugars_g: 4.04,
      fibre_g: 4.6,
      sodium_mg: 2,
      calcium_mg: 8,
      iron_mg: 0.25,
      magnesium_mg: 6,
      potassium_mg: 85,
      zinc_mg: 0.1,
      vitamin_a_ug: 3,
      vitamin_c_mg: 13.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 1,
      caffeine_mg: 0,
    },
  },
  {
    id: "persimmon",
    code: "ING-155",
    name: "Persimmon",
    category: "fruit",
    density: 0.8,
    fdc: "FDC 169943 · Persimmons, japanese, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Japanese persimmon. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 70,
      protein_g: 0.58,
      fat_g: 0.19,
      saturated_fat_g: 0.02,
      carbohydrate_g: 18.59,
      sugars_g: 12.53,
      fibre_g: 3.6,
      sodium_mg: 1,
      calcium_mg: 8,
      iron_mg: 0.15,
      magnesium_mg: 9,
      potassium_mg: 161,
      zinc_mg: 0.11,
      vitamin_a_ug: 81,
      vitamin_c_mg: 7.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.6,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "lime",
    code: "ING-156",
    name: "Lime",
    category: "fruit",
    density: 1.0,
    fdc: "FDC 168155 · Limes, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw lime. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 0.7,
      fat_g: 0.2,
      saturated_fat_g: 0.02,
      carbohydrate_g: 10.54,
      sugars_g: 1.69,
      fibre_g: 2.8,
      sodium_mg: 2,
      calcium_mg: 33,
      iron_mg: 0.6,
      magnesium_mg: 6,
      potassium_mg: 102,
      zinc_mg: 0.11,
      vitamin_a_ug: 2,
      vitamin_c_mg: 29.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0,
      folate_ug: 8,
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
  { ing: "goji", cell: "chia", template: "tenon-arrowroot-chia-elevated", fromId: "arrowroot" },
  { ing: "lime", cell: "overnight-oats", template: "tenon-semolina-overnight-oats-elevated", fromId: "semolina" },
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
  out = out.replaceAll("One thousand nine hundred builds.", "One thousand nine hundred fifty builds.");
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
