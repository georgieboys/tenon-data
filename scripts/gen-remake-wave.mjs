#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1401;
const baseBuilds = 1400;

const INGREDIENTS = [
  {
    id: "bay-leaf",
    code: "ING-111",
    name: "Bay Leaf",
    category: "spice",
    density: 0.2,
    fdc: "FDC 170917 · Spices, bay leaf (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried bay leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 313,
      protein_g: 7.61,
      fat_g: 8.36,
      saturated_fat_g: 2.28,
      carbohydrate_g: 74.97,
      sugars_g: 0,
      fibre_g: 26.3,
      sodium_mg: 23,
      calcium_mg: 834,
      iron_mg: 43,
      magnesium_mg: 120,
      potassium_mg: 529,
      zinc_mg: 3.7,
      vitamin_a_ug: 309,
      vitamin_c_mg: 46.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 180,
      caffeine_mg: 0,
    },
  },
  {
    id: "allspice",
    code: "ING-112",
    name: "Allspice",
    category: "spice",
    density: 0.45,
    fdc: "FDC 171315 · Spices, allspice, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground allspice. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 263,
      protein_g: 6.09,
      fat_g: 8.69,
      saturated_fat_g: 2.55,
      carbohydrate_g: 72.12,
      sugars_g: 0,
      fibre_g: 21.6,
      sodium_mg: 77,
      calcium_mg: 661,
      iron_mg: 7.06,
      magnesium_mg: 135,
      potassium_mg: 1044,
      zinc_mg: 1.01,
      vitamin_a_ug: 27,
      vitamin_c_mg: 39.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 36,
      caffeine_mg: 0,
    },
  },
  {
    id: "cayenne",
    code: "ING-113",
    name: "Cayenne",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170416 · Spices, pepper, red or cayenne (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground cayenne. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 318,
      protein_g: 12.01,
      fat_g: 17.27,
      saturated_fat_g: 3.26,
      carbohydrate_g: 56.63,
      sugars_g: 10.34,
      fibre_g: 27.2,
      sodium_mg: 30,
      calcium_mg: 148,
      iron_mg: 7.8,
      magnesium_mg: 152,
      potassium_mg: 2014,
      zinc_mg: 2.48,
      vitamin_a_ug: 2081,
      vitamin_c_mg: 76.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 106,
      caffeine_mg: 0,
    },
  },
  {
    id: "saffron",
    code: "ING-114",
    name: "Saffron",
    category: "spice",
    density: 0.15,
    fdc: "FDC 170934 · Spices, saffron (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Saffron threads. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 310,
      protein_g: 11.43,
      fat_g: 5.85,
      saturated_fat_g: 1.59,
      carbohydrate_g: 65.37,
      sugars_g: 0,
      fibre_g: 3.9,
      sodium_mg: 148,
      calcium_mg: 111,
      iron_mg: 11.1,
      magnesium_mg: 264,
      potassium_mg: 1724,
      zinc_mg: 1.09,
      vitamin_a_ug: 27,
      vitamin_c_mg: 80.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 93,
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
  { ing: "cayenne", cell: "chia", template: "tenon-cilantro-chia-elevated", fromId: "cilantro" },
  { ing: "saffron", cell: "overnight-oats", template: "tenon-lemongrass-overnight-oats-elevated", fromId: "lemongrass" },
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
  out = out.replaceAll(`One thousand four hundred builds.`, "One thousand four hundred fifty builds.");
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
