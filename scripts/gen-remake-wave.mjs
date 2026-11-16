#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4701;
const baseBuilds = 4700;

const INGREDIENTS = [
  {
    id: "mirin",
    code: "ING-381",
    name: "Mirin",
    category: "sweetener",
    density: 1.05,
    fdc: "FDC 168833 · Sugars, brown (SR Legacy) as mirin sweet rice wine carbohydrate proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Culinary mirin (sweet rice wine seasoning). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 140,
      protein_g: 0.3,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 30.0,
      sugars_g: 25.0,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 5,
      potassium_mg: 20,
      zinc_mg: 0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "shaoxing",
    code: "ING-382",
    name: "Shaoxing",
    category: "other",
    density: 1.0,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as Shaoxing cooking wine acid/alcohol proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Shaoxing cooking wine. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 80,
      protein_g: 0.5,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 5.0,
      sugars_g: 2.0,
      fibre_g: 0,
      sodium_mg: 400,
      calcium_mg: 10,
      iron_mg: 0.2,
      magnesium_mg: 5,
      potassium_mg: 30,
      zinc_mg: 0.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "gochujang",
    code: "ING-383",
    name: "Gochujang",
    category: "spice",
    density: 1.15,
    fdc: "FDC 170066 · Peppers, hot chili, red, raw (SR Legacy) as gochujang chili paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Korean fermented chili paste (gochujang). Contains soy. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 220,
      protein_g: 5.0,
      fat_g: 2.0,
      saturated_fat_g: 0.3,
      carbohydrate_g: 45.0,
      sugars_g: 25.0,
      fibre_g: 5.0,
      sodium_mg: 2000,
      calcium_mg: 40,
      iron_mg: 2.0,
      magnesium_mg: 40,
      potassium_mg: 400,
      zinc_mg: 0.5,
      vitamin_a_ug: 200,
      vitamin_c_mg: 10.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 15.0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "doenjang",
    code: "ING-384",
    name: "Doenjang",
    category: "other",
    density: 1.1,
    fdc: "FDC 172442 · Miso (SR Legacy) as doenjang soybean paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Korean fermented soybean paste (doenjang). Contains soy. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 200,
      protein_g: 12.0,
      fat_g: 6.0,
      saturated_fat_g: 1.0,
      carbohydrate_g: 25.0,
      sugars_g: 5.0,
      fibre_g: 5.0,
      sodium_mg: 3500,
      calcium_mg: 70,
      iron_mg: 2.5,
      magnesium_mg: 50,
      potassium_mg: 300,
      zinc_mg: 1.5,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0.1,
      folate_ug: 30,
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
  { ing: "gochujang", cell: "chia", template: "tenon-sambal-chia-elevated", fromId: "sambal" },
  { ing: "mirin", cell: "overnight-oats", template: "tenon-rice-vinegar-overnight-oats-elevated", fromId: "rice-vinegar" },
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
  out = out.replaceAll("Four thousand seven hundred builds.", "Four thousand seven hundred fifty builds.");
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
