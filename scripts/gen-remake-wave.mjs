#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8615;
const baseBuilds = 8614;

const INGREDIENTS = [
  {
    id: "cocoa-nib-butter",
    code: "ING-698",
    name: "Cocoa Nib Butter",
    category: "nut_seed",
    density: 1.0,
    fdc: "FDC 169593 · Cacao, nibs (SR Legacy) as cocoa nib butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cocoa nib butter (ground nibs). Nutrition uses cacao nibs proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 456,
      protein_g: 14.0,
      fat_g: 45.0,
      saturated_fat_g: 25.0,
      carbohydrate_g: 30.0,
      sugars_g: 1.0,
      fibre_g: 20.0,
      sodium_mg: 10,
      calcium_mg: 80,
      iron_mg: 10.0,
      magnesium_mg: 250,
      potassium_mg: 800,
      zinc_mg: 4.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 200,
    },
  },
  {
    id: "seed-butter-mix",
    code: "ING-699",
    name: "Seed Butter Mix",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 168595 · Seeds, sunflower seed butter, without salt (SR Legacy) as mixed seed butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Mixed seed butter (sunflower/pumpkin/flax blend cell). Nutrition uses sunflower seed butter proxy until a dedicated blend CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 617,
      protein_g: 17.3,
      fat_g: 55.2,
      saturated_fat_g: 5.0,
      carbohydrate_g: 23.0,
      sugars_g: 3.0,
      fibre_g: 8.0,
      sodium_mg: 3,
      calcium_mg: 60,
      iron_mg: 4.0,
      magnesium_mg: 300,
      potassium_mg: 600,
      zinc_mg: 4.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "soy-nut-butter",
    code: "ING-700",
    name: "Soy Nut Butter",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 174270 · Soybeans, mature seeds, roasted, no salt added (SR Legacy) as soy nut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Soy nut butter. Soy allergen. Nutrition uses roasted soybean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 451,
      protein_g: 39.6,
      fat_g: 21.6,
      saturated_fat_g: 3.1,
      carbohydrate_g: 30.2,
      sugars_g: 5.0,
      fibre_g: 17.7,
      sodium_mg: 2,
      calcium_mg: 175,
      iron_mg: 5.1,
      magnesium_mg: 228,
      potassium_mg: 1470,
      zinc_mg: 3.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 200,
      caffeine_mg: 0,
    },
  },
  {
    id: "tiger-nut-butter",
    code: "ING-701",
    name: "Tiger Nut Butter",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 170567 · Nuts, hazelnuts or filberts (SR Legacy) as tiger nut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tiger nut (chufa) butter — not a tree nut. Nutrition uses hazelnut fat proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 400,
      protein_g: 5.0,
      fat_g: 25.0,
      saturated_fat_g: 5.0,
      carbohydrate_g: 45.0,
      sugars_g: 15.0,
      fibre_g: 15.0,
      sodium_mg: 5,
      calcium_mg: 50,
      iron_mg: 3.0,
      magnesium_mg: 80,
      potassium_mg: 400,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
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
  { ing: "cocoa-nib-butter", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "tiger-nut-butter", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand six hundred sixty-four builds.");
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
