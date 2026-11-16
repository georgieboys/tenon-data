#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9615;
const baseBuilds = 9614;

const INGREDIENTS = [
  {
    id: "turmeric-fresh",
    code: "ING-778",
    name: "Turmeric Fresh",
    category: "spice",
    density: 0.9,
    fdc: "FDC 172231 · Spices, turmeric, ground (SR Legacy) as fresh turmeric proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh turmeric rhizome. Nutrition uses ground turmeric proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 72,
      protein_g: 2.0,
      fat_g: 0.8,
      saturated_fat_g: 0.3,
      carbohydrate_g: 13.0,
      sugars_g: 0.5,
      fibre_g: 4.0,
      sodium_mg: 5,
      calcium_mg: 40,
      iron_mg: 3.0,
      magnesium_mg: 30,
      potassium_mg: 250,
      zinc_mg: 0.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "ginger-fresh",
    code: "ING-779",
    name: "Ginger Fresh",
    category: "spice",
    density: 0.9,
    fdc: "FDC 169231 · Ginger root, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh ginger root. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 80,
      protein_g: 1.8,
      fat_g: 0.8,
      saturated_fat_g: 0.2,
      carbohydrate_g: 17.8,
      sugars_g: 1.7,
      fibre_g: 2.0,
      sodium_mg: 13,
      calcium_mg: 16,
      iron_mg: 0.6,
      magnesium_mg: 43,
      potassium_mg: 415,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 11,
      caffeine_mg: 0,
    },
  },
  {
    id: "lemongrass-fresh",
    code: "ING-780",
    name: "Lemongrass Fresh",
    category: "spice",
    density: 0.7,
    fdc: "FDC 168462 · Lemon grass (citronella), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh lemongrass. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 99,
      protein_g: 1.8,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 25.3,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 6,
      calcium_mg: 65,
      iron_mg: 8.2,
      magnesium_mg: 60,
      potassium_mg: 723,
      zinc_mg: 2.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 75,
      caffeine_mg: 0,
    },
  },
  {
    id: "kaffir-lime-leaf",
    code: "ING-781",
    name: "Kaffir Lime Leaf",
    category: "spice",
    density: 0.4,
    fdc: "FDC 168462 · Lemon grass (citronella), raw (SR Legacy) as kaffir lime leaf proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Kaffir (makrut) lime leaf. Nutrition uses lemongrass/citrus-leaf proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 8.0,
      sugars_g: 0,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 80,
      iron_mg: 2.0,
      magnesium_mg: 30,
      potassium_mg: 200,
      zinc_mg: 0.5,
      vitamin_a_ug: 50,
      vitamin_c_mg: 30.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 50,
      vitamin_b12_ug: 0,
      folate_ug: 40,
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
  { ing: "turmeric-fresh", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "kaffir-lime-leaf", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand six hundred sixty-four builds.");
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
