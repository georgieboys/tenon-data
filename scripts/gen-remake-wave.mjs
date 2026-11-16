#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8265;
const baseBuilds = 8264;

const INGREDIENTS = [
  {
    id: "raclette",
    code: "ING-670",
    name: "Raclette",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170849 · Cheese, muenster (SR Legacy) as raclette proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Raclette. Contains milk. Nutrition uses muenster proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 357,
      protein_g: 24.0,
      fat_g: 28.0,
      saturated_fat_g: 18.0,
      carbohydrate_g: 1.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 800,
      calcium_mg: 650,
      iron_mg: 0.2,
      magnesium_mg: 25,
      potassium_mg: 80,
      zinc_mg: 2.8,
      vitamin_a_ug: 240,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 1.5,
      folate_ug: 12,
      caffeine_mg: 0,
    },
  },
  {
    id: "fontina",
    code: "ING-671",
    name: "Fontina",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171241 · Cheese, fontina (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Fontina. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 389,
      protein_g: 25.6,
      fat_g: 31.1,
      saturated_fat_g: 19.2,
      carbohydrate_g: 1.6,
      sugars_g: 1.6,
      fibre_g: 0,
      sodium_mg: 800,
      calcium_mg: 550,
      iron_mg: 0.2,
      magnesium_mg: 14,
      potassium_mg: 64,
      zinc_mg: 3.5,
      vitamin_a_ug: 261,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 1.8,
      vitamin_b12_ug: 1.7,
      folate_ug: 6,
      caffeine_mg: 0,
    },
  },
  {
    id: "asiago",
    code: "ING-672",
    name: "Asiago",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171247 · Cheese, parmesan, hard (SR Legacy) as asiago proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Asiago. Contains milk. Nutrition uses parmesan proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 392,
      protein_g: 30.0,
      fat_g: 28.0,
      saturated_fat_g: 18.0,
      carbohydrate_g: 2.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 1200,
      calcium_mg: 1000,
      iron_mg: 0.5,
      magnesium_mg: 35,
      potassium_mg: 90,
      zinc_mg: 3.5,
      vitamin_a_ug: 220,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 1.2,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "colby",
    code: "ING-673",
    name: "Colby",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173415 · Cheese, colby (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Colby. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 394,
      protein_g: 23.8,
      fat_g: 32.1,
      saturated_fat_g: 20.2,
      carbohydrate_g: 2.6,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 604,
      calcium_mg: 685,
      iron_mg: 0.8,
      magnesium_mg: 26,
      potassium_mg: 127,
      zinc_mg: 3.1,
      vitamin_a_ug: 264,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.6,
      vitamin_k_ug: 2.4,
      vitamin_b12_ug: 0.8,
      folate_ug: 18,
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
  { ing: "raclette", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "asiago", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand three hundred fourteen builds.");
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
