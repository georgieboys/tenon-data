#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3101;
const baseBuilds = 3100;

const INGREDIENTS = [
  {
    id: "yam",
    code: "ING-253",
    name: "Yam",
    category: "other",
    density: 0.85,
    fdc: "FDC 170071 · Yams, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw yam. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 118,
      protein_g: 1.53,
      fat_g: 0.17,
      saturated_fat_g: 0.04,
      carbohydrate_g: 27.88,
      sugars_g: 0.5,
      fibre_g: 4.1,
      sodium_mg: 9,
      calcium_mg: 17,
      iron_mg: 0.54,
      magnesium_mg: 21,
      potassium_mg: 816,
      zinc_mg: 0.24,
      vitamin_a_ug: 7,
      vitamin_c_mg: 17.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.3,
      vitamin_b12_ug: 0,
      folate_ug: 23,
      caffeine_mg: 0,
    },
  },
  {
    id: "cassava",
    code: "ING-254",
    name: "Cassava",
    category: "other",
    density: 0.85,
    fdc: "FDC 169945 · Cassava, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw cassava. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 160,
      protein_g: 1.36,
      fat_g: 0.28,
      saturated_fat_g: 0.07,
      carbohydrate_g: 38.06,
      sugars_g: 1.7,
      fibre_g: 1.8,
      sodium_mg: 14,
      calcium_mg: 16,
      iron_mg: 0.27,
      magnesium_mg: 21,
      potassium_mg: 271,
      zinc_mg: 0.34,
      vitamin_a_ug: 1,
      vitamin_c_mg: 20.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 27,
      caffeine_mg: 0,
    },
  },
  {
    id: "leaf-lettuce",
    code: "ING-255",
    name: "Leaf Lettuce",
    category: "other",
    density: 0.3,
    fdc: "FDC 169249 · Lettuce, green leaf, raw (SR Legacy FDC 169249 is butterhead — use FDC 169248 green leaf proxy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw green leaf lettuce. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 15,
      protein_g: 1.36,
      fat_g: 0.15,
      saturated_fat_g: 0.02,
      carbohydrate_g: 2.87,
      sugars_g: 0.78,
      fibre_g: 1.3,
      sodium_mg: 28,
      calcium_mg: 36,
      iron_mg: 0.86,
      magnesium_mg: 13,
      potassium_mg: 194,
      zinc_mg: 0.18,
      vitamin_a_ug: 370,
      vitamin_c_mg: 9.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 126.3,
      vitamin_b12_ug: 0,
      folate_ug: 38,
      caffeine_mg: 0,
    },
  },
  {
    id: "red-leaf-lettuce",
    code: "ING-256",
    name: "Red Leaf Lettuce",
    category: "other",
    density: 0.3,
    fdc: "FDC 168423 · Lettuce, red leaf, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw red leaf lettuce. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 13,
      protein_g: 1.33,
      fat_g: 0.22,
      saturated_fat_g: 0.03,
      carbohydrate_g: 2.26,
      sugars_g: 0.48,
      fibre_g: 0.9,
      sodium_mg: 25,
      calcium_mg: 33,
      iron_mg: 1.2,
      magnesium_mg: 12,
      potassium_mg: 187,
      zinc_mg: 0.2,
      vitamin_a_ug: 375,
      vitamin_c_mg: 3.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 140.3,
      vitamin_b12_ug: 0,
      folate_ug: 36,
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
  { ing: "yam", cell: "chia", template: "tenon-rutabaga-chia-elevated", fromId: "rutabaga" },
  { ing: "red-leaf-lettuce", cell: "overnight-oats", template: "tenon-plantain-overnight-oats-elevated", fromId: "plantain" },
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
  out = out.replaceAll("Three thousand one hundred builds.", "Three thousand one hundred fifty builds.");
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
