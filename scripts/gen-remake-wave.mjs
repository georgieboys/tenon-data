#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4651;
const baseBuilds = 4650;

const INGREDIENTS = [
  {
    id: "sambal",
    code: "ING-377",
    name: "Sambal",
    category: "spice",
    density: 1.1,
    fdc: "FDC 170066 · Peppers, hot chili, red, raw (SR Legacy) as sambal chili paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked sambal chili paste. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 80,
      protein_g: 2.0,
      fat_g: 4.0,
      saturated_fat_g: 0.5,
      carbohydrate_g: 10.0,
      sugars_g: 5.0,
      fibre_g: 3.0,
      sodium_mg: 800,
      calcium_mg: 20,
      iron_mg: 1.0,
      magnesium_mg: 20,
      potassium_mg: 300,
      zinc_mg: 0.3,
      vitamin_a_ug: 100,
      vitamin_c_mg: 40.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 10.0,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "candlenut",
    code: "ING-378",
    name: "Candlenut",
    category: "nut_seed",
    density: 0.6,
    fdc: "FDC 170567 · Nuts, macadamia nuts, raw (SR Legacy) as candlenut / kemiri proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Raw candlenut (kemiri). Must be cooked before eating. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 720,
      protein_g: 8.0,
      fat_g: 75.0,
      saturated_fat_g: 12.0,
      carbohydrate_g: 14.0,
      sugars_g: 4.0,
      fibre_g: 8.0,
      sodium_mg: 5,
      calcium_mg: 85,
      iron_mg: 3.7,
      magnesium_mg: 130,
      potassium_mg: 370,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-vinegar",
    code: "ING-379",
    name: "Black Vinegar",
    category: "other",
    density: 1.05,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as Chinese black vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Chinese black vinegar (Chinkiang-style). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 0.5,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 5.0,
      sugars_g: 2.0,
      fibre_g: 0,
      sodium_mg: 20,
      calcium_mg: 10,
      iron_mg: 0.5,
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
    id: "rice-vinegar",
    code: "ING-380",
    name: "Rice Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as rice vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Seasoned or plain rice vinegar. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 18,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.5,
      sugars_g: 0.4,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 6,
      iron_mg: 0.1,
      magnesium_mg: 2,
      potassium_mg: 10,
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
  { ing: "sambal", cell: "chia", template: "tenon-jasmine-chia-elevated", fromId: "jasmine" },
  { ing: "rice-vinegar", cell: "overnight-oats", template: "tenon-gula-melaka-overnight-oats-elevated", fromId: "gula-melaka" },
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
  out = out.replaceAll("Four thousand six hundred fifty builds.", "Four thousand seven hundred builds.");
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
