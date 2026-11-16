#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3401;
const baseBuilds = 3400;

const INGREDIENTS = [
  {
    id: "broccoli-rabe",
    code: "ING-277",
    name: "Broccoli Rabe",
    category: "other",
    density: 0.5,
    fdc: "FDC 170381 · Broccoli raab, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw broccoli rabe (rapini). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 3.2,
      fat_g: 0.5,
      saturated_fat_g: 0.05,
      carbohydrate_g: 2.9,
      sugars_g: 0.4,
      fibre_g: 2.7,
      sodium_mg: 33,
      calcium_mg: 108,
      iron_mg: 2.1,
      magnesium_mg: 22,
      potassium_mg: 196,
      zinc_mg: 0.77,
      vitamin_a_ug: 131,
      vitamin_c_mg: 20.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 224.0,
      vitamin_b12_ug: 0,
      folate_ug: 83,
      caffeine_mg: 0,
    },
  },
  {
    id: "water-spinach",
    code: "ING-278",
    name: "Water Spinach",
    category: "other",
    density: 0.4,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as water spinach / kangkong proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw water spinach (kang kong). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 19,
      protein_g: 2.6,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 3.1,
      sugars_g: 0.4,
      fibre_g: 2.1,
      sodium_mg: 65,
      calcium_mg: 77,
      iron_mg: 1.7,
      magnesium_mg: 71,
      potassium_mg: 312,
      zinc_mg: 0.5,
      vitamin_a_ug: 315,
      vitamin_c_mg: 55.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 250.0,
      vitamin_b12_ug: 0,
      folate_ug: 57,
      caffeine_mg: 0,
    },
  },
  {
    id: "gooseberry",
    code: "ING-279",
    name: "Gooseberry",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 173030 · Gooseberries, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw gooseberry. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 44,
      protein_g: 0.88,
      fat_g: 0.58,
      saturated_fat_g: 0.04,
      carbohydrate_g: 10.18,
      sugars_g: 8.0,
      fibre_g: 4.3,
      sodium_mg: 1,
      calcium_mg: 25,
      iron_mg: 0.31,
      magnesium_mg: 10,
      potassium_mg: 198,
      zinc_mg: 0.12,
      vitamin_a_ug: 15,
      vitamin_c_mg: 27.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 7.8,
      vitamin_b12_ug: 0,
      folate_ug: 6,
      caffeine_mg: 0,
    },
  },
  {
    id: "passionfruit",
    code: "ING-280",
    name: "Passionfruit",
    category: "fruit",
    density: 0.9,
    fdc: "FDC 169108 · Passion-fruit, (granadilla), purple, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw passionfruit pulp. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 97,
      protein_g: 2.2,
      fat_g: 0.7,
      saturated_fat_g: 0.06,
      carbohydrate_g: 23.38,
      sugars_g: 11.2,
      fibre_g: 10.4,
      sodium_mg: 28,
      calcium_mg: 12,
      iron_mg: 1.6,
      magnesium_mg: 29,
      potassium_mg: 348,
      zinc_mg: 0.1,
      vitamin_a_ug: 64,
      vitamin_c_mg: 30.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.7,
      vitamin_b12_ug: 0,
      folate_ug: 14,
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
  { ing: "gooseberry", cell: "chia", template: "tenon-broccolini-chia-elevated", fromId: "broccolini" },
  { ing: "passionfruit", cell: "overnight-oats", template: "tenon-tomatillo-overnight-oats-elevated", fromId: "tomatillo" },
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
  out = out.replaceAll("Three thousand four hundred builds.", "Three thousand four hundred fifty builds.");
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
