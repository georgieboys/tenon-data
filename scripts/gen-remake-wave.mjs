#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2501;
const baseBuilds = 2500;

const INGREDIENTS = [
  {
    id: "sorrel",
    code: "ING-202",
    name: "Sorrel",
    category: "other",
    density: 0.3,
    fdc: "FDC 168412 · Sorrel proxy via endive, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sorrel. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 2.0,
      fat_g: 0.7,
      saturated_fat_g: 0.1,
      carbohydrate_g: 3.2,
      sugars_g: 0.4,
      fibre_g: 2.9,
      sodium_mg: 4,
      calcium_mg: 44,
      iron_mg: 2.4,
      magnesium_mg: 40,
      potassium_mg: 390,
      zinc_mg: 0.3,
      vitamin_a_ug: 200,
      vitamin_c_mg: 48,
      vitamin_d_ug: 0,
      vitamin_k_ug: 180,
      vitamin_b12_ug: 0,
      folate_ug: 13,
      caffeine_mg: 0,
    },
  },
  {
    id: "fennel",
    code: "ING-203",
    name: "Fennel",
    category: "other",
    density: 0.6,
    fdc: "FDC 169385 · Fennel, bulb, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw fennel bulb. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 31,
      protein_g: 1.24,
      fat_g: 0.2,
      saturated_fat_g: 0.09,
      carbohydrate_g: 7.3,
      sugars_g: 3.93,
      fibre_g: 3.1,
      sodium_mg: 52,
      calcium_mg: 49,
      iron_mg: 0.73,
      magnesium_mg: 17,
      potassium_mg: 414,
      zinc_mg: 0.2,
      vitamin_a_ug: 48,
      vitamin_c_mg: 12,
      vitamin_d_ug: 0,
      vitamin_k_ug: 62.8,
      vitamin_b12_ug: 0,
      folate_ug: 27,
      caffeine_mg: 0,
    },
  },
  {
    id: "brussels-sprout",
    code: "ING-204",
    name: "Brussels Sprout",
    category: "other",
    density: 0.7,
    fdc: "FDC 170383 · Brussels sprouts, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw Brussels sprouts. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 43,
      protein_g: 3.38,
      fat_g: 0.3,
      saturated_fat_g: 0.06,
      carbohydrate_g: 8.95,
      sugars_g: 2.2,
      fibre_g: 3.8,
      sodium_mg: 25,
      calcium_mg: 42,
      iron_mg: 1.4,
      magnesium_mg: 23,
      potassium_mg: 389,
      zinc_mg: 0.42,
      vitamin_a_ug: 38,
      vitamin_c_mg: 85,
      vitamin_d_ug: 0,
      vitamin_k_ug: 177,
      vitamin_b12_ug: 0,
      folate_ug: 61,
      caffeine_mg: 0,
    },
  },
  {
    id: "okra",
    code: "ING-205",
    name: "Okra",
    category: "other",
    density: 0.6,
    fdc: "FDC 169260 · Okra, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw okra. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 33,
      protein_g: 1.93,
      fat_g: 0.19,
      saturated_fat_g: 0.03,
      carbohydrate_g: 7.45,
      sugars_g: 1.48,
      fibre_g: 3.2,
      sodium_mg: 7,
      calcium_mg: 82,
      iron_mg: 0.62,
      magnesium_mg: 57,
      potassium_mg: 299,
      zinc_mg: 0.58,
      vitamin_a_ug: 36,
      vitamin_c_mg: 23,
      vitamin_d_ug: 0,
      vitamin_k_ug: 31.3,
      vitamin_b12_ug: 0,
      folate_ug: 60,
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
  { ing: "sorrel", cell: "chia", template: "tenon-frisee-chia-elevated", fromId: "frisee" },
  { ing: "okra", cell: "overnight-oats", template: "tenon-purslane-overnight-oats-elevated", fromId: "purslane" },
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
  out = out.replaceAll("Two thousand five hundred builds.", "Two thousand five hundred fifty builds.");
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
