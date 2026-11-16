#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8465;
const baseBuilds = 8464;

const INGREDIENTS = [
  {
    id: "cashew-butter-roasted",
    code: "ING-686",
    name: "Cashew Butter Roasted",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 168589 · Nuts, cashew butter, plain, without salt added (SR Legacy) as roasted cashew butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Roasted cashew butter. Tree nut allergen. Nutrition uses cashew butter proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 587,
      protein_g: 17.6,
      fat_g: 49.4,
      saturated_fat_g: 9.8,
      carbohydrate_g: 27.6,
      sugars_g: 0,
      fibre_g: 2,
      sodium_mg: 15,
      calcium_mg: 43,
      iron_mg: 5,
      magnesium_mg: 258,
      potassium_mg: 546,
      zinc_mg: 4.4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 69,
      caffeine_mg: 0,
    },
  },
  {
    id: "peanut-butter-natural",
    code: "ING-687",
    name: "Peanut Butter Natural",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 172470 · Peanut butter, smooth style, without salt (SR Legacy) as natural peanut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[peanut]",
    note: "Natural peanut butter. Peanut allergen. Nutrition uses unsalted peanut butter proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 588,
      protein_g: 25.1,
      fat_g: 50.4,
      saturated_fat_g: 10.0,
      carbohydrate_g: 20.0,
      sugars_g: 4.2,
      fibre_g: 6.0,
      sodium_mg: 5,
      calcium_mg: 49,
      iron_mg: 1.9,
      magnesium_mg: 168,
      potassium_mg: 649,
      zinc_mg: 2.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0,
      folate_ug: 87,
      caffeine_mg: 0,
    },
  },
  {
    id: "pistachio-butter-raw",
    code: "ING-688",
    name: "Pistachio Butter Raw",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170184 · Nuts, pistachio nuts, raw (SR Legacy) as raw pistachio butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Raw pistachio butter. Tree nut allergen. Nutrition uses raw pistachio proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 560,
      protein_g: 20.2,
      fat_g: 45.3,
      saturated_fat_g: 5.6,
      carbohydrate_g: 27.2,
      sugars_g: 7.7,
      fibre_g: 10.6,
      sodium_mg: 1,
      calcium_mg: 105,
      iron_mg: 3.9,
      magnesium_mg: 121,
      potassium_mg: 1025,
      zinc_mg: 2.2,
      vitamin_a_ug: 26,
      vitamin_c_mg: 5.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 13.2,
      vitamin_b12_ug: 0,
      folate_ug: 51,
      caffeine_mg: 0,
    },
  },
  {
    id: "brazil-nut-butter",
    code: "ING-689",
    name: "Brazil Nut Butter",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 170569 · Nuts, brazilnuts, dried, unblanched (SR Legacy) as brazil nut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Brazil nut butter. Tree nut allergen. Nutrition uses brazil nut proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 659,
      protein_g: 14.3,
      fat_g: 67.1,
      saturated_fat_g: 16.1,
      carbohydrate_g: 12.3,
      sugars_g: 2.3,
      fibre_g: 7.5,
      sodium_mg: 3,
      calcium_mg: 160,
      iron_mg: 2.4,
      magnesium_mg: 376,
      potassium_mg: 659,
      zinc_mg: 4.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 22,
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
  { ing: "cashew-butter-roasted", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "brazil-nut-butter", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand five hundred fourteen builds.");
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
