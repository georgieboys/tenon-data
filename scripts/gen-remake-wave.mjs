#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2451;
const baseBuilds = 2450;

const INGREDIENTS = [
  {
    id: "frisee",
    code: "ING-198",
    name: "Frisée",
    category: "other",
    density: 0.25,
    fdc: "FDC 168412 · Frisée proxy via endive, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw frisée. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 17,
      protein_g: 1.25,
      fat_g: 0.2,
      saturated_fat_g: 0.05,
      carbohydrate_g: 3.35,
      sugars_g: 0.25,
      fibre_g: 3.1,
      sodium_mg: 22,
      calcium_mg: 52,
      iron_mg: 0.83,
      magnesium_mg: 15,
      potassium_mg: 314,
      zinc_mg: 0.79,
      vitamin_a_ug: 108,
      vitamin_c_mg: 6.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 231,
      vitamin_b12_ug: 0,
      folate_ug: 142,
      caffeine_mg: 0,
    },
  },
  {
    id: "mizuna",
    code: "ING-199",
    name: "Mizuna",
    category: "other",
    density: 0.3,
    fdc: "FDC 169238 · Mizuna proxy via mustard greens, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw mizuna. Replace with the café SOP when locked.",
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
    id: "tatsoi",
    code: "ING-200",
    name: "Tatsoi",
    category: "other",
    density: 0.35,
    fdc: "FDC 170406 · Tatsoi proxy via collards, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw tatsoi. Replace with the café SOP when locked.",
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
    id: "purslane",
    code: "ING-201",
    name: "Purslane",
    category: "other",
    density: 0.4,
    fdc: "FDC 169268 · Purslane, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw purslane. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 20,
      protein_g: 2.03,
      fat_g: 0.36,
      saturated_fat_g: 0,
      carbohydrate_g: 3.39,
      sugars_g: 0,
      fibre_g: 1.5,
      sodium_mg: 45,
      calcium_mg: 65,
      iron_mg: 1.99,
      magnesium_mg: 68,
      potassium_mg: 494,
      zinc_mg: 0.17,
      vitamin_a_ug: 132,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 12,
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
  { ing: "frisee", cell: "chia", template: "tenon-beet-greens-chia-elevated", fromId: "beet-greens" },
  { ing: "purslane", cell: "overnight-oats", template: "tenon-escarole-overnight-oats-elevated", fromId: "escarole" },
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
  out = out.replaceAll("Two thousand four hundred fifty builds.", "Two thousand five hundred builds.");
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
