#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1101;
const baseBuilds = 1100;

const INGREDIENTS = [
  {
    id: "black-bean",
    code: "ING-087",
    name: "Black Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 175185 · Beans, black, mature seeds, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dry black beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 341,
      protein_g: 21.6,
      fat_g: 1.42,
      saturated_fat_g: 0.37,
      carbohydrate_g: 62.36,
      sugars_g: 2.12,
      fibre_g: 15.5,
      sodium_mg: 5,
      calcium_mg: 123,
      iron_mg: 5.02,
      magnesium_mg: 171,
      potassium_mg: 1483,
      zinc_mg: 3.65,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6,
      vitamin_b12_ug: 0,
      folate_ug: 444,
      caffeine_mg: 0,
    },
  },
  {
    id: "corn",
    code: "ING-088",
    name: "Corn",
    category: "grain",
    density: 0.7,
    fdc: "FDC 169998 · Corn, sweet, yellow, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sweet corn. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 86,
      protein_g: 3.27,
      fat_g: 1.35,
      saturated_fat_g: 0.33,
      carbohydrate_g: 18.7,
      sugars_g: 6.26,
      fibre_g: 2,
      sodium_mg: 15,
      calcium_mg: 2,
      iron_mg: 0.52,
      magnesium_mg: 37,
      potassium_mg: 270,
      zinc_mg: 0.46,
      vitamin_a_ug: 9,
      vitamin_c_mg: 6.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 42,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-sugar",
    code: "ING-089",
    name: "Coconut Sugar",
    category: "sweetener",
    density: 0.8,
    fdc: "FDC 170286 · Sugars, granulated (SR Legacy) proxy for coconut sugar solids until a dedicated FDC row is locked.",
    allergens: "[]",
    note: "Coconut sugar. Energy/macros proxied from granulated sugar until café CoA lands; micronutrients incomplete.",
    nutrition: {
      energy_kcal: 387,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 99.98,
      sugars_g: 99.8,
      fibre_g: 0,
      sodium_mg: 1,
      calcium_mg: 1,
      iron_mg: 0.05,
      magnesium_mg: 0,
      potassium_mg: 2,
      zinc_mg: 0,
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
    id: "apple-cider-vinegar",
    code: "ING-090",
    name: "Apple Cider Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 173130 · Vinegar, cider (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Apple cider vinegar. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 21,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.93,
      sugars_g: 0.4,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 7,
      iron_mg: 0.2,
      magnesium_mg: 5,
      potassium_mg: 73,
      zinc_mg: 0.04,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
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
  { ing: "corn", cell: "chia", template: "tenon-garlic-chia-elevated", fromId: "garlic" },
  { ing: "black-bean", cell: "overnight-oats", template: "tenon-lentil-overnight-oats-elevated", fromId: "lentil" },
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
  out = out.replaceAll(`One thousand one hundred builds.`, "One thousand one hundred fifty builds.");
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
