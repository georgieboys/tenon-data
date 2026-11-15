#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1601;
const baseBuilds = 1600;

const INGREDIENTS = [
  {
    id: "celery-seed",
    code: "ING-127",
    name: "Celery Seed",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170920 · Spices, celery seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Celery seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 392,
      protein_g: 18.07,
      fat_g: 25.27,
      saturated_fat_g: 2.19,
      carbohydrate_g: 41.35,
      sugars_g: 0.67,
      fibre_g: 11.8,
      sodium_mg: 160,
      calcium_mg: 1767,
      iron_mg: 44.9,
      magnesium_mg: 440,
      potassium_mg: 1400,
      zinc_mg: 6.93,
      vitamin_a_ug: 3,
      vitamin_c_mg: 17.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "dill-seed",
    code: "ING-128",
    name: "Dill Seed",
    category: "spice",
    density: 0.4,
    fdc: "FDC 170923 · Spices, dill seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dill seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 305,
      protein_g: 15.98,
      fat_g: 14.54,
      saturated_fat_g: 0.69,
      carbohydrate_g: 55.17,
      sugars_g: 0,
      fibre_g: 21.1,
      sodium_mg: 20,
      calcium_mg: 1516,
      iron_mg: 16.33,
      magnesium_mg: 256,
      potassium_mg: 1186,
      zinc_mg: 5.2,
      vitamin_a_ug: 3,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "savory",
    code: "ING-129",
    name: "Savory",
    category: "spice",
    density: 0.3,
    fdc: "FDC 170932 · Spices, savory, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground savory. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 272,
      protein_g: 6.73,
      fat_g: 5.91,
      saturated_fat_g: 3.26,
      carbohydrate_g: 68.73,
      sugars_g: 0,
      fibre_g: 45.7,
      sodium_mg: 24,
      calcium_mg: 2132,
      iron_mg: 37.88,
      magnesium_mg: 377,
      potassium_mg: 1051,
      zinc_mg: 4.3,
      vitamin_a_ug: 257,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "quinoa",
    code: "ING-130",
    name: "Quinoa",
    category: "grain",
    density: 0.75,
    fdc: "FDC 168874 · Quinoa, uncooked (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Uncooked quinoa. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 368,
      protein_g: 14.12,
      fat_g: 6.07,
      saturated_fat_g: 0.71,
      carbohydrate_g: 64.16,
      sugars_g: 0,
      fibre_g: 7,
      sodium_mg: 5,
      calcium_mg: 47,
      iron_mg: 4.57,
      magnesium_mg: 197,
      potassium_mg: 563,
      zinc_mg: 3.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 184,
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
  { ing: "celery-seed", cell: "chia", template: "tenon-macadamia-chia-elevated", fromId: "macadamia" },
  { ing: "quinoa", cell: "overnight-oats", template: "tenon-anise-seed-overnight-oats-elevated", fromId: "anise-seed" },
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
  out = out.replaceAll("One thousand six hundred builds.", "One thousand six hundred fifty builds.");
  return out;
}

let code = startCode;
for (const ing of INGREDIENTS) {
  writeFileSync(path.join(root, "ingredients", `${ing.id}.md`), ingredientMd(ing));
  console.log(`+ ingredient ${ing.id}`);
  for (const cell of CELLS) {
    const srcBuild = readFileSync(path.join(root, "builds", `tenon-raspberry-${cell}.md`), "utf8");
    const srcMenu = readFileSync(path.join(root, "menu", `tenon-raspberry-${cell}.md`), "utf8");
    writeFileSync(
      path.join(root, "builds", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcBuild, ing.id, ing.name, code, "build"),
    );
    writeFileSync(
      path.join(root, "menu", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcMenu, ing.id, ing.name, code, "menu"),
    );
    code += 1;
  }
}
for (const elev of ELEVATED) {
  const cellSlug = `${elev.cell}-elevated`;
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.template}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.template}.md`), "utf8");
  const meta = INGREDIENTS.find((i) => i.id === elev.ing);
  writeFileSync(
    path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcBuild, elev.fromId, elev.ing, meta.name, code, "build"),
  );
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, elev.fromId, elev.ing, meta.name, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}
console.log(
  `done through BLD-${code - 1}; expected builds ${baseBuilds + INGREDIENTS.length * CELLS.length + ELEVATED.length}`,
);
