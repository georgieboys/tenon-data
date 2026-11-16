#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2101;
const baseBuilds = 2100;

const INGREDIENTS = [
  {
    id: "nectarine",
    code: "ING-169",
    name: "Nectarine",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 169914 · Nectarines, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw nectarine. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 44,
      protein_g: 1.06,
      fat_g: 0.32,
      saturated_fat_g: 0.03,
      carbohydrate_g: 10.55,
      sugars_g: 7.89,
      fibre_g: 1.7,
      sodium_mg: 0,
      calcium_mg: 6,
      iron_mg: 0.28,
      magnesium_mg: 9,
      potassium_mg: 201,
      zinc_mg: 0.17,
      vitamin_a_ug: 17,
      vitamin_c_mg: 5.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.2,
      vitamin_b12_ug: 0,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "tangerine",
    code: "ING-170",
    name: "Tangerine",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 169105 · Tangerines, (mandarin oranges), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw tangerine. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 53,
      protein_g: 0.81,
      fat_g: 0.31,
      saturated_fat_g: 0.04,
      carbohydrate_g: 13.34,
      sugars_g: 10.58,
      fibre_g: 1.8,
      sodium_mg: 2,
      calcium_mg: 37,
      iron_mg: 0.15,
      magnesium_mg: 12,
      potassium_mg: 166,
      zinc_mg: 0.07,
      vitamin_a_ug: 34,
      vitamin_c_mg: 26.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 16,
      caffeine_mg: 0,
    },
  },
  {
    id: "clementine",
    code: "ING-171",
    name: "Clementine",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 168153 · Clementines, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw clementine. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 47,
      protein_g: 0.85,
      fat_g: 0.15,
      saturated_fat_g: 0,
      carbohydrate_g: 12.02,
      sugars_g: 9.18,
      fibre_g: 1.7,
      sodium_mg: 1,
      calcium_mg: 30,
      iron_mg: 0.14,
      magnesium_mg: 10,
      potassium_mg: 177,
      zinc_mg: 0.06,
      vitamin_a_ug: 0,
      vitamin_c_mg: 48.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "grapefruit",
    code: "ING-172",
    name: "Grapefruit",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 174673 · Grapefruit, raw, pink and red, all areas (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw pink/red grapefruit. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 42,
      protein_g: 0.77,
      fat_g: 0.14,
      saturated_fat_g: 0.02,
      carbohydrate_g: 10.66,
      sugars_g: 6.89,
      fibre_g: 1.6,
      sodium_mg: 0,
      calcium_mg: 22,
      iron_mg: 0.08,
      magnesium_mg: 9,
      potassium_mg: 135,
      zinc_mg: 0.07,
      vitamin_a_ug: 58,
      vitamin_c_mg: 31.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 13,
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
  { ing: "nectarine", cell: "chia", template: "tenon-durian-chia-elevated", fromId: "durian" },
  { ing: "grapefruit", cell: "overnight-oats", template: "tenon-tamarind-overnight-oats-elevated", fromId: "tamarind" },
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
  out = out.replaceAll("Two thousand one hundred builds.", "Two thousand one hundred fifty builds.");
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
