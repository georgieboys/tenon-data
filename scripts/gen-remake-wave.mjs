#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2401;
const baseBuilds = 2400;

const INGREDIENTS = [
  {
    id: "beet-greens",
    code: "ING-194",
    name: "Beet Greens",
    category: "other",
    density: 0.4,
    fdc: "FDC 170376 · Beet greens, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw beet greens. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 2.2,
      fat_g: 0.13,
      saturated_fat_g: 0.02,
      carbohydrate_g: 4.33,
      sugars_g: 0.5,
      fibre_g: 3.7,
      sodium_mg: 226,
      calcium_mg: 117,
      iron_mg: 2.57,
      magnesium_mg: 70,
      potassium_mg: 762,
      zinc_mg: 0.38,
      vitamin_a_ug: 316,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 400,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "dandelion",
    code: "ING-195",
    name: "Dandelion Greens",
    category: "other",
    density: 0.35,
    fdc: "FDC 169226 · Dandelion greens, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw dandelion greens. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 45,
      protein_g: 2.7,
      fat_g: 0.7,
      saturated_fat_g: 0.17,
      carbohydrate_g: 9.2,
      sugars_g: 0.71,
      fibre_g: 3.5,
      sodium_mg: 76,
      calcium_mg: 187,
      iron_mg: 3.1,
      magnesium_mg: 36,
      potassium_mg: 397,
      zinc_mg: 0.41,
      vitamin_a_ug: 508,
      vitamin_c_mg: 35,
      vitamin_d_ug: 0,
      vitamin_k_ug: 778.4,
      vitamin_b12_ug: 0,
      folate_ug: 27,
      caffeine_mg: 0,
    },
  },
  {
    id: "endive",
    code: "ING-196",
    name: "Endive",
    category: "other",
    density: 0.3,
    fdc: "FDC 168412 · Endive, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw endive. Replace with the café SOP when locked.",
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
    id: "escarole",
    code: "ING-197",
    name: "Escarole",
    category: "other",
    density: 0.3,
    fdc: "FDC 168412 · Escarole proxy via endive, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw escarole. Replace with the café SOP when locked.",
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
  { ing: "beet-greens", cell: "chia", template: "tenon-swiss-chard-chia-elevated", fromId: "swiss-chard" },
  { ing: "escarole", cell: "overnight-oats", template: "tenon-watercress-overnight-oats-elevated", fromId: "watercress" },
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
  out = out.replaceAll("Two thousand four hundred builds.", "Two thousand four hundred fifty builds.");
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
