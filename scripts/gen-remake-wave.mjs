#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2701;
const baseBuilds = 2700;

const INGREDIENTS = [
  {
    id: "tempeh",
    code: "ING-218",
    name: "Tempeh",
    category: "other",
    density: 0.95,
    fdc: "FDC 174272 · Tempeh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Tempeh. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 192,
      protein_g: 20.29,
      fat_g: 10.8,
      saturated_fat_g: 2.54,
      carbohydrate_g: 7.64,
      sugars_g: 0,
      fibre_g: 5.4,
      sodium_mg: 9,
      calcium_mg: 111,
      iron_mg: 2.7,
      magnesium_mg: 81,
      potassium_mg: 412,
      zinc_mg: 1.14,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.08,
      folate_ug: 24,
      caffeine_mg: 0,
    },
  },
  {
    id: "seitan",
    code: "ING-219",
    name: "Seitan",
    category: "other",
    density: 1.0,
    fdc: "FDC 174272 · Seitan proxy via vital wheat gluten cooked estimate. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Seitan (wheat gluten). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 370,
      protein_g: 75.16,
      fat_g: 1.85,
      saturated_fat_g: 0.27,
      carbohydrate_g: 13.79,
      sugars_g: 0,
      fibre_g: 0.6,
      sodium_mg: 29,
      calcium_mg: 142,
      iron_mg: 5.2,
      magnesium_mg: 25,
      potassium_mg: 100,
      zinc_mg: 0.85,
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
    id: "shiitake",
    code: "ING-220",
    name: "Shiitake",
    category: "other",
    density: 0.4,
    fdc: "FDC 169242 · Mushrooms, shiitake, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw shiitake. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 34,
      protein_g: 2.24,
      fat_g: 0.49,
      saturated_fat_g: 0.04,
      carbohydrate_g: 6.79,
      sugars_g: 2.38,
      fibre_g: 2.5,
      sodium_mg: 9,
      calcium_mg: 2,
      iron_mg: 0.41,
      magnesium_mg: 20,
      potassium_mg: 304,
      zinc_mg: 1.03,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.1,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 13,
      caffeine_mg: 0,
    },
  },
  {
    id: "oyster-mushroom",
    code: "ING-221",
    name: "Oyster Mushroom",
    category: "other",
    density: 0.35,
    fdc: "FDC 168580 · Mushrooms, oyster, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw oyster mushrooms. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 33,
      protein_g: 3.31,
      fat_g: 0.41,
      saturated_fat_g: 0.06,
      carbohydrate_g: 6.09,
      sugars_g: 1.11,
      fibre_g: 2.3,
      sodium_mg: 18,
      calcium_mg: 3,
      iron_mg: 1.33,
      magnesium_mg: 18,
      potassium_mg: 420,
      zinc_mg: 0.77,
      vitamin_a_ug: 2,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.7,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 38,
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
  { ing: "tempeh", cell: "chia", template: "tenon-cannellini-chia-elevated", fromId: "cannellini" },
  { ing: "oyster-mushroom", cell: "overnight-oats", template: "tenon-tofu-overnight-oats-elevated", fromId: "tofu" },
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
  out = out.replaceAll("Two thousand seven hundred builds.", "Two thousand seven hundred fifty builds.");
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
