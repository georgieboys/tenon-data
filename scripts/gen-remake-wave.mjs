#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13891;
const baseBuilds = 13890;
const proseCount = "Thirteen thousand nine hundred forty builds.";

const INGREDIENTS = [
  {
    id: "cashew-powder",
    code: "ING-1122",
    name: "Cashew Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170162 · Nuts, cashew nuts, raw (SR Legacy) as cashew powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Cashew powder (distinct from cashew). Contains tree nut. Nutrition uses SR Legacy cashew until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 553,
      protein_g: 18.2,
      fat_g: 43.9,
      saturated_fat_g: 7.8,
      carbohydrate_g: 30.2,
      sugars_g: 5.9,
      fibre_g: 3.3,
      sodium_mg: 12,
      calcium_mg: 37,
      iron_mg: 6.7,
      magnesium_mg: 292,
      potassium_mg: 660,
      zinc_mg: 5.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 34.1,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "walnut-powder",
    code: "ING-1123",
    name: "Walnut Powder",
    category: "nut_seed",
    density: 0.45,
    fdc: "FDC 170187 · Nuts, walnuts, english (SR Legacy) as walnut powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Walnut powder (distinct from whole walnut). Contains tree nut. Nutrition uses SR Legacy english walnut until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 654,
      protein_g: 15.2,
      fat_g: 65.2,
      saturated_fat_g: 6.1,
      carbohydrate_g: 13.7,
      sugars_g: 2.6,
      fibre_g: 6.7,
      sodium_mg: 2,
      calcium_mg: 98,
      iron_mg: 2.9,
      magnesium_mg: 158,
      potassium_mg: 441,
      zinc_mg: 3.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0,
      folate_ug: 98,
      caffeine_mg: 0,
    },
  },
  {
    id: "pecan-powder",
    code: "ING-1124",
    name: "Pecan Powder",
    category: "nut_seed",
    density: 0.45,
    fdc: "FDC 170182 · Nuts, pecans (SR Legacy) as pecan powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Pecan powder (distinct from whole pecan). Contains tree nut. Nutrition uses SR Legacy pecan until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 691,
      protein_g: 9.2,
      fat_g: 72,
      saturated_fat_g: 6.2,
      carbohydrate_g: 13.9,
      sugars_g: 4,
      fibre_g: 9.6,
      sodium_mg: 0,
      calcium_mg: 70,
      iron_mg: 2.5,
      magnesium_mg: 121,
      potassium_mg: 410,
      zinc_mg: 4.5,
      vitamin_a_ug: 3,
      vitamin_c_mg: 1.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "hazelnut-powder",
    code: "ING-1125",
    name: "Hazelnut Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170581 · Nuts, hazelnuts or filberts (SR Legacy) as hazelnut powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Hazelnut powder (distinct from whole hazelnut). Contains tree nut. Nutrition uses SR Legacy hazelnut until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 628,
      protein_g: 15,
      fat_g: 60.8,
      saturated_fat_g: 4.5,
      carbohydrate_g: 16.7,
      sugars_g: 4.3,
      fibre_g: 9.7,
      sodium_mg: 0,
      calcium_mg: 114,
      iron_mg: 4.7,
      magnesium_mg: 163,
      potassium_mg: 680,
      zinc_mg: 2.5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 14.2,
      vitamin_b12_ug: 0,
      folate_ug: 113,
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
  { ing: "cashew-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "hazelnut-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  let out = src.replaceAll("raspberry", "__ING__");
  out = out.replaceAll("tenon-__ING__-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon __ING__ ", `Tenon ${title} `);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("__ING__", ingId);
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", proseCount);
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
