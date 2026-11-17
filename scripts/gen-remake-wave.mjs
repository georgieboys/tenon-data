#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13491;
const baseBuilds = 13490;
const proseCount = "Thirteen thousand five hundred forty builds.";

const INGREDIENTS = [
  {
    id: "peony-powder",
    code: "ING-1090",
    name: "Peony Powder",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as peony petal powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried peony petal powder. Nutrition uses basil as closest SR Legacy flower proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.8,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 8,
      sugars_g: 1.5,
      fibre_g: 4,
      sodium_mg: 8,
      calcium_mg: 80,
      iron_mg: 1.5,
      magnesium_mg: 25,
      potassium_mg: 160,
      zinc_mg: 0.3,
      vitamin_a_ug: 40,
      vitamin_c_mg: 12,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "cocoa-husk-flour",
    code: "ING-1091",
    name: "Cocoa Husk Flour",
    category: "spice",
    density: 0.4,
    fdc: "FDC 169593 · Cocoa, dry powder, unsweetened (SR Legacy) as cocoa husk flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cocoa husk flour (distinct from cocoa-husk and cocoa powder). Nutrition uses unsweetened cocoa powder as closest SR Legacy proxy until a café CoA lands. Naturally caffeinated. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 220,
      protein_g: 15,
      fat_g: 8,
      saturated_fat_g: 4,
      carbohydrate_g: 50,
      sugars_g: 2,
      fibre_g: 35,
      sodium_mg: 20,
      calcium_mg: 100,
      iron_mg: 10,
      magnesium_mg: 300,
      potassium_mg: 1500,
      zinc_mg: 4,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 80,
    },
  },
  {
    id: "lotus-seed-powder",
    code: "ING-1092",
    name: "Lotus Seed Powder",
    category: "spice",
    density: 0.5,
    fdc: "Branded dried lotus seed flour (no dedicated SR Legacy powder row). Starchy seed flour proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Lotus seed powder (distinct from lotus-root powder). Nutrition is a branded starchy-seed proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 330,
      protein_g: 15,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 65,
      sugars_g: 2,
      fibre_g: 8,
      sodium_mg: 5,
      calcium_mg: 160,
      iron_mg: 3.5,
      magnesium_mg: 200,
      potassium_mg: 1300,
      zinc_mg: 1,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1,
      vitamin_b12_ug: 0,
      folate_ug: 100,
      caffeine_mg: 0,
    },
  },
  {
    id: "water-chestnut-powder",
    code: "ING-1093",
    name: "Water Chestnut Powder",
    category: "spice",
    density: 0.5,
    fdc: "FDC 170402 · Waterchestnuts, chinese, (matai), raw (SR Legacy) as water chestnut powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Water chestnut powder (distinct from water-chestnut-flour). Nutrition uses canned water chestnut as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 320,
      protein_g: 4,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 78,
      sugars_g: 5,
      fibre_g: 8,
      sodium_mg: 20,
      calcium_mg: 40,
      iron_mg: 2,
      magnesium_mg: 40,
      potassium_mg: 600,
      zinc_mg: 0.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5,
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
  { ing: "cocoa-husk-flour", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "lotus-seed-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
