#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1251;
const baseBuilds = 1250;

const INGREDIENTS = [
  {
    id: "fennel-seed",
    code: "ING-099",
    name: "Fennel Seed",
    category: "spice",
    density: 0.45,
    fdc: "FDC 171323 · Spices, fennel seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fennel seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 345,
      protein_g: 15.8,
      fat_g: 14.87,
      saturated_fat_g: 0.48,
      carbohydrate_g: 52.29,
      sugars_g: 0,
      fibre_g: 39.8,
      sodium_mg: 88,
      calcium_mg: 1196,
      iron_mg: 18.54,
      magnesium_mg: 385,
      potassium_mg: 1694,
      zinc_mg: 3.7,
      vitamin_a_ug: 7,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "rosemary",
    code: "ING-100",
    name: "Rosemary",
    category: "spice",
    density: 0.25,
    fdc: "FDC 173473 · Rosemary, fresh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh rosemary. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 131,
      protein_g: 3.31,
      fat_g: 5.86,
      saturated_fat_g: 2.84,
      carbohydrate_g: 20.7,
      sugars_g: 0,
      fibre_g: 14.1,
      sodium_mg: 26,
      calcium_mg: 317,
      iron_mg: 6.65,
      magnesium_mg: 91,
      potassium_mg: 668,
      zinc_mg: 0.93,
      vitamin_a_ug: 146,
      vitamin_c_mg: 21.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 109,
      caffeine_mg: 0,
    },
  },
  {
    id: "thyme",
    code: "ING-101",
    name: "Thyme",
    category: "spice",
    density: 0.25,
    fdc: "FDC 173470 · Thyme, fresh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh thyme. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 101,
      protein_g: 5.56,
      fat_g: 1.68,
      saturated_fat_g: 0.47,
      carbohydrate_g: 24.45,
      sugars_g: 0,
      fibre_g: 14,
      sodium_mg: 9,
      calcium_mg: 405,
      iron_mg: 17.45,
      magnesium_mg: 160,
      potassium_mg: 609,
      zinc_mg: 1.81,
      vitamin_a_ug: 238,
      vitamin_c_mg: 160.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 45,
      caffeine_mg: 0,
    },
  },
  {
    id: "nutmeg",
    code: "ING-102",
    name: "Nutmeg",
    category: "spice",
    density: 0.5,
    fdc: "FDC 171326 · Spices, nutmeg, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground nutmeg. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 525,
      protein_g: 5.84,
      fat_g: 36.31,
      saturated_fat_g: 25.94,
      carbohydrate_g: 49.29,
      sugars_g: 28.49,
      fibre_g: 20.8,
      sodium_mg: 16,
      calcium_mg: 184,
      iron_mg: 3.04,
      magnesium_mg: 183,
      potassium_mg: 350,
      zinc_mg: 2.15,
      vitamin_a_ug: 5,
      vitamin_c_mg: 3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 76,
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
  { ing: "rosemary", cell: "chia", template: "tenon-turmeric-chia-elevated", fromId: "turmeric" },
  { ing: "nutmeg", cell: "overnight-oats", template: "tenon-cumin-overnight-oats-elevated", fromId: "cumin" },
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
  out = out.replaceAll(`One thousand two hundred fifty builds.`, "One thousand three hundred builds.");
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
