#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2851;
const baseBuilds = 2850;

const INGREDIENTS = [
  {
    id: "pumpkin",
    code: "ING-233",
    name: "Pumpkin",
    category: "other",
    density: 0.7,
    fdc: "FDC 168448 · Pumpkin, raw (SR Legacy FDC 168448 is winter squash — use FDC 168450). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw pumpkin. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 26,
      protein_g: 1.0,
      fat_g: 0.1,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.5,
      sugars_g: 2.76,
      fibre_g: 0.5,
      sodium_mg: 1,
      calcium_mg: 21,
      iron_mg: 0.8,
      magnesium_mg: 12,
      potassium_mg: 340,
      zinc_mg: 0.32,
      vitamin_a_ug: 426,
      vitamin_c_mg: 9.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.1,
      vitamin_b12_ug: 0,
      folate_ug: 16,
      caffeine_mg: 0,
    },
  },
  {
    id: "morel",
    code: "ING-234",
    name: "Morel",
    category: "other",
    density: 0.3,
    fdc: "FDC 168582 · Mushrooms, morel, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw morel mushrooms. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 31,
      protein_g: 3.12,
      fat_g: 0.57,
      saturated_fat_g: 0.07,
      carbohydrate_g: 5.1,
      sugars_g: 0.6,
      fibre_g: 2.8,
      sodium_mg: 2,
      calcium_mg: 43,
      iron_mg: 12.18,
      magnesium_mg: 19,
      potassium_mg: 411,
      zinc_mg: 2.03,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 5.1,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 9,
      caffeine_mg: 0,
    },
  },
  {
    id: "romaine",
    code: "ING-235",
    name: "Romaine",
    category: "other",
    density: 0.3,
    fdc: "FDC 169247 · Lettuce, cos or romaine, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw romaine lettuce. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 17,
      protein_g: 1.23,
      fat_g: 0.3,
      saturated_fat_g: 0.04,
      carbohydrate_g: 3.29,
      sugars_g: 1.19,
      fibre_g: 2.1,
      sodium_mg: 8,
      calcium_mg: 33,
      iron_mg: 0.97,
      magnesium_mg: 14,
      potassium_mg: 247,
      zinc_mg: 0.23,
      vitamin_a_ug: 436,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 102.5,
      vitamin_b12_ug: 0,
      folate_ug: 136,
      caffeine_mg: 0,
    },
  },
  {
    id: "iceberg",
    code: "ING-236",
    name: "Iceberg",
    category: "other",
    density: 0.4,
    fdc: "FDC 169248 · Lettuce, iceberg (includes crisphead types), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw iceberg lettuce. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 14,
      protein_g: 0.9,
      fat_g: 0.14,
      saturated_fat_g: 0.02,
      carbohydrate_g: 2.97,
      sugars_g: 1.97,
      fibre_g: 1.2,
      sodium_mg: 10,
      calcium_mg: 18,
      iron_mg: 0.41,
      magnesium_mg: 7,
      potassium_mg: 141,
      zinc_mg: 0.15,
      vitamin_a_ug: 25,
      vitamin_c_mg: 2.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 24.1,
      vitamin_b12_ug: 0,
      folate_ug: 29,
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
  { ing: "pumpkin", cell: "chia", template: "tenon-olive-chia-elevated", fromId: "olive" },
  { ing: "iceberg", cell: "overnight-oats", template: "tenon-turmeric-overnight-oats-elevated", fromId: "turmeric" },
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
  out = out.replaceAll("Two thousand eight hundred fifty builds.", "Two thousand nine hundred builds.");
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
