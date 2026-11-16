#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4051;
const baseBuilds = 4050;

const INGREDIENTS = [
  {
    id: "long-pepper",
    code: "ING-329",
    name: "Long Pepper",
    category: "spice",
    density: 0.55,
    fdc: "FDC 170931 · Spices, pepper, black (SR Legacy) as long pepper (pippali) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried long pepper. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 251,
      protein_g: 10.4,
      fat_g: 3.3,
      saturated_fat_g: 1.4,
      carbohydrate_g: 63.9,
      sugars_g: 0.6,
      fibre_g: 25.3,
      sodium_mg: 20,
      calcium_mg: 443,
      iron_mg: 9.7,
      magnesium_mg: 171,
      potassium_mg: 1329,
      zinc_mg: 1.2,
      vitamin_a_ug: 27,
      vitamin_c_mg: 21.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 163.7,
      vitamin_b12_ug: 0,
      folate_ug: 17,
      caffeine_mg: 0,
    },
  },
  {
    id: "cubeb",
    code: "ING-330",
    name: "Cubeb",
    category: "spice",
    density: 0.55,
    fdc: "FDC 170931 · Spices, pepper, black (SR Legacy) as cubeb pepper proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried cubeb berries. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 255,
      protein_g: 10.0,
      fat_g: 3.5,
      saturated_fat_g: 1.5,
      carbohydrate_g: 64.0,
      sugars_g: 0.5,
      fibre_g: 25.0,
      sodium_mg: 20,
      calcium_mg: 400,
      iron_mg: 9.0,
      magnesium_mg: 160,
      potassium_mg: 1200,
      zinc_mg: 1.1,
      vitamin_a_ug: 20,
      vitamin_c_mg: 15.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 150.0,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "pandan-leaf",
    code: "ING-331",
    name: "Pandan Leaf",
    category: "spice",
    density: 0.35,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as pandan leaf aromatic green proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh pandan leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 2.0,
      fat_g: 0.3,
      saturated_fat_g: 0.05,
      carbohydrate_g: 7.0,
      sugars_g: 0.5,
      fibre_g: 2.5,
      sodium_mg: 10,
      calcium_mg: 50,
      iron_mg: 1.0,
      magnesium_mg: 30,
      potassium_mg: 250,
      zinc_mg: 0.2,
      vitamin_a_ug: 100,
      vitamin_c_mg: 10.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 50.0,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 0,
    },
  },
  {
    id: "thai-basil",
    code: "ING-332",
    name: "Thai Basil",
    category: "spice",
    density: 0.35,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as Thai basil proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh Thai basil. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 3.15,
      fat_g: 0.64,
      saturated_fat_g: 0.04,
      carbohydrate_g: 2.65,
      sugars_g: 0.3,
      fibre_g: 1.6,
      sodium_mg: 4,
      calcium_mg: 177,
      iron_mg: 3.17,
      magnesium_mg: 64,
      potassium_mg: 295,
      zinc_mg: 0.81,
      vitamin_a_ug: 264,
      vitamin_c_mg: 18.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 414.8,
      vitamin_b12_ug: 0,
      folate_ug: 68,
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
  { ing: "pandan-leaf", cell: "chia", template: "tenon-fenugreek-leaf-chia-elevated", fromId: "fenugreek-leaf" },
  { ing: "thai-basil", cell: "overnight-oats", template: "tenon-fingerroot-overnight-oats-elevated", fromId: "fingerroot" },
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
  out = out.replaceAll("Four thousand fifty builds.", "Four thousand one hundred builds.");
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
