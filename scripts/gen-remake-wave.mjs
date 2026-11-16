#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3151;
const baseBuilds = 3150;

const INGREDIENTS = [
  {
    id: "napa-cabbage",
    code: "ING-257",
    name: "Napa Cabbage",
    category: "other",
    density: 0.4,
    fdc: "FDC 168572 · Cabbage, chinese (pe-tsai), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw napa cabbage. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 16,
      protein_g: 1.2,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 3.23,
      sugars_g: 1.41,
      fibre_g: 1.2,
      sodium_mg: 9,
      calcium_mg: 77,
      iron_mg: 0.31,
      magnesium_mg: 13,
      potassium_mg: 238,
      zinc_mg: 0.23,
      vitamin_a_ug: 16,
      vitamin_c_mg: 27.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 42.9,
      vitamin_b12_ug: 0,
      folate_ug: 79,
      caffeine_mg: 0,
    },
  },
  {
    id: "savoy-cabbage",
    code: "ING-258",
    name: "Savoy Cabbage",
    category: "other",
    density: 0.45,
    fdc: "FDC 170388 · Cabbage, savoy, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw savoy cabbage. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 27,
      protein_g: 2.0,
      fat_g: 0.1,
      saturated_fat_g: 0.01,
      carbohydrate_g: 6.1,
      sugars_g: 2.27,
      fibre_g: 3.1,
      sodium_mg: 28,
      calcium_mg: 35,
      iron_mg: 0.4,
      magnesium_mg: 28,
      potassium_mg: 230,
      zinc_mg: 0.27,
      vitamin_a_ug: 50,
      vitamin_c_mg: 31.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 68.9,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "mustard-seed",
    code: "ING-259",
    name: "Mustard Seed",
    category: "spice",
    density: 0.7,
    fdc: "FDC 170929 · Spices, mustard seed, ground (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground mustard seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 508,
      protein_g: 26.08,
      fat_g: 36.24,
      saturated_fat_g: 1.99,
      carbohydrate_g: 28.09,
      sugars_g: 6.79,
      fibre_g: 12.2,
      sodium_mg: 13,
      calcium_mg: 266,
      iron_mg: 9.21,
      magnesium_mg: 370,
      potassium_mg: 738,
      zinc_mg: 6.08,
      vitamin_a_ug: 2,
      vitamin_c_mg: 7.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.4,
      vitamin_b12_ug: 0,
      folate_ug: 162,
      caffeine_mg: 0,
    },
  },
  {
    id: "chervil",
    code: "ING-260",
    name: "Chervil",
    category: "other",
    density: 0.25,
    fdc: "FDC 170928 · Spices, chervil, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried chervil. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 237,
      protein_g: 23.2,
      fat_g: 3.9,
      saturated_fat_g: 0.0,
      carbohydrate_g: 49.1,
      sugars_g: 0,
      fibre_g: 11.3,
      sodium_mg: 83,
      calcium_mg: 1346,
      iron_mg: 31.95,
      magnesium_mg: 130,
      potassium_mg: 4740,
      zinc_mg: 8.8,
      vitamin_a_ug: 293,
      vitamin_c_mg: 50.0,
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
  { ing: "napa-cabbage", cell: "chia", template: "tenon-yam-chia-elevated", fromId: "yam" },
  { ing: "chervil", cell: "overnight-oats", template: "tenon-red-leaf-lettuce-overnight-oats-elevated", fromId: "red-leaf-lettuce" },
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
  out = out.replaceAll("Three thousand one hundred fifty builds.", "Three thousand two hundred builds.");
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
