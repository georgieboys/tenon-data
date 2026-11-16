#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4551;
const baseBuilds = 4550;

const INGREDIENTS = [
  {
    id: "coconut-water",
    code: "ING-369",
    name: "Coconut Water",
    category: "water",
    density: 1.0,
    fdc: "FDC 170174 · Nuts, coconut water (liquid from coconuts) proxy via coconut meat/water profile. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh coconut water. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 19,
      protein_g: 0.7,
      fat_g: 0.2,
      saturated_fat_g: 0.2,
      carbohydrate_g: 3.7,
      sugars_g: 2.6,
      fibre_g: 1.1,
      sodium_mg: 105,
      calcium_mg: 24,
      iron_mg: 0.3,
      magnesium_mg: 25,
      potassium_mg: 250,
      zinc_mg: 0.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 3,
      caffeine_mg: 0,
    },
  },
  {
    id: "palm-sugar",
    code: "ING-370",
    name: "Palm Sugar",
    category: "sweetener",
    density: 0.9,
    fdc: "FDC 168833 · Sugars, brown (SR Legacy) as palm sugar / gula melaka proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Palm sugar (gula melaka). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 380,
      protein_g: 0.5,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 95.0,
      sugars_g: 90.0,
      fibre_g: 0,
      sodium_mg: 30,
      calcium_mg: 80,
      iron_mg: 1.5,
      magnesium_mg: 30,
      potassium_mg: 300,
      zinc_mg: 0.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "osmanthus",
    code: "ING-371",
    name: "Osmanthus",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as osmanthus blossom proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried osmanthus blossoms. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 1.5,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 7.0,
      sugars_g: 1.5,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 80,
      iron_mg: 1.5,
      magnesium_mg: 25,
      potassium_mg: 150,
      zinc_mg: 0.3,
      vitamin_a_ug: 40,
      vitamin_c_mg: 8.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20.0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "chrysanthemum",
    code: "ING-372",
    name: "Chrysanthemum",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as chrysanthemum blossom proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried chrysanthemum blossoms. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 1.5,
      fat_g: 0.3,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.0,
      sugars_g: 1.0,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 100,
      iron_mg: 2.0,
      magnesium_mg: 30,
      potassium_mg: 180,
      zinc_mg: 0.3,
      vitamin_a_ug: 50,
      vitamin_c_mg: 10.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 25.0,
      vitamin_b12_ug: 0,
      folate_ug: 25,
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
  { ing: "osmanthus", cell: "chia", template: "tenon-chinese-celery-chia-elevated", fromId: "chinese-celery" },
  { ing: "chrysanthemum", cell: "overnight-oats", template: "tenon-young-coconut-overnight-oats-elevated", fromId: "young-coconut" },
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
  out = out.replaceAll("Four thousand five hundred fifty builds.", "Four thousand six hundred builds.");
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
