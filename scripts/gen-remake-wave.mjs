#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4001;
const baseBuilds = 4000;

const INGREDIENTS = [
  {
    id: "fenugreek-leaf",
    code: "ING-325",
    name: "Fenugreek Leaf",
    category: "spice",
    density: 0.35,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as methi / fenugreek leaf proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh fenugreek leaf (methi). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 49,
      protein_g: 4.4,
      fat_g: 0.9,
      saturated_fat_g: 0.2,
      carbohydrate_g: 6.0,
      sugars_g: 0.5,
      fibre_g: 2.5,
      sodium_mg: 20,
      calcium_mg: 395,
      iron_mg: 3.0,
      magnesium_mg: 50,
      potassium_mg: 400,
      zinc_mg: 0.4,
      vitamin_a_ug: 300,
      vitamin_c_mg: 50.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200.0,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "asafoetida",
    code: "ING-326",
    name: "Asafoetida",
    category: "spice",
    density: 0.6,
    fdc: "FDC 171328 · Spices, paprika (SR Legacy) as asafoetida resin-powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Asafoetida powder (hing). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 297,
      protein_g: 4.0,
      fat_g: 1.1,
      saturated_fat_g: 0.3,
      carbohydrate_g: 67.8,
      sugars_g: 0,
      fibre_g: 4.0,
      sodium_mg: 20,
      calcium_mg: 100,
      iron_mg: 4.0,
      magnesium_mg: 50,
      potassium_mg: 200,
      zinc_mg: 0.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "grains-of-paradise",
    code: "ING-327",
    name: "Grains of Paradise",
    category: "spice",
    density: 0.55,
    fdc: "FDC 170931 · Spices, pepper, black (SR Legacy) as grains of paradise proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Whole grains of paradise. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 251,
      protein_g: 10.4,
      fat_g: 3.3,
      saturated_fat_g: 1.4,
      carbohydrate_g: 63.9,
      sugars_g: 0.6,
      fibre_g: 25.3,
      sodium_mg: 20,
      calcium_mg: 443,
      iron_mg: 9.7,
      magnesium_mg: 171,
      potassium_mg: 1329,
      zinc_mg: 1.2,
      vitamin_a_ug: 27,
      vitamin_c_mg: 21.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 163.7,
      vitamin_b12_ug: 0,
      folate_ug: 17,
      caffeine_mg: 0,
    },
  },
  {
    id: "fingerroot",
    code: "ING-328",
    name: "Fingerroot",
    category: "spice",
    density: 0.9,
    fdc: "FDC 169231 · Ginger root, raw (SR Legacy) as fingerroot / krachai proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw fingerroot (krachai). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 70,
      protein_g: 1.5,
      fat_g: 0.7,
      saturated_fat_g: 0.2,
      carbohydrate_g: 15.0,
      sugars_g: 1.2,
      fibre_g: 2.0,
      sodium_mg: 13,
      calcium_mg: 20,
      iron_mg: 0.5,
      magnesium_mg: 35,
      potassium_mg: 350,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 10,
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
  { ing: "fenugreek-leaf", cell: "chia", template: "tenon-sumac-chia-elevated", fromId: "sumac" },
  { ing: "fingerroot", cell: "overnight-oats", template: "tenon-galangal-overnight-oats-elevated", fromId: "galangal" },
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
  out = out.replaceAll("Four thousand builds.", "Four thousand fifty builds.");
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
