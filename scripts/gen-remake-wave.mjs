#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1301;
const baseBuilds = 1300;

const INGREDIENTS = [
  {
    id: "sage",
    code: "ING-103",
    name: "Sage",
    category: "spice",
    density: 0.25,
    fdc: "FDC 170930 · Spices, sage, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground sage. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 315,
      protein_g: 10.63,
      fat_g: 12.75,
      saturated_fat_g: 7.03,
      carbohydrate_g: 60.73,
      sugars_g: 1.71,
      fibre_g: 40.3,
      sodium_mg: 11,
      calcium_mg: 1652,
      iron_mg: 28.12,
      magnesium_mg: 428,
      potassium_mg: 1070,
      zinc_mg: 4.7,
      vitamin_a_ug: 295,
      vitamin_c_mg: 32.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1714.5,
      vitamin_b12_ug: 0,
      folate_ug: 274,
      caffeine_mg: 0,
    },
  },
  {
    id: "mint",
    code: "ING-104",
    name: "Mint",
    category: "spice",
    density: 0.2,
    fdc: "FDC 173474 · Spearmint, fresh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh spearmint. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 44,
      protein_g: 3.29,
      fat_g: 0.73,
      saturated_fat_g: 0.19,
      carbohydrate_g: 8.41,
      sugars_g: 0,
      fibre_g: 6.8,
      sodium_mg: 30,
      calcium_mg: 199,
      iron_mg: 11.87,
      magnesium_mg: 63,
      potassium_mg: 458,
      zinc_mg: 1.09,
      vitamin_a_ug: 203,
      vitamin_c_mg: 13.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 105,
      caffeine_mg: 0,
    },
  },
  {
    id: "parsley",
    code: "ING-105",
    name: "Parsley",
    category: "spice",
    density: 0.25,
    fdc: "FDC 170416 · Parsley, fresh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh parsley. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 36,
      protein_g: 2.97,
      fat_g: 0.79,
      saturated_fat_g: 0.13,
      carbohydrate_g: 6.33,
      sugars_g: 0.85,
      fibre_g: 3.3,
      sodium_mg: 56,
      calcium_mg: 138,
      iron_mg: 6.2,
      magnesium_mg: 50,
      potassium_mg: 554,
      zinc_mg: 1.07,
      vitamin_a_ug: 421,
      vitamin_c_mg: 133,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1640,
      vitamin_b12_ug: 0,
      folate_ug: 152,
      caffeine_mg: 0,
    },
  },
  {
    id: "dill",
    code: "ING-106",
    name: "Dill",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172233 · Dill weed, fresh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh dill. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 43,
      protein_g: 3.46,
      fat_g: 1.12,
      saturated_fat_g: 0.06,
      carbohydrate_g: 7.02,
      sugars_g: 0,
      fibre_g: 2.1,
      sodium_mg: 61,
      calcium_mg: 208,
      iron_mg: 6.59,
      magnesium_mg: 55,
      potassium_mg: 738,
      zinc_mg: 0.91,
      vitamin_a_ug: 386,
      vitamin_c_mg: 85,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 150,
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
  { ing: "mint", cell: "chia", template: "tenon-rosemary-chia-elevated", fromId: "rosemary" },
  { ing: "parsley", cell: "overnight-oats", template: "tenon-nutmeg-overnight-oats-elevated", fromId: "nutmeg" },
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
  out = out.replaceAll(`One thousand three hundred builds.`, "One thousand three hundred fifty builds.");
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
