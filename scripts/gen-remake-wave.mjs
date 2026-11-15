#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1351;
const baseBuilds = 1350;

const INGREDIENTS = [
  {
    id: "cilantro",
    code: "ING-107",
    name: "Cilantro",
    category: "spice",
    density: 0.2,
    fdc: "FDC 169997 · Coriander (cilantro) leaves, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh cilantro. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 2.13,
      fat_g: 0.52,
      saturated_fat_g: 0.01,
      carbohydrate_g: 3.67,
      sugars_g: 0.87,
      fibre_g: 2.8,
      sodium_mg: 46,
      calcium_mg: 67,
      iron_mg: 1.77,
      magnesium_mg: 26,
      potassium_mg: 521,
      zinc_mg: 0.5,
      vitamin_a_ug: 337,
      vitamin_c_mg: 27,
      vitamin_d_ug: 0,
      vitamin_k_ug: 310,
      vitamin_b12_ug: 0,
      folate_ug: 62,
      caffeine_mg: 0,
    },
  },
  {
    id: "chive",
    code: "ING-108",
    name: "Chive",
    category: "spice",
    density: 0.2,
    fdc: "FDC 169994 · Chives, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh chives. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 3.27,
      fat_g: 0.73,
      saturated_fat_g: 0.15,
      carbohydrate_g: 4.35,
      sugars_g: 1.85,
      fibre_g: 2.5,
      sodium_mg: 3,
      calcium_mg: 92,
      iron_mg: 1.6,
      magnesium_mg: 42,
      potassium_mg: 296,
      zinc_mg: 0.56,
      vitamin_a_ug: 218,
      vitamin_c_mg: 58.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 212.7,
      vitamin_b12_ug: 0,
      folate_ug: 105,
      caffeine_mg: 0,
    },
  },
  {
    id: "lemongrass",
    code: "ING-109",
    name: "Lemongrass",
    category: "spice",
    density: 0.4,
    fdc: "FDC 168277 · Lemon grass (citronella), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw lemongrass. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 99,
      protein_g: 1.82,
      fat_g: 0.49,
      saturated_fat_g: 0.12,
      carbohydrate_g: 25.31,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 6,
      calcium_mg: 65,
      iron_mg: 8.17,
      magnesium_mg: 60,
      potassium_mg: 723,
      zinc_mg: 2.23,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 75,
      caffeine_mg: 0,
    },
  },
  {
    id: "star-anise",
    code: "ING-110",
    name: "Star Anise",
    category: "spice",
    density: 0.4,
    fdc: "FDC 171323 · Spices, anise seed (SR Legacy) proxy for star anise until a dedicated FDC row is locked.",
    allergens: "[]",
    note: "Star anise. Nutrition proxied from anise seed until café CoA lands.",
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
  { ing: "cilantro", cell: "chia", template: "tenon-mint-chia-elevated", fromId: "mint" },
  { ing: "lemongrass", cell: "overnight-oats", template: "tenon-parsley-overnight-oats-elevated", fromId: "parsley" },
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
  out = out.replaceAll(`One thousand three hundred fifty builds.`, "One thousand four hundred builds.");
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
