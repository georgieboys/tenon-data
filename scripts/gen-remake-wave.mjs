#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9465;
const baseBuilds = 9464;

const INGREDIENTS = [
  {
    id: "mango-freeze-dried",
    code: "ING-766",
    name: "Mango Freeze Dried",
    category: "fruit",
    density: 0.2,
    fdc: "FDC 169910 · Mangos, raw (SR Legacy) as freeze-dried mango proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Freeze-dried mango. Nutrition uses raw mango proxy scaled for lower moisture until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 340,
      protein_g: 3.0,
      fat_g: 1.5,
      saturated_fat_g: 0.3,
      carbohydrate_g: 82.0,
      sugars_g: 70.0,
      fibre_g: 8.0,
      sodium_mg: 5,
      calcium_mg: 50,
      iron_mg: 1.0,
      magnesium_mg: 40,
      potassium_mg: 900,
      zinc_mg: 0.5,
      vitamin_a_ug: 200,
      vitamin_c_mg: 200,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 150,
      caffeine_mg: 0,
    },
  },
  {
    id: "banana-chips-unsweetened",
    code: "ING-767",
    name: "Banana Chips Unsweetened",
    category: "fruit",
    density: 0.4,
    fdc: "FDC 173944 · Snacks, banana chips (SR Legacy) as unsweetened banana chips proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Unsweetened banana chips. Nutrition uses banana chips proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 519,
      protein_g: 2.3,
      fat_g: 33.6,
      saturated_fat_g: 28.9,
      carbohydrate_g: 58.4,
      sugars_g: 35.3,
      fibre_g: 7.7,
      sodium_mg: 6,
      calcium_mg: 18,
      iron_mg: 1.3,
      magnesium_mg: 76,
      potassium_mg: 536,
      zinc_mg: 0.8,
      vitamin_a_ug: 4,
      vitamin_c_mg: 6.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.3,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-chips-toasted",
    code: "ING-768",
    name: "Coconut Chips Toasted",
    category: "nut_seed",
    density: 0.4,
    fdc: "FDC 170169 · Nuts, coconut meat, dried (desiccated), toasted (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Toasted coconut chips. Contains tree nut (coconut). Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 592,
      protein_g: 5.3,
      fat_g: 47.0,
      saturated_fat_g: 41.7,
      carbohydrate_g: 44.4,
      sugars_g: 7.4,
      fibre_g: 11.3,
      sodium_mg: 37,
      calcium_mg: 27,
      iron_mg: 3.4,
      magnesium_mg: 90,
      potassium_mg: 554,
      zinc_mg: 2.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 9,
      caffeine_mg: 0,
    },
  },
  {
    id: "date-medjool-paste",
    code: "ING-769",
    name: "Date Medjool Paste",
    category: "fruit",
    density: 1.2,
    fdc: "FDC 168191 · Dates, medjool (SR Legacy) as medjool date paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Medjool date paste. Nutrition uses medjool date proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 277,
      protein_g: 1.8,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 75.0,
      sugars_g: 66.5,
      fibre_g: 6.7,
      sodium_mg: 1,
      calcium_mg: 64,
      iron_mg: 0.9,
      magnesium_mg: 54,
      potassium_mg: 696,
      zinc_mg: 0.4,
      vitamin_a_ug: 7,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0,
      folate_ug: 15,
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
  { ing: "mango-freeze-dried", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "date-medjool-paste", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  // Tokenize first so ingredient ids that contain "raspberry" cannot double-rewrite.
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand five hundred fourteen builds.");
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
