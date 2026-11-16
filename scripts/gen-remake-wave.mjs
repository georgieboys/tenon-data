#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3801;
const baseBuilds = 3800;

const INGREDIENTS = [
  {
    id: "jabuticaba",
    code: "ING-309",
    name: "Jabuticaba",
    category: "fruit",
    density: 0.8,
    fdc: "FDC 171686 · Jabuticaba proxy via dark berry / acerola-family fruit values (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw jabuticaba. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 58,
      protein_g: 0.5,
      fat_g: 0.1,
      saturated_fat_g: 0.02,
      carbohydrate_g: 15.0,
      sugars_g: 12.0,
      fibre_g: 2.0,
      sodium_mg: 1,
      calcium_mg: 10,
      iron_mg: 0.3,
      magnesium_mg: 10,
      potassium_mg: 150,
      zinc_mg: 0.1,
      vitamin_a_ug: 5,
      vitamin_c_mg: 20.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "camu-camu",
    code: "ING-310",
    name: "Camu Camu",
    category: "fruit",
    density: 0.8,
    fdc: "FDC 171686 · Camu camu proxy via acerola (SR Legacy) for vitamin C–dense Amazon berry. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw camu camu. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 30,
      protein_g: 0.5,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 7.0,
      sugars_g: 3.0,
      fibre_g: 1.0,
      sodium_mg: 5,
      calcium_mg: 15,
      iron_mg: 0.3,
      magnesium_mg: 12,
      potassium_mg: 100,
      zinc_mg: 0.1,
      vitamin_a_ug: 20,
      vitamin_c_mg: 2000.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "sugar-apple",
    code: "ING-311",
    name: "Sugar Apple",
    category: "fruit",
    density: 0.85,
    fdc: "FDC 167762 · Sugar-apples, (sweetsop), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sugar apple (sweetsop). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 94,
      protein_g: 2.06,
      fat_g: 0.29,
      saturated_fat_g: 0.05,
      carbohydrate_g: 23.64,
      sugars_g: 18.0,
      fibre_g: 4.4,
      sodium_mg: 9,
      calcium_mg: 24,
      iron_mg: 0.6,
      magnesium_mg: 21,
      potassium_mg: 247,
      zinc_mg: 0.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 36.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "atemoya",
    code: "ING-312",
    name: "Atemoya",
    category: "fruit",
    density: 0.85,
    fdc: "FDC 171687 · Atemoya proxy via cherimoya (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw atemoya. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 80,
      protein_g: 1.5,
      fat_g: 0.5,
      saturated_fat_g: 0.15,
      carbohydrate_g: 19.0,
      sugars_g: 14.0,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 12,
      iron_mg: 0.3,
      magnesium_mg: 18,
      potassium_mg: 280,
      zinc_mg: 0.15,
      vitamin_a_ug: 0,
      vitamin_c_mg: 15.0,
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
  { ing: "camu-camu", cell: "chia", template: "tenon-acerola-chia-elevated", fromId: "acerola" },
  { ing: "atemoya", cell: "overnight-oats", template: "tenon-samphire-overnight-oats-elevated", fromId: "samphire" },
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
  out = out.replaceAll("Three thousand eight hundred builds.", "Three thousand eight hundred fifty builds.");
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
