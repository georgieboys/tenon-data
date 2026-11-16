#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5051;
const baseBuilds = 5050;

const INGREDIENTS = [
  {
    id: "great-northern",
    code: "ING-412",
    name: "Great Northern",
    category: "other",
    density: 0.75,
    fdc: "FDC 175200 · Beans, great northern, mature seeds, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried great northern beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 339,
      protein_g: 21.9,
      fat_g: 1.1,
      saturated_fat_g: 0.3,
      carbohydrate_g: 62.4,
      sugars_g: 2.2,
      fibre_g: 20.2,
      sodium_mg: 14,
      calcium_mg: 175,
      iron_mg: 5.5,
      magnesium_mg: 159,
      potassium_mg: 1387,
      zinc_mg: 2.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6.0,
      vitamin_b12_ug: 0,
      folate_ug: 482,
      caffeine_mg: 0,
    },
  },
  {
    id: "lima-bean",
    code: "ING-413",
    name: "Lima Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 174253 · Lima beans, large, mature seeds, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried lima beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 338,
      protein_g: 21.5,
      fat_g: 0.7,
      saturated_fat_g: 0.2,
      carbohydrate_g: 63.4,
      sugars_g: 8.5,
      fibre_g: 19.0,
      sodium_mg: 18,
      calcium_mg: 81,
      iron_mg: 7.5,
      magnesium_mg: 224,
      potassium_mg: 1724,
      zinc_mg: 2.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6.0,
      vitamin_b12_ug: 0,
      folate_ug: 395,
      caffeine_mg: 0,
    },
  },
  {
    id: "urad-dal",
    code: "ING-414",
    name: "Urad Dal",
    category: "other",
    density: 0.8,
    fdc: "FDC 172421 · Mungo beans, mature seeds, raw (SR Legacy) as urad dal proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Split black gram (urad dal). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 341,
      protein_g: 25.2,
      fat_g: 1.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 59.0,
      sugars_g: 0,
      fibre_g: 18.3,
      sodium_mg: 38,
      calcium_mg: 138,
      iron_mg: 7.6,
      magnesium_mg: 189,
      potassium_mg: 983,
      zinc_mg: 3.4,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 216,
      caffeine_mg: 0,
    },
  },
  {
    id: "chana-dal",
    code: "ING-415",
    name: "Chana Dal",
    category: "other",
    density: 0.8,
    fdc: "FDC 173757 · Chickpeas (garbanzo beans, bengal gram), mature seeds, raw (SR Legacy) as chana dal proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Split chickpeas (chana dal). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 364,
      protein_g: 19.3,
      fat_g: 6.0,
      saturated_fat_g: 0.6,
      carbohydrate_g: 61.0,
      sugars_g: 10.7,
      fibre_g: 17.4,
      sodium_mg: 24,
      calcium_mg: 105,
      iron_mg: 6.2,
      magnesium_mg: 115,
      potassium_mg: 875,
      zinc_mg: 3.4,
      vitamin_a_ug: 3,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 9.0,
      vitamin_b12_ug: 0,
      folate_ug: 557,
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
  { ing: "urad-dal", cell: "chia", template: "tenon-lupin-chia-elevated", fromId: "lupin" },
  { ing: "chana-dal", cell: "overnight-oats", template: "tenon-fava-overnight-oats-elevated", fromId: "fava" },
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
  out = out.replaceAll("Five thousand fifty builds.", "Five thousand one hundred builds.");
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
