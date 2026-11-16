#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4151;
const baseBuilds = 4150;

const INGREDIENTS = [
  {
    id: "shiso",
    code: "ING-337",
    name: "Shiso",
    category: "spice",
    density: 0.35,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as shiso / perilla proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh green shiso (perilla). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 37,
      protein_g: 3.5,
      fat_g: 0.6,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.0,
      sugars_g: 0.4,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 230,
      iron_mg: 3.5,
      magnesium_mg: 70,
      potassium_mg: 450,
      zinc_mg: 0.9,
      vitamin_a_ug: 280,
      vitamin_c_mg: 20.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 420.0,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "lemon-basil",
    code: "ING-338",
    name: "Lemon Basil",
    category: "spice",
    density: 0.35,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as lemon basil proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh lemon basil. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 3.2,
      fat_g: 0.6,
      saturated_fat_g: 0.04,
      carbohydrate_g: 2.7,
      sugars_g: 0.3,
      fibre_g: 1.6,
      sodium_mg: 4,
      calcium_mg: 177,
      iron_mg: 3.2,
      magnesium_mg: 64,
      potassium_mg: 295,
      zinc_mg: 0.8,
      vitamin_a_ug: 264,
      vitamin_c_mg: 18.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 415.0,
      vitamin_b12_ug: 0,
      folate_ug: 68,
      caffeine_mg: 0,
    },
  },
  {
    id: "torch-ginger",
    code: "ING-339",
    name: "Torch Ginger",
    category: "spice",
    density: 0.7,
    fdc: "FDC 169231 · Ginger root, raw (SR Legacy) as torch ginger / bunga kantan proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh torch ginger flower bud (bunga kantan). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.5,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 9.0,
      sugars_g: 1.5,
      fibre_g: 2.0,
      sodium_mg: 10,
      calcium_mg: 25,
      iron_mg: 0.8,
      magnesium_mg: 30,
      potassium_mg: 280,
      zinc_mg: 0.3,
      vitamin_a_ug: 20,
      vitamin_c_mg: 12.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.0,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "betel-leaf",
    code: "ING-340",
    name: "Betel Leaf",
    category: "spice",
    density: 0.35,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as betel leaf / daun sirih leafy proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh betel leaf (daun sirih). Culinary leaf only — not a stimulant claim. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 44,
      protein_g: 3.0,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 8.0,
      sugars_g: 0.5,
      fibre_g: 2.5,
      sodium_mg: 15,
      calcium_mg: 200,
      iron_mg: 3.0,
      magnesium_mg: 50,
      potassium_mg: 400,
      zinc_mg: 0.5,
      vitamin_a_ug: 200,
      vitamin_c_mg: 15.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 250.0,
      vitamin_b12_ug: 0,
      folate_ug: 60,
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
  { ing: "shiso", cell: "chia", template: "tenon-holy-basil-chia-elevated", fromId: "holy-basil" },
  { ing: "betel-leaf", cell: "overnight-oats", template: "tenon-laksa-leaf-overnight-oats-elevated", fromId: "laksa-leaf" },
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
  plant_based: true
  vegetarian: true
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
  out = out.replaceAll("Four thousand one hundred fifty builds.", "Four thousand two hundred builds.");
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
