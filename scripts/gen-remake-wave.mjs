#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8215;
const baseBuilds = 8214;

const INGREDIENTS = [
  {
    id: "gruyere",
    code: "ING-666",
    name: "Gruyere",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171242 · Cheese, gruyere (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Gruyère. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 413,
      protein_g: 29.8,
      fat_g: 32.3,
      saturated_fat_g: 18.9,
      carbohydrate_g: 0.4,
      sugars_g: 0.4,
      fibre_g: 0,
      sodium_mg: 336,
      calcium_mg: 1011,
      iron_mg: 0.2,
      magnesium_mg: 36,
      potassium_mg: 81,
      zinc_mg: 3.9,
      vitamin_a_ug: 271,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.6,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 1.6,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "emmental",
    code: "ING-667",
    name: "Emmental",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171240 · Cheese, swiss (SR Legacy) as emmental proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Emmental. Contains milk. Nutrition uses Swiss cheese proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 380,
      protein_g: 29.0,
      fat_g: 28.0,
      saturated_fat_g: 18.0,
      carbohydrate_g: 1.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 190,
      calcium_mg: 890,
      iron_mg: 0.2,
      magnesium_mg: 35,
      potassium_mg: 80,
      zinc_mg: 4.0,
      vitamin_a_ug: 250,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.5,
      vitamin_b12_ug: 2.0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "havarti",
    code: "ING-668",
    name: "Havarti",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170849 · Cheese, muenster (SR Legacy) as havarti proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Havarti. Contains milk. Nutrition uses muenster proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 371,
      protein_g: 23.0,
      fat_g: 30.0,
      saturated_fat_g: 19.0,
      carbohydrate_g: 2.0,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 650,
      calcium_mg: 650,
      iron_mg: 0.2,
      magnesium_mg: 20,
      potassium_mg: 80,
      zinc_mg: 2.5,
      vitamin_a_ug: 250,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 1.2,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "comte",
    code: "ING-669",
    name: "Comte",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171242 · Cheese, gruyere (SR Legacy) as Comté proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Comté. Contains milk. Nutrition uses Gruyère proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 407,
      protein_g: 28.0,
      fat_g: 32.0,
      saturated_fat_g: 20.0,
      carbohydrate_g: 0.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 350,
      calcium_mg: 950,
      iron_mg: 0.2,
      magnesium_mg: 35,
      potassium_mg: 85,
      zinc_mg: 3.8,
      vitamin_a_ug: 260,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.5,
      vitamin_b12_ug: 1.5,
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
  { ing: "gruyere", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "comte", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  const diet = ing.diet || { plant_based: true, vegetarian: true };
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
  plant_based: ${diet.plant_based}
  vegetarian: ${diet.vegetarian}
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand two hundred sixty-four builds.");
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
