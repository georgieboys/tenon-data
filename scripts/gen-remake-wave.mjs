#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1951;
const baseBuilds = 1950;

const INGREDIENTS = [
  {
    id: "papaya",
    code: "ING-157",
    name: "Papaya",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 169926 · Papayas, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw papaya. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 43,
      protein_g: 0.47,
      fat_g: 0.26,
      saturated_fat_g: 0.08,
      carbohydrate_g: 10.82,
      sugars_g: 7.82,
      fibre_g: 1.7,
      sodium_mg: 8,
      calcium_mg: 20,
      iron_mg: 0.25,
      magnesium_mg: 21,
      potassium_mg: 182,
      zinc_mg: 0.08,
      vitamin_a_ug: 47,
      vitamin_c_mg: 60.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.6,
      vitamin_b12_ug: 0,
      folate_ug: 37,
      caffeine_mg: 0,
    },
  },
  {
    id: "guava",
    code: "ING-158",
    name: "Guava",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 173044 · Guavas, common, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw guava. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 68,
      protein_g: 2.55,
      fat_g: 0.95,
      saturated_fat_g: 0.27,
      carbohydrate_g: 14.32,
      sugars_g: 8.92,
      fibre_g: 5.4,
      sodium_mg: 2,
      calcium_mg: 18,
      iron_mg: 0.26,
      magnesium_mg: 22,
      potassium_mg: 417,
      zinc_mg: 0.23,
      vitamin_a_ug: 31,
      vitamin_c_mg: 228.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.6,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "passion-fruit",
    code: "ING-159",
    name: "Passion Fruit",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 169108 · Passion-fruit, (granadilla), purple, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Purple passion fruit. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 97,
      protein_g: 2.2,
      fat_g: 0.7,
      saturated_fat_g: 0.06,
      carbohydrate_g: 23.38,
      sugars_g: 11.2,
      fibre_g: 10.4,
      sodium_mg: 28,
      calcium_mg: 12,
      iron_mg: 1.6,
      magnesium_mg: 29,
      potassium_mg: 348,
      zinc_mg: 0.1,
      vitamin_a_ug: 64,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.7,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "lychee",
    code: "ING-160",
    name: "Lychee",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 169086 · Litchis, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw lychee. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 66,
      protein_g: 0.83,
      fat_g: 0.44,
      saturated_fat_g: 0.1,
      carbohydrate_g: 16.53,
      sugars_g: 15.23,
      fibre_g: 1.3,
      sodium_mg: 1,
      calcium_mg: 5,
      iron_mg: 0.31,
      magnesium_mg: 10,
      potassium_mg: 171,
      zinc_mg: 0.07,
      vitamin_a_ug: 0,
      vitamin_c_mg: 71.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.4,
      vitamin_b12_ug: 0,
      folate_ug: 14,
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
  { ing: "papaya", cell: "chia", template: "tenon-goji-chia-elevated", fromId: "goji" },
  { ing: "lychee", cell: "overnight-oats", template: "tenon-lime-overnight-oats-elevated", fromId: "lime" },
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
  out = out.replaceAll("One thousand nine hundred fifty builds.", "Two thousand builds.");
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
