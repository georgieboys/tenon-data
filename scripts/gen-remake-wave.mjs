#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4451;
const baseBuilds = 4450;

const INGREDIENTS = [
  {
    id: "calamansi",
    code: "ING-361",
    name: "Calamansi",
    category: "fruit",
    density: 1.0,
    fdc: "FDC 167746 · Limes, raw (SR Legacy) as calamansi / Philippine lime proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh calamansi fruit. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 0.7,
      fat_g: 0.2,
      saturated_fat_g: 0.02,
      carbohydrate_g: 11.0,
      sugars_g: 1.7,
      fibre_g: 2.8,
      sodium_mg: 2,
      calcium_mg: 33,
      iron_mg: 0.6,
      magnesium_mg: 6,
      potassium_mg: 102,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 29.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.6,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "bergamot",
    code: "ING-362",
    name: "Bergamot",
    category: "fruit",
    density: 0.95,
    fdc: "FDC 167747 · Lemons, raw, without peel (SR Legacy) as bergamot citrus proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh bergamot citrus. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 29,
      protein_g: 1.1,
      fat_g: 0.3,
      saturated_fat_g: 0.04,
      carbohydrate_g: 9.0,
      sugars_g: 2.5,
      fibre_g: 2.8,
      sodium_mg: 2,
      calcium_mg: 26,
      iron_mg: 0.6,
      magnesium_mg: 8,
      potassium_mg: 138,
      zinc_mg: 0.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 53.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 11,
      caffeine_mg: 0,
    },
  },
  {
    id: "lemon-balm",
    code: "ING-363",
    name: "Lemon Balm",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as lemon balm leafy herb proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh lemon balm leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 2.0,
      fat_g: 0.4,
      saturated_fat_g: 0.04,
      carbohydrate_g: 4.0,
      sugars_g: 0.3,
      fibre_g: 2.0,
      sodium_mg: 5,
      calcium_mg: 100,
      iron_mg: 1.5,
      magnesium_mg: 35,
      potassium_mg: 250,
      zinc_mg: 0.4,
      vitamin_a_ug: 150,
      vitamin_c_mg: 20.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200.0,
      vitamin_b12_ug: 0,
      folate_ug: 45,
      caffeine_mg: 0,
    },
  },
  {
    id: "garlic-chive",
    code: "ING-364",
    name: "Garlic Chive",
    category: "vegetable",
    density: 0.4,
    fdc: "FDC 169994 · Chives, raw (SR Legacy) as garlic chive / Chinese chive proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh garlic chives (Chinese chives). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 3.3,
      fat_g: 0.7,
      saturated_fat_g: 0.15,
      carbohydrate_g: 4.4,
      sugars_g: 1.9,
      fibre_g: 2.5,
      sodium_mg: 3,
      calcium_mg: 92,
      iron_mg: 1.6,
      magnesium_mg: 42,
      potassium_mg: 296,
      zinc_mg: 0.6,
      vitamin_a_ug: 218,
      vitamin_c_mg: 58.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 212.0,
      vitamin_b12_ug: 0,
      folate_ug: 105,
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
  { ing: "calamansi", cell: "chia", template: "tenon-sansho-chia-elevated", fromId: "sansho" },
  { ing: "garlic-chive", cell: "overnight-oats", template: "tenon-kokum-overnight-oats-elevated", fromId: "kokum" },
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
  out = out.replaceAll("Four thousand four hundred fifty builds.", "Four thousand five hundred builds.");
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
