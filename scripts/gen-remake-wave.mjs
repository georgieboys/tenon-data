#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2251;
const baseBuilds = 2250;

const INGREDIENTS = [
  {
    id: "radish",
    code: "ING-182",
    name: "Radish",
    category: "other",
    density: 0.9,
    fdc: "FDC 169249 · Radishes, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw radish. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 16,
      protein_g: 0.68,
      fat_g: 0.1,
      saturated_fat_g: 0.03,
      carbohydrate_g: 3.4,
      sugars_g: 1.86,
      fibre_g: 1.6,
      sodium_mg: 39,
      calcium_mg: 25,
      iron_mg: 0.34,
      magnesium_mg: 10,
      potassium_mg: 233,
      zinc_mg: 0.28,
      vitamin_a_ug: 0,
      vitamin_c_mg: 14.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.3,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "turnip",
    code: "ING-183",
    name: "Turnip",
    category: "other",
    density: 0.9,
    fdc: "FDC 170465 · Turnips, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw turnip. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 28,
      protein_g: 0.9,
      fat_g: 0.1,
      saturated_fat_g: 0.01,
      carbohydrate_g: 6.43,
      sugars_g: 3.8,
      fibre_g: 1.8,
      sodium_mg: 67,
      calcium_mg: 30,
      iron_mg: 0.3,
      magnesium_mg: 11,
      potassium_mg: 191,
      zinc_mg: 0.27,
      vitamin_a_ug: 0,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "parsnip",
    code: "ING-184",
    name: "Parsnip",
    category: "other",
    density: 0.9,
    fdc: "FDC 170417 · Parsnips, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw parsnip. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 75,
      protein_g: 1.2,
      fat_g: 0.3,
      saturated_fat_g: 0.05,
      carbohydrate_g: 17.99,
      sugars_g: 4.8,
      fibre_g: 4.9,
      sodium_mg: 10,
      calcium_mg: 36,
      iron_mg: 0.59,
      magnesium_mg: 29,
      potassium_mg: 375,
      zinc_mg: 0.59,
      vitamin_a_ug: 0,
      vitamin_c_mg: 17,
      vitamin_d_ug: 0,
      vitamin_k_ug: 22.5,
      vitamin_b12_ug: 0,
      folate_ug: 67,
      caffeine_mg: 0,
    },
  },
  {
    id: "leek",
    code: "ING-185",
    name: "Leek",
    category: "other",
    density: 0.85,
    fdc: "FDC 169246 · Leeks, (bulb and lower leaf-portion), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw leek. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 61,
      protein_g: 1.5,
      fat_g: 0.3,
      saturated_fat_g: 0.04,
      carbohydrate_g: 14.15,
      sugars_g: 3.9,
      fibre_g: 1.8,
      sodium_mg: 20,
      calcium_mg: 59,
      iron_mg: 2.1,
      magnesium_mg: 28,
      potassium_mg: 180,
      zinc_mg: 0.12,
      vitamin_a_ug: 83,
      vitamin_c_mg: 12,
      vitamin_d_ug: 0,
      vitamin_k_ug: 47,
      vitamin_b12_ug: 0,
      folate_ug: 64,
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
  { ing: "radish", cell: "chia", template: "tenon-asparagus-chia-elevated", fromId: "asparagus" },
  { ing: "leek", cell: "overnight-oats", template: "tenon-arugula-overnight-oats-elevated", fromId: "arugula" },
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
  out = out.replaceAll("Two thousand two hundred fifty builds.", "Two thousand three hundred builds.");
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
