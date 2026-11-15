#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1651;
const baseBuilds = 1650;

const INGREDIENTS = [
  {
    id: "millet",
    code: "ING-132",
    name: "Millet",
    category: "grain",
    density: 0.75,
    fdc: "FDC 169702 · Millet, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw millet. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 378,
      protein_g: 11.02,
      fat_g: 4.22,
      saturated_fat_g: 0.72,
      carbohydrate_g: 72.85,
      sugars_g: 0,
      fibre_g: 8.5,
      sodium_mg: 5,
      calcium_mg: 8,
      iron_mg: 3.01,
      magnesium_mg: 114,
      potassium_mg: 195,
      zinc_mg: 1.68,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.9,
      vitamin_b12_ug: 0,
      folate_ug: 85,
      caffeine_mg: 0,
    },
  },
  {
    id: "amaranth",
    code: "ING-133",
    name: "Amaranth",
    category: "grain",
    density: 0.8,
    fdc: "FDC 170682 · Amaranth grain, uncooked (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Uncooked amaranth grain. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 371,
      protein_g: 13.56,
      fat_g: 7.02,
      saturated_fat_g: 1.46,
      carbohydrate_g: 65.25,
      sugars_g: 1.69,
      fibre_g: 6.7,
      sodium_mg: 4,
      calcium_mg: 159,
      iron_mg: 7.61,
      magnesium_mg: 248,
      potassium_mg: 508,
      zinc_mg: 2.87,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 82,
      caffeine_mg: 0,
    },
  },
  {
    id: "sorghum",
    code: "ING-134",
    name: "Sorghum",
    category: "grain",
    density: 0.75,
    fdc: "FDC 169711 · Sorghum grain (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sorghum grain. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 329,
      protein_g: 10.62,
      fat_g: 3.46,
      saturated_fat_g: 0.61,
      carbohydrate_g: 72.09,
      sugars_g: 0,
      fibre_g: 6.7,
      sodium_mg: 2,
      calcium_mg: 13,
      iron_mg: 3.36,
      magnesium_mg: 165,
      potassium_mg: 363,
      zinc_mg: 1.67,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "barley",
    code: "ING-135",
    name: "Barley",
    category: "grain",
    density: 0.7,
    fdc: "FDC 170283 · Barley, hulled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hulled barley. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 354,
      protein_g: 12.48,
      fat_g: 2.3,
      saturated_fat_g: 0.48,
      carbohydrate_g: 73.48,
      sugars_g: 0.8,
      fibre_g: 17.3,
      sodium_mg: 12,
      calcium_mg: 33,
      iron_mg: 3.6,
      magnesium_mg: 133,
      potassium_mg: 452,
      zinc_mg: 2.77,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.2,
      vitamin_b12_ug: 0,
      folate_ug: 19,
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
  { ing: "millet", cell: "chia", template: "tenon-celery-seed-chia-elevated", fromId: "celery-seed" },
  { ing: "barley", cell: "overnight-oats", template: "tenon-quinoa-overnight-oats-elevated", fromId: "quinoa" },
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
  out = out.replaceAll("One thousand six hundred fifty builds.", "One thousand seven hundred builds.");
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
