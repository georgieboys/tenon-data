#!/usr/bin/env node
/**
 * Clone the raspberry 12-chassis remake matrix for new ingredients.
 * Usage: node scripts/gen-remake-wave.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 801; // BLD / MNU

const INGREDIENTS = [
  {
    id: "pecan",
    code: "ING-063",
    name: "Pecan",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170182 · Nuts, pecans (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Pecans. Replace with the café SKU label when locked.",
    nutrition: {
      energy_kcal: 691,
      protein_g: 9.17,
      fat_g: 71.97,
      saturated_fat_g: 6.18,
      carbohydrate_g: 13.86,
      sugars_g: 3.97,
      fibre_g: 9.6,
      sodium_mg: 0,
      calcium_mg: 70,
      iron_mg: 2.53,
      magnesium_mg: 121,
      potassium_mg: 410,
      zinc_mg: 4.53,
      vitamin_a_ug: 3,
      vitamin_c_mg: 1.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "peach",
    code: "ING-064",
    name: "Peach",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 169928 · Peaches, yellow, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw peach. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 39,
      protein_g: 0.91,
      fat_g: 0.25,
      saturated_fat_g: 0.02,
      carbohydrate_g: 9.54,
      sugars_g: 8.39,
      fibre_g: 1.5,
      sodium_mg: 0,
      calcium_mg: 6,
      iron_mg: 0.25,
      magnesium_mg: 9,
      potassium_mg: 190,
      zinc_mg: 0.17,
      vitamin_a_ug: 16,
      vitamin_c_mg: 6.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.6,
      vitamin_b12_ug: 0,
      folate_ug: 4,
      caffeine_mg: 0,
    },
  },
  {
    id: "pineapple",
    code: "ING-065",
    name: "Pineapple",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 169124 · Pineapple, raw, all varieties (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw pineapple. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 50,
      protein_g: 0.54,
      fat_g: 0.12,
      saturated_fat_g: 0.01,
      carbohydrate_g: 13.12,
      sugars_g: 9.85,
      fibre_g: 1.4,
      sodium_mg: 1,
      calcium_mg: 13,
      iron_mg: 0.29,
      magnesium_mg: 12,
      potassium_mg: 109,
      zinc_mg: 0.12,
      vitamin_a_ug: 3,
      vitamin_c_mg: 47.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.7,
      vitamin_b12_ug: 0,
      folate_ug: 18,
      caffeine_mg: 0,
    },
  },
  {
    id: "kale",
    code: "ING-066",
    name: "Kale",
    category: "other",
    density: 0.3,
    fdc: "FDC 168421 · Kale, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw kale. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 2.92,
      fat_g: 1.49,
      saturated_fat_g: 0.18,
      carbohydrate_g: 4.42,
      sugars_g: 0.99,
      fibre_g: 4.1,
      sodium_mg: 53,
      calcium_mg: 254,
      iron_mg: 1.6,
      magnesium_mg: 33,
      potassium_mg: 348,
      zinc_mg: 0.39,
      vitamin_a_ug: 241,
      vitamin_c_mg: 93.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 389.6,
      vitamin_b12_ug: 0,
      folate_ug: 62,
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
  { ing: "peach", cell: "chia", template: "tenon-blackberry-chia-elevated" },
  { ing: "pineapple", cell: "overnight-oats", template: "tenon-mango-overnight-oats-elevated" },
];

function titleCase(id) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ingredientMd(ing) {
  const n = ing.nutrition;
  const lines = Object.entries(n)
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
  if (kind === "build") {
    out = out.replace(/code: BLD-\d+/, `code: BLD-${String(codeNum).padStart(3, "0")}`);
  } else {
    out = out.replace(/code: MNU-\d+/, `code: MNU-${String(codeNum).padStart(3, "0")}`);
  }
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
  if (kind === "build") {
    out = out.replace(/code: BLD-\d+/, `code: BLD-${String(codeNum).padStart(3, "0")}`);
  } else {
    out = out.replace(/code: MNU-\d+/, `code: MNU-${String(codeNum).padStart(3, "0")}`);
  }
  out = out.replaceAll(`Elevated ${toId} cell`, `Elevated ${prose} cell`);
  out = out.replaceAll(`elevated ${toId}`, `elevated ${prose}`);
  out = out.replaceAll(`with elevated ${toId}`, `with elevated ${prose}`);
  out = out.replaceAll(`Eight hundred builds.`, "Eight hundred fifty builds.");
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
  const fromId = elev.template.includes("blackberry")
    ? "blackberry"
    : elev.template.includes("mango")
      ? "mango"
      : "raspberry";
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.template}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.template}.md`), "utf8");
  const meta = INGREDIENTS.find((i) => i.id === elev.ing);
  writeFileSync(
    path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcBuild, fromId, elev.ing, meta.name, code, "build"),
  );
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, fromId, elev.ing, meta.name, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}

console.log(
  `done through BLD-${code - 1}; expected builds ${800 + INGREDIENTS.length * CELLS.length + ELEVATED.length}`,
);
