#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2951;
const baseBuilds = 2950;

const INGREDIENTS = [
  {
    id: "radicchio",
    code: "ING-241",
    name: "Radicchio",
    category: "other",
    density: 0.35,
    fdc: "FDC 168412 · Radicchio proxy via chicory, witloof, raw (SR Legacy FDC 168412 endive). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw radicchio. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 1.43,
      fat_g: 0.25,
      saturated_fat_g: 0.06,
      carbohydrate_g: 4.48,
      sugars_g: 0.6,
      fibre_g: 0.9,
      sodium_mg: 22,
      calcium_mg: 19,
      iron_mg: 0.57,
      magnesium_mg: 13,
      potassium_mg: 302,
      zinc_mg: 0.62,
      vitamin_a_ug: 1,
      vitamin_c_mg: 8.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 255.2,
      vitamin_b12_ug: 0,
      folate_ug: 60,
      caffeine_mg: 0,
    },
  },
  {
    id: "daikon",
    code: "ING-242",
    name: "Daikon",
    category: "other",
    density: 0.7,
    fdc: "FDC 168550 · Radishes, oriental, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw daikon radish. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 18,
      protein_g: 0.6,
      fat_g: 0.1,
      saturated_fat_g: 0.03,
      carbohydrate_g: 4.1,
      sugars_g: 2.5,
      fibre_g: 1.6,
      sodium_mg: 21,
      calcium_mg: 27,
      iron_mg: 0.4,
      magnesium_mg: 16,
      potassium_mg: 227,
      zinc_mg: 0.15,
      vitamin_a_ug: 0,
      vitamin_c_mg: 22.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 28,
      caffeine_mg: 0,
    },
  },
  {
    id: "kohlrabi",
    code: "ING-243",
    name: "Kohlrabi",
    category: "other",
    density: 0.75,
    fdc: "FDC 168421 · Kohlrabi, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw kohlrabi. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 27,
      protein_g: 1.7,
      fat_g: 0.1,
      saturated_fat_g: 0.01,
      carbohydrate_g: 6.2,
      sugars_g: 2.6,
      fibre_g: 3.6,
      sodium_mg: 20,
      calcium_mg: 24,
      iron_mg: 0.4,
      magnesium_mg: 19,
      potassium_mg: 350,
      zinc_mg: 0.03,
      vitamin_a_ug: 2,
      vitamin_c_mg: 62.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 16,
      caffeine_mg: 0,
    },
  },
  {
    id: "jicama",
    code: "ING-244",
    name: "Jicama",
    category: "other",
    density: 0.7,
    fdc: "FDC 170073 · Yambean (jicama), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw jicama. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 38,
      protein_g: 0.72,
      fat_g: 0.09,
      saturated_fat_g: 0.02,
      carbohydrate_g: 8.82,
      sugars_g: 1.8,
      fibre_g: 4.9,
      sodium_mg: 4,
      calcium_mg: 12,
      iron_mg: 0.6,
      magnesium_mg: 12,
      potassium_mg: 150,
      zinc_mg: 0.16,
      vitamin_a_ug: 1,
      vitamin_c_mg: 20.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
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
  { ing: "radicchio", cell: "chia", template: "tenon-chives-chia-elevated", fromId: "chives" },
  { ing: "jicama", cell: "overnight-oats", template: "tenon-butterhead-overnight-oats-elevated", fromId: "butterhead" },
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
  out = out.replaceAll("Two thousand nine hundred fifty builds.", "Three thousand builds.");
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
