#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1451;
const baseBuilds = 1450;

const INGREDIENTS = [
  {
    id: "caraway",
    code: "ING-115",
    name: "Caraway",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170918 · Spices, caraway seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Caraway seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 333,
      protein_g: 19.77,
      fat_g: 14.59,
      saturated_fat_g: 0.62,
      carbohydrate_g: 49.9,
      sugars_g: 0.64,
      fibre_g: 38,
      sodium_mg: 17,
      calcium_mg: 689,
      iron_mg: 16.23,
      magnesium_mg: 258,
      potassium_mg: 1351,
      zinc_mg: 5.5,
      vitamin_a_ug: 18,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "mace",
    code: "ING-116",
    name: "Mace",
    category: "spice",
    density: 0.4,
    fdc: "FDC 170927 · Spices, mace, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground mace. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 475,
      protein_g: 6.71,
      fat_g: 32.38,
      saturated_fat_g: 9.51,
      carbohydrate_g: 50.5,
      sugars_g: 0,
      fibre_g: 20.2,
      sodium_mg: 80,
      calcium_mg: 252,
      iron_mg: 13.9,
      magnesium_mg: 163,
      potassium_mg: 463,
      zinc_mg: 2.3,
      vitamin_a_ug: 40,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.1,
      vitamin_b12_ug: 0,
      folate_ug: 76,
      caffeine_mg: 0,
    },
  },
  {
    id: "marjoram",
    code: "ING-117",
    name: "Marjoram",
    category: "spice",
    density: 0.3,
    fdc: "FDC 170928 · Spices, marjoram, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried marjoram. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 271,
      protein_g: 12.66,
      fat_g: 7.04,
      saturated_fat_g: 0.53,
      carbohydrate_g: 60.56,
      sugars_g: 4.09,
      fibre_g: 40.3,
      sodium_mg: 77,
      calcium_mg: 1990,
      iron_mg: 82.71,
      magnesium_mg: 346,
      potassium_mg: 1522,
      zinc_mg: 3.6,
      vitamin_a_ug: 403,
      vitamin_c_mg: 51.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 621.7,
      vitamin_b12_ug: 0,
      folate_ug: 274,
      caffeine_mg: 0,
    },
  },
  {
    id: "tarragon",
    code: "ING-118",
    name: "Tarragon",
    category: "spice",
    density: 0.3,
    fdc: "FDC 170933 · Spices, tarragon, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried tarragon. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 295,
      protein_g: 22.77,
      fat_g: 7.24,
      saturated_fat_g: 1.88,
      carbohydrate_g: 50.22,
      sugars_g: 0,
      fibre_g: 7.4,
      sodium_mg: 62,
      calcium_mg: 1139,
      iron_mg: 32.3,
      magnesium_mg: 347,
      potassium_mg: 3020,
      zinc_mg: 3.9,
      vitamin_a_ug: 210,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 274,
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
  { ing: "caraway", cell: "chia", template: "tenon-cayenne-chia-elevated", fromId: "cayenne" },
  { ing: "tarragon", cell: "overnight-oats", template: "tenon-saffron-overnight-oats-elevated", fromId: "saffron" },
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
  out = out.replaceAll("One thousand four hundred fifty builds.", "One thousand five hundred builds.");
  out = out.replaceAll("One thousand four hundred builds.", "One thousand five hundred builds.");
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
