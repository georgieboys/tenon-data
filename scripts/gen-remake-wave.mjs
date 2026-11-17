#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12841;
const baseBuilds = 12840;
const proseCount = "Twelve thousand eight hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "dill-weed-dried",
    code: "ING-1038",
    name: "Dill Weed Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 172233 · Dill weed, fresh (SR Legacy) as dried dill weed proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried dill weed (distinct from fresh dill and dill seed). Nutrition uses fresh dill weed as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 253,
      protein_g: 20,
      fat_g: 4.4,
      saturated_fat_g: 0.2,
      carbohydrate_g: 55.8,
      sugars_g: 0,
      fibre_g: 13.6,
      sodium_mg: 208,
      calcium_mg: 1784,
      iron_mg: 48.8,
      magnesium_mg: 451,
      potassium_mg: 3308,
      zinc_mg: 3.3,
      vitamin_a_ug: 386,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 150,
      caffeine_mg: 0,
    },
  },
  {
    id: "mint-dried",
    code: "ING-1039",
    name: "Mint Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 173474 · Spearmint, fresh (SR Legacy) as dried mint leaf proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried mint leaf (distinct from fresh mint and peppermint-leaf). Nutrition uses spearmint as closest SR Legacy mint proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 70,
      protein_g: 3.8,
      fat_g: 0.9,
      saturated_fat_g: 0.2,
      carbohydrate_g: 15,
      sugars_g: 0.5,
      fibre_g: 8,
      sodium_mg: 30,
      calcium_mg: 200,
      iron_mg: 5,
      magnesium_mg: 60,
      potassium_mg: 500,
      zinc_mg: 0.8,
      vitamin_a_ug: 200,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 100,
      vitamin_b12_ug: 0,
      folate_ug: 100,
      caffeine_mg: 0,
    },
  },
  {
    id: "spearmint-dried",
    code: "ING-1040",
    name: "Spearmint Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 173475 · Spearmint, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried spearmint. Nutrition uses SR Legacy dried spearmint until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 285,
      protein_g: 19.9,
      fat_g: 6,
      saturated_fat_g: 1.6,
      carbohydrate_g: 52.1,
      sugars_g: 0,
      fibre_g: 29.6,
      sodium_mg: 344,
      calcium_mg: 1488,
      iron_mg: 87.5,
      magnesium_mg: 602,
      potassium_mg: 1924,
      zinc_mg: 2.4,
      vitamin_a_ug: 405,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 530,
      caffeine_mg: 0,
    },
  },
  {
    id: "savory-summer",
    code: "ING-1041",
    name: "Savory Summer",
    category: "spice",
    density: 0.3,
    fdc: "FDC 170932 · Spices, savory, ground (SR Legacy) as summer savory proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Summer savory (distinct from the ground savory cell). Nutrition uses SR Legacy ground savory until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 272,
      protein_g: 6.7,
      fat_g: 5.9,
      saturated_fat_g: 3.3,
      carbohydrate_g: 68.7,
      sugars_g: 0,
      fibre_g: 45.7,
      sodium_mg: 24,
      calcium_mg: 2132,
      iron_mg: 37.9,
      magnesium_mg: 377,
      potassium_mg: 1051,
      zinc_mg: 4.3,
      vitamin_a_ug: 257,
      vitamin_c_mg: 50,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
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
  { ing: "mint-dried", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "savory-summer", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
