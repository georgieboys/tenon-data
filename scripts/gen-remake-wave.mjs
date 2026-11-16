#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3501;
const baseBuilds = 3500;

const INGREDIENTS = [
  {
    id: "loquat",
    code: "ING-285",
    name: "Loquat",
    category: "fruit",
    density: 0.75,
    fdc: "FDC 168155 · Loquats, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw loquat. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 47,
      protein_g: 0.43,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 12.14,
      sugars_g: 8.0,
      fibre_g: 1.7,
      sodium_mg: 1,
      calcium_mg: 16,
      iron_mg: 0.28,
      magnesium_mg: 13,
      potassium_mg: 266,
      zinc_mg: 0.05,
      vitamin_a_ug: 76,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "breadfruit",
    code: "ING-286",
    name: "Breadfruit",
    category: "fruit",
    density: 0.8,
    fdc: "FDC 171714 · Breadfruit, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw breadfruit. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 103,
      protein_g: 1.07,
      fat_g: 0.23,
      saturated_fat_g: 0.05,
      carbohydrate_g: 27.12,
      sugars_g: 11.0,
      fibre_g: 4.9,
      sodium_mg: 2,
      calcium_mg: 17,
      iron_mg: 0.54,
      magnesium_mg: 25,
      potassium_mg: 490,
      zinc_mg: 0.12,
      vitamin_a_ug: 0,
      vitamin_c_mg: 29.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.5,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "turnip-greens",
    code: "ING-287",
    name: "Turnip Greens",
    category: "other",
    density: 0.4,
    fdc: "FDC 170465 · Turnip greens, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw turnip greens. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 32,
      protein_g: 1.5,
      fat_g: 0.3,
      saturated_fat_g: 0.07,
      carbohydrate_g: 7.13,
      sugars_g: 0.81,
      fibre_g: 3.2,
      sodium_mg: 40,
      calcium_mg: 190,
      iron_mg: 1.1,
      magnesium_mg: 31,
      potassium_mg: 296,
      zinc_mg: 0.2,
      vitamin_a_ug: 579,
      vitamin_c_mg: 60.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 251.0,
      vitamin_b12_ug: 0,
      folate_ug: 194,
      caffeine_mg: 0,
    },
  },
  {
    id: "dandelion-greens",
    code: "ING-288",
    name: "Dandelion Greens",
    category: "other",
    density: 0.4,
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
      vitamin_c_mg: 35.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 778.4,
      vitamin_b12_ug: 0,
      folate_ug: 27,
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
  { ing: "loquat", cell: "chia", template: "tenon-elderberry-chia-elevated", fromId: "elderberry" },
  { ing: "dandelion-greens", cell: "overnight-oats", template: "tenon-quince-overnight-oats-elevated", fromId: "quince" },
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
  out = out.replaceAll("Three thousand five hundred builds.", "Three thousand five hundred fifty builds.");
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
