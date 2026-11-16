#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5151;
const baseBuilds = 5150;

const INGREDIENTS = [
  {
    id: "butter-bean",
    code: "ING-420",
    name: "Butter Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 174253 · Lima beans, large, mature seeds, raw (SR Legacy) as butter-bean market name. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried butter beans (large lima market name). Distinct catalogue cell from lima-bean for SKU labelling. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 338,
      protein_g: 21.5,
      fat_g: 0.7,
      saturated_fat_g: 0.2,
      carbohydrate_g: 63.4,
      sugars_g: 8.5,
      fibre_g: 19.0,
      sodium_mg: 18,
      calcium_mg: 81,
      iron_mg: 7.5,
      magnesium_mg: 224,
      potassium_mg: 1724,
      zinc_mg: 2.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6.0,
      vitamin_b12_ug: 0,
      folate_ug: 395,
      caffeine_mg: 0,
    },
  },
  {
    id: "cranberry-bean",
    code: "ING-421",
    name: "Cranberry Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 173801 · Beans, cranberry (roman), mature seeds, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried cranberry (roman) beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 335,
      protein_g: 23.0,
      fat_g: 1.1,
      saturated_fat_g: 0.3,
      carbohydrate_g: 60.1,
      sugars_g: 0,
      fibre_g: 24.7,
      sodium_mg: 6,
      calcium_mg: 127,
      iron_mg: 5.0,
      magnesium_mg: 156,
      potassium_mg: 1334,
      zinc_mg: 2.9,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.6,
      vitamin_b12_ug: 0,
      folate_ug: 604,
      caffeine_mg: 0,
    },
  },
  {
    id: "flageolet",
    code: "ING-422",
    name: "Flageolet",
    category: "other",
    density: 0.75,
    fdc: "FDC 173738 · Beans, french, mature seeds, raw (SR Legacy) as flageolet proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried flageolet beans (French green kidney-type). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 343,
      protein_g: 18.8,
      fat_g: 2.0,
      saturated_fat_g: 0.2,
      carbohydrate_g: 64.1,
      sugars_g: 0,
      fibre_g: 25.2,
      sodium_mg: 18,
      calcium_mg: 186,
      iron_mg: 5.5,
      magnesium_mg: 188,
      potassium_mg: 1316,
      zinc_mg: 1.9,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 399,
      caffeine_mg: 0,
    },
  },
  {
    id: "yellow-split-pea",
    code: "ING-423",
    name: "Yellow Split Pea",
    category: "other",
    density: 0.8,
    fdc: "FDC 172421 · Peas, split, mature seeds, raw (SR Legacy) as yellow split pea proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried yellow split peas. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 341,
      protein_g: 24.6,
      fat_g: 1.2,
      saturated_fat_g: 0.2,
      carbohydrate_g: 60.4,
      sugars_g: 8.0,
      fibre_g: 25.5,
      sodium_mg: 15,
      calcium_mg: 55,
      iron_mg: 4.4,
      magnesium_mg: 115,
      potassium_mg: 981,
      zinc_mg: 3.0,
      vitamin_a_ug: 7,
      vitamin_c_mg: 1.8,
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
  { ing: "butter-bean", cell: "chia", template: "tenon-moong-dal-chia-elevated", fromId: "moong-dal" },
  { ing: "yellow-split-pea", cell: "overnight-oats", template: "tenon-gram-flour-overnight-oats-elevated", fromId: "gram-flour" },
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
  out = out.replaceAll("Five thousand one hundred fifty builds.", "Five thousand two hundred builds.");
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
