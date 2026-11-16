#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3551;
const baseBuilds = 3550;

const INGREDIENTS = [
  {
    id: "amaranth-leaf",
    code: "ING-289",
    name: "Amaranth Leaf",
    category: "other",
    density: 0.4,
    fdc: "FDC 11019 · Amaranth leaves, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw amaranth leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 2.46,
      fat_g: 0.33,
      saturated_fat_g: 0.09,
      carbohydrate_g: 4.02,
      sugars_g: 0.3,
      fibre_g: 2.1,
      sodium_mg: 20,
      calcium_mg: 215,
      iron_mg: 2.32,
      magnesium_mg: 55,
      potassium_mg: 611,
      zinc_mg: 0.9,
      vitamin_a_ug: 146,
      vitamin_c_mg: 43.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1140.0,
      vitamin_b12_ug: 0,
      folate_ug: 85,
      caffeine_mg: 0,
    },
  },
  {
    id: "moringa",
    code: "ING-290",
    name: "Moringa",
    category: "other",
    density: 0.35,
    fdc: "FDC 168462 · Drumstick leaves (moringa) cooked SR Legacy as raw-leaf proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw moringa leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 64,
      protein_g: 9.4,
      fat_g: 1.4,
      saturated_fat_g: 0.3,
      carbohydrate_g: 8.3,
      sugars_g: 0.5,
      fibre_g: 2.0,
      sodium_mg: 9,
      calcium_mg: 185,
      iron_mg: 4.0,
      magnesium_mg: 147,
      potassium_mg: 337,
      zinc_mg: 0.6,
      vitamin_a_ug: 378,
      vitamin_c_mg: 51.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "malanga",
    code: "ING-291",
    name: "Malanga",
    category: "other",
    density: 0.85,
    fdc: "FDC 169308 · Taro, raw (SR Legacy) as malanga / cocoyam proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw malanga (cocoyam). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 112,
      protein_g: 1.5,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 26.46,
      sugars_g: 0.4,
      fibre_g: 4.1,
      sodium_mg: 11,
      calcium_mg: 43,
      iron_mg: 0.55,
      magnesium_mg: 33,
      potassium_mg: 591,
      zinc_mg: 0.23,
      vitamin_a_ug: 4,
      vitamin_c_mg: 4.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "hubbard-squash",
    code: "ING-292",
    name: "Hubbard Squash",
    category: "other",
    density: 0.75,
    fdc: "FDC 168475 · Squash, winter, hubbard, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw hubbard squash. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 2.0,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 8.7,
      sugars_g: 3.0,
      fibre_g: 3.9,
      sodium_mg: 7,
      calcium_mg: 14,
      iron_mg: 0.4,
      magnesium_mg: 19,
      potassium_mg: 320,
      zinc_mg: 0.15,
      vitamin_a_ug: 68,
      vitamin_c_mg: 11.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0,
      folate_ug: 16,
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
  { ing: "amaranth-leaf", cell: "chia", template: "tenon-loquat-chia-elevated", fromId: "loquat" },
  { ing: "hubbard-squash", cell: "overnight-oats", template: "tenon-dandelion-greens-overnight-oats-elevated", fromId: "dandelion-greens" },
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
  out = out.replaceAll("Three thousand five hundred fifty builds.", "Three thousand six hundred builds.");
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
