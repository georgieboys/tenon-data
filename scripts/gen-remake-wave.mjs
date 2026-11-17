#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12641;
const baseBuilds = 12640;
const proseCount = "Twelve thousand six hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "rosehip-powder",
    code: "ING-1022",
    name: "Rosehip Powder",
    category: "spice",
    density: 0.45,
    fdc: "Branded rosehip powder (no dedicated dry-powder SR Legacy row). High-vitamin-C fruit proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Rosehip powder. Nutrition is a branded fruit proxy until a café CoA lands. High vitamin C claim stays provisional. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 260,
      protein_g: 4,
      fat_g: 1.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 60,
      sugars_g: 15,
      fibre_g: 25,
      sodium_mg: 10,
      calcium_mg: 160,
      iron_mg: 5,
      magnesium_mg: 60,
      potassium_mg: 700,
      zinc_mg: 0.8,
      vitamin_a_ug: 200,
      vitamin_c_mg: 400,
      vitamin_d_ug: 0,
      vitamin_k_ug: 25,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "chicory-root",
    code: "ING-1023",
    name: "Chicory Root",
    category: "spice",
    density: 0.5,
    fdc: "Branded roasted chicory root (no dedicated SR Legacy roasted-root row). Inulin-rich root proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Roasted chicory root (coffee alternative). Nutrition is a branded inulin-rich root proxy until a café CoA lands. Naturally caffeine-free. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 72,
      protein_g: 1.4,
      fat_g: 0.2,
      saturated_fat_g: 0.05,
      carbohydrate_g: 17,
      sugars_g: 2,
      fibre_g: 15,
      sodium_mg: 20,
      calcium_mg: 40,
      iron_mg: 0.8,
      magnesium_mg: 20,
      potassium_mg: 290,
      zinc_mg: 0.3,
      vitamin_a_ug: 5,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "dandelion-root",
    code: "ING-1024",
    name: "Dandelion Root",
    category: "spice",
    density: 0.45,
    fdc: "FDC 169226 · Dandelion greens, raw (SR Legacy) as dandelion root proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Roasted dandelion root. Nutrition uses dandelion greens as closest SR Legacy dandelion proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 50,
      protein_g: 2.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 10,
      sugars_g: 1,
      fibre_g: 4,
      sodium_mg: 50,
      calcium_mg: 150,
      iron_mg: 2.5,
      magnesium_mg: 30,
      potassium_mg: 350,
      zinc_mg: 0.4,
      vitamin_a_ug: 100,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 100,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "nettle-leaf",
    code: "ING-1025",
    name: "Nettle Leaf",
    category: "spice",
    density: 0.25,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as dried nettle leaf proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried nettle leaf. Nutrition uses spinach as closest SR Legacy leafy-green proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 40,
      protein_g: 3.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 6,
      sugars_g: 0.5,
      fibre_g: 4,
      sodium_mg: 40,
      calcium_mg: 400,
      iron_mg: 4,
      magnesium_mg: 50,
      potassium_mg: 450,
      zinc_mg: 0.5,
      vitamin_a_ug: 300,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 400,
      vitamin_b12_ug: 0,
      folate_ug: 80,
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
  { ing: "rosehip-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "nettle-leaf", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
