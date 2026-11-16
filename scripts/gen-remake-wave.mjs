#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11491;
const baseBuilds = 11490;
const proseCount = "Eleven thousand five hundred forty builds.";

const INGREDIENTS = [
  {
    id: "koji-kin",
    code: "ING-930",
    name: "Koji Kin",
    category: "other",
    density: 0.4,
    fdc: "Branded Aspergillus oryzae koji-kin spore culture on rice flour carrier (no dedicated SR Legacy row). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Koji-kin spore culture. Nutrition is a rice-flour carrier proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 360,
      protein_g: 7,
      fat_g: 1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 78,
      sugars_g: 0.5,
      fibre_g: 1,
      sodium_mg: 5,
      calcium_mg: 15,
      iron_mg: 1,
      magnesium_mg: 20,
      potassium_mg: 80,
      zinc_mg: 0.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "nori-dashi",
    code: "ING-931",
    name: "Nori Dashi",
    category: "other",
    density: 1.0,
    fdc: "FDC 168457 · Seaweed, laver, raw (SR Legacy) diluted as nori dashi proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Nori dashi. Nutrition uses diluted laver as proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 5,
      protein_g: 0.6,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.5,
      sugars_g: 0,
      fibre_g: 0.1,
      sodium_mg: 40,
      calcium_mg: 10,
      iron_mg: 0.2,
      magnesium_mg: 2,
      potassium_mg: 50,
      zinc_mg: 0.1,
      vitamin_a_ug: 20,
      vitamin_c_mg: 2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "wakame-flakes",
    code: "ING-932",
    name: "Wakame Flakes",
    category: "other",
    density: 0.25,
    fdc: "FDC 2709988 · Seaweed, dried (FNDDS) as wakame flakes proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried wakame flakes. Nutrition uses dried seaweed proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 45,
      protein_g: 3.0,
      fat_g: 0.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 9.1,
      sugars_g: 0.6,
      fibre_g: 0.5,
      sodium_mg: 870,
      calcium_mg: 150,
      iron_mg: 2.2,
      magnesium_mg: 107,
      potassium_mg: 50,
      zinc_mg: 0.4,
      vitamin_a_ug: 36,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.3,
      vitamin_b12_ug: 0,
      folate_ug: 196,
      caffeine_mg: 0,
    },
  },
  {
    id: "aonori",
    code: "ING-933",
    name: "Aonori",
    category: "other",
    density: 0.2,
    fdc: "FDC 168457 · Seaweed, laver, raw (SR Legacy) as aonori (green nori flakes) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Aonori (green nori flakes). Nutrition uses laver proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 35,
      protein_g: 5.8,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 5.1,
      sugars_g: 0.5,
      fibre_g: 0.3,
      sodium_mg: 48,
      calcium_mg: 70,
      iron_mg: 1.8,
      magnesium_mg: 2,
      potassium_mg: 356,
      zinc_mg: 1.1,
      vitamin_a_ug: 260,
      vitamin_c_mg: 39.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.0,
      vitamin_b12_ug: 0,
      folate_ug: 146,
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
  { ing: "aonori", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "wakame-flakes", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
