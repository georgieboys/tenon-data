#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9015;
const baseBuilds = 9014;

const INGREDIENTS = [
  {
    id: "cheddar-sharp",
    code: "ING-730",
    name: "Cheddar Sharp",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173414 · Cheese, cheddar (SR Legacy) as sharp cheddar proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Sharp cheddar. Contains milk. Nutrition uses cheddar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 403,
      protein_g: 24.9,
      fat_g: 33.1,
      saturated_fat_g: 21.1,
      carbohydrate_g: 1.3,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 621,
      calcium_mg: 721,
      iron_mg: 0.7,
      magnesium_mg: 28,
      potassium_mg: 98,
      zinc_mg: 3.1,
      vitamin_a_ug: 265,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.6,
      vitamin_k_ug: 2.8,
      vitamin_b12_ug: 0.8,
      folate_ug: 18,
      caffeine_mg: 0,
    },
  },
  {
    id: "cream-cheese-light",
    code: "ING-731",
    name: "Cream Cheese Light",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 173417 · Cheese, cream, low fat (SR Legacy) as light cream cheese proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light cream cheese. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 201,
      protein_g: 7.8,
      fat_g: 15.3,
      saturated_fat_g: 9.6,
      carbohydrate_g: 8.1,
      sugars_g: 5.8,
      fibre_g: 0,
      sodium_mg: 440,
      calcium_mg: 150,
      iron_mg: 0.2,
      magnesium_mg: 10,
      potassium_mg: 180,
      zinc_mg: 0.5,
      vitamin_a_ug: 140,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0.4,
      folate_ug: 12,
      caffeine_mg: 0,
    },
  },
  {
    id: "ricotta-light",
    code: "ING-732",
    name: "Ricotta Light",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170850 · Cheese, ricotta, part skim milk (SR Legacy) as light ricotta proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light ricotta. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 138,
      protein_g: 11.4,
      fat_g: 7.9,
      saturated_fat_g: 4.9,
      carbohydrate_g: 5.1,
      sugars_g: 0.3,
      fibre_g: 0,
      sodium_mg: 125,
      calcium_mg: 272,
      iron_mg: 0.4,
      magnesium_mg: 15,
      potassium_mg: 125,
      zinc_mg: 1.2,
      vitamin_a_ug: 100,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.8,
      vitamin_b12_ug: 0.3,
      folate_ug: 13,
      caffeine_mg: 0,
    },
  },
  {
    id: "mozzarella-smoked",
    code: "ING-733",
    name: "Mozzarella Smoked",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170846 · Cheese, mozzarella, whole milk (SR Legacy) as smoked mozzarella proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Smoked mozzarella. Contains milk. Nutrition uses whole-milk mozzarella proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 285,
      protein_g: 22.0,
      fat_g: 21.0,
      saturated_fat_g: 13.0,
      carbohydrate_g: 2.2,
      sugars_g: 1.0,
      fibre_g: 0,
      sodium_mg: 520,
      calcium_mg: 505,
      iron_mg: 0.2,
      magnesium_mg: 20,
      potassium_mg: 76,
      zinc_mg: 2.9,
      vitamin_a_ug: 175,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.5,
      vitamin_b12_ug: 1.8,
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
  { ing: "cheddar-sharp", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "mozzarella-smoked", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand sixty-four builds.");
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
