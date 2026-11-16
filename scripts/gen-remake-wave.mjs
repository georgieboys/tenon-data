#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3601;
const baseBuilds = 3600;

const INGREDIENTS = [
  {
    id: "dumpling-squash",
    code: "ING-293",
    name: "Dumpling Squash",
    category: "other",
    density: 0.7,
    fdc: "FDC 168482 · Winter squash dumpling cultivar proxy via butternut (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw dumpling squash. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.0,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 10.0,
      sugars_g: 2.5,
      fibre_g: 2.0,
      sodium_mg: 4,
      calcium_mg: 40,
      iron_mg: 0.6,
      magnesium_mg: 30,
      potassium_mg: 340,
      zinc_mg: 0.15,
      vitamin_a_ug: 400,
      vitamin_c_mg: 15.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0,
      folate_ug: 24,
      caffeine_mg: 0,
    },
  },
  {
    id: "sugar-pumpkin",
    code: "ING-294",
    name: "Sugar Pumpkin",
    category: "other",
    density: 0.75,
    fdc: "FDC 168448 · Pumpkin, raw (SR Legacy) as sugar pumpkin proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sugar pumpkin. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 26,
      protein_g: 1.0,
      fat_g: 0.1,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.5,
      sugars_g: 2.76,
      fibre_g: 0.5,
      sodium_mg: 1,
      calcium_mg: 21,
      iron_mg: 0.8,
      magnesium_mg: 12,
      potassium_mg: 340,
      zinc_mg: 0.32,
      vitamin_a_ug: 426,
      vitamin_c_mg: 9.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.1,
      vitamin_b12_ug: 0,
      folate_ug: 16,
      caffeine_mg: 0,
    },
  },
  {
    id: "calabaza",
    code: "ING-295",
    name: "Calabaza",
    category: "other",
    density: 0.75,
    fdc: "FDC 168482 · Calabaza / West Indian pumpkin proxy via winter squash (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw calabaza. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 34,
      protein_g: 1.0,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 8.6,
      sugars_g: 2.5,
      fibre_g: 1.5,
      sodium_mg: 2,
      calcium_mg: 28,
      iron_mg: 0.6,
      magnesium_mg: 20,
      potassium_mg: 350,
      zinc_mg: 0.15,
      vitamin_a_ug: 350,
      vitamin_c_mg: 12.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "burdock",
    code: "ING-296",
    name: "Burdock",
    category: "other",
    density: 0.8,
    fdc: "FDC 169970 · Burdock root, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw burdock root (gobo). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 72,
      protein_g: 1.53,
      fat_g: 0.15,
      saturated_fat_g: 0.03,
      carbohydrate_g: 17.34,
      sugars_g: 2.9,
      fibre_g: 3.3,
      sodium_mg: 5,
      calcium_mg: 41,
      iron_mg: 0.8,
      magnesium_mg: 38,
      potassium_mg: 308,
      zinc_mg: 0.33,
      vitamin_a_ug: 0,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.6,
      vitamin_b12_ug: 0,
      folate_ug: 23,
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
  { ing: "sugar-pumpkin", cell: "chia", template: "tenon-amaranth-leaf-chia-elevated", fromId: "amaranth-leaf" },
  { ing: "burdock", cell: "overnight-oats", template: "tenon-hubbard-squash-overnight-oats-elevated", fromId: "hubbard-squash" },
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
  out = out.replaceAll("Three thousand six hundred builds.", "Three thousand six hundred fifty builds.");
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
