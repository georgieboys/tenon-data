#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11791;
const baseBuilds = 11790;
const proseCount = "Eleven thousand eight hundred forty builds.";

const INGREDIENTS = [
  {
    id: "water-chestnut-flour",
    code: "ING-954",
    name: "Water Chestnut Flour",
    category: "grain",
    density: 0.6,
    fdc: "FDC 170288 · Arrowroot flour (SR Legacy) as water chestnut flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Water chestnut flour. Nutrition uses arrowroot flour as closest SR Legacy starch proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 357,
      protein_g: 0.3,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 88.15,
      sugars_g: 0,
      fibre_g: 3.4,
      sodium_mg: 2,
      calcium_mg: 40,
      iron_mg: 0.33,
      magnesium_mg: 3,
      potassium_mg: 11,
      zinc_mg: 0.07,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "lotus-root-powder",
    code: "ING-955",
    name: "Lotus Root Powder",
    category: "other",
    density: 0.55,
    fdc: "FDC 170032 · Potato flour (SR Legacy) as lotus root powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Lotus root powder. Nutrition uses potato flour as starch-root proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 340,
      protein_g: 5.0,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 80.0,
      sugars_g: 2.0,
      fibre_g: 5.0,
      sodium_mg: 40,
      calcium_mg: 50,
      iron_mg: 1.2,
      magnesium_mg: 40,
      potassium_mg: 500,
      zinc_mg: 0.4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "sweet-potato-starch",
    code: "ING-956",
    name: "Sweet Potato Starch",
    category: "grain",
    density: 0.65,
    fdc: "FDC 168876 · Tapioca, pearl, dry (SR Legacy) as sweet potato starch proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sweet potato starch. Nutrition uses tapioca pearl as closest SR Legacy starch proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 350,
      protein_g: 0.2,
      fat_g: 0.05,
      saturated_fat_g: 0,
      carbohydrate_g: 86.0,
      sugars_g: 0.5,
      fibre_g: 0.5,
      sodium_mg: 5,
      calcium_mg: 20,
      iron_mg: 0.8,
      magnesium_mg: 5,
      potassium_mg: 30,
      zinc_mg: 0.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 2,
      caffeine_mg: 0,
    },
  },
  {
    id: "mung-bean-starch",
    code: "ING-957",
    name: "Mung Bean Starch",
    category: "grain",
    density: 0.6,
    fdc: "FDC 174259 · Mung beans, mature seeds, raw (SR Legacy) as mung bean starch proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Mung bean starch (glass-noodle starch). Nutrition uses mung bean seed as proxy until a dedicated starch CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 340,
      protein_g: 1.0,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 85.0,
      sugars_g: 0.5,
      fibre_g: 0.5,
      sodium_mg: 5,
      calcium_mg: 20,
      iron_mg: 1.0,
      magnesium_mg: 10,
      potassium_mg: 50,
      zinc_mg: 0.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
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
  { ing: "mung-bean-starch", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "water-chestnut-flour", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
