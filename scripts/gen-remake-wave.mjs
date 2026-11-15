#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1551;
const baseBuilds = 1550;

const INGREDIENTS = [
  {
    id: "macadamia",
    code: "ING-123",
    name: "Macadamia",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170178 · Nuts, macadamia nuts, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Macadamia nuts. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 718,
      protein_g: 7.91,
      fat_g: 75.77,
      saturated_fat_g: 12.06,
      carbohydrate_g: 13.82,
      sugars_g: 4.57,
      fibre_g: 8.6,
      sodium_mg: 5,
      calcium_mg: 85,
      iron_mg: 3.69,
      magnesium_mg: 130,
      potassium_mg: 368,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 11,
      caffeine_mg: 0,
    },
  },
  {
    id: "brazil-nut",
    code: "ING-124",
    name: "Brazil Nut",
    category: "nut_seed",
    density: 0.6,
    fdc: "FDC 170569 · Nuts, brazilnuts, dried, unblanched (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Brazil nuts. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 659,
      protein_g: 14.32,
      fat_g: 67.1,
      saturated_fat_g: 16.13,
      carbohydrate_g: 12.27,
      sugars_g: 2.33,
      fibre_g: 7.5,
      sodium_mg: 3,
      calcium_mg: 160,
      iron_mg: 2.43,
      magnesium_mg: 376,
      potassium_mg: 659,
      zinc_mg: 4.06,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "chestnut",
    code: "ING-125",
    name: "Chestnut",
    category: "nut_seed",
    density: 0.7,
    fdc: "FDC 170168 · Nuts, chestnuts, european, raw, peeled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "European chestnuts, peeled. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 196,
      protein_g: 1.63,
      fat_g: 1.25,
      saturated_fat_g: 0.24,
      carbohydrate_g: 44.17,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 2,
      calcium_mg: 19,
      iron_mg: 0.94,
      magnesium_mg: 30,
      potassium_mg: 484,
      zinc_mg: 0.49,
      vitamin_a_ug: 1,
      vitamin_c_mg: 40.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 58,
      caffeine_mg: 0,
    },
  },
  {
    id: "anise-seed",
    code: "ING-126",
    name: "Anise Seed",
    category: "spice",
    density: 0.4,
    fdc: "FDC 170919 · Spices, anise seed (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Anise seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 337,
      protein_g: 17.6,
      fat_g: 15.9,
      saturated_fat_g: 0.59,
      carbohydrate_g: 50.02,
      sugars_g: 0,
      fibre_g: 14.6,
      sodium_mg: 16,
      calcium_mg: 646,
      iron_mg: 36.96,
      magnesium_mg: 170,
      potassium_mg: 1441,
      zinc_mg: 5.3,
      vitamin_a_ug: 16,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
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
  { ing: "macadamia", cell: "chia", template: "tenon-fenugreek-chia-elevated", fromId: "fenugreek" },
  { ing: "anise-seed", cell: "overnight-oats", template: "tenon-hazelnut-overnight-oats-elevated", fromId: "hazelnut" },
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
  out = out.replaceAll("One thousand five hundred fifty builds.", "One thousand six hundred builds.");
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
