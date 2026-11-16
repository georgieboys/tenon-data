#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7001;
const baseBuilds = 7000;

const INGREDIENTS = [
  {
    id: "kefir",
    code: "ING-568",
    name: "Kefir",
    category: "dairy",
    density: 1.03,
    fdc: "FDC 170874 · Milk, buttermilk, fluid, cultured, lowfat (SR Legacy) as kefir proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Kefir. Contains milk. Nutrition uses buttermilk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 41,
      protein_g: 3.5,
      fat_g: 1.0,
      saturated_fat_g: 0.6,
      carbohydrate_g: 4.5,
      sugars_g: 4.5,
      fibre_g: 0,
      sodium_mg: 50,
      calcium_mg: 120,
      iron_mg: 0.05,
      magnesium_mg: 12,
      potassium_mg: 150,
      zinc_mg: 0.4,
      vitamin_a_ug: 30,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0.3,
      folate_ug: 8,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "skyr",
    code: "ING-569",
    name: "Skyr",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170886 · Yogurt, Greek, plain, nonfat (SR Legacy) as skyr proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Skyr. Contains milk. Nutrition uses Greek yogurt nonfat proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 59,
      protein_g: 10.19,
      fat_g: 0.39,
      saturated_fat_g: 0.12,
      carbohydrate_g: 3.64,
      sugars_g: 3.24,
      fibre_g: 0,
      sodium_mg: 36,
      calcium_mg: 110,
      iron_mg: 0.04,
      magnesium_mg: 11,
      potassium_mg: 141,
      zinc_mg: 0.52,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.75,
      folate_ug: 7,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "quark",
    code: "ING-570",
    name: "Quark",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170886 · Yogurt, Greek, plain, nonfat (SR Legacy) as quark proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Quark. Contains milk. Nutrition uses Greek yogurt proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 70,
      protein_g: 12.0,
      fat_g: 0.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 4.0,
      sugars_g: 3.5,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 100,
      iron_mg: 0.05,
      magnesium_mg: 12,
      potassium_mg: 140,
      zinc_mg: 0.5,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0.5,
      folate_ug: 8,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
  },
  {
    id: "ricotta",
    code: "ING-571",
    name: "Ricotta",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170851 · Cheese, ricotta, whole milk (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Ricotta cheese. Contains milk. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 174,
      protein_g: 11.26,
      fat_g: 12.98,
      saturated_fat_g: 8.3,
      carbohydrate_g: 3.04,
      sugars_g: 0.27,
      fibre_g: 0,
      sodium_mg: 84,
      calcium_mg: 207,
      iron_mg: 0.38,
      magnesium_mg: 11,
      potassium_mg: 105,
      zinc_mg: 1.16,
      vitamin_a_ug: 120,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.1,
      vitamin_b12_ug: 0.34,
      folate_ug: 12,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: true },
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
  { ing: "kefir", cell: "chia", template: "tenon-tiger-nut-milk-chia-elevated", fromId: "tiger-nut-milk" },
  { ing: "ricotta", cell: "overnight-oats", template: "tenon-buttermilk-overnight-oats-elevated", fromId: "buttermilk" },
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
  out = out.replaceAll("Seven thousand builds.", "Seven thousand fifty builds.");
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
