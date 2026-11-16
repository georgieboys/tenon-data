#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3001;
const baseBuilds = 3000;

const INGREDIENTS = [
  {
    id: "lotus-root",
    code: "ING-245",
    name: "Lotus Root",
    category: "other",
    density: 0.8,
    fdc: "FDC 168443 · Lotus root, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw lotus root. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 74,
      protein_g: 2.6,
      fat_g: 0.1,
      saturated_fat_g: 0.03,
      carbohydrate_g: 17.23,
      sugars_g: 0,
      fibre_g: 4.9,
      sodium_mg: 40,
      calcium_mg: 45,
      iron_mg: 1.16,
      magnesium_mg: 23,
      potassium_mg: 556,
      zinc_mg: 0.39,
      vitamin_a_ug: 0,
      vitamin_c_mg: 44.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 13,
      caffeine_mg: 0,
    },
  },
  {
    id: "bamboo-shoot",
    code: "ING-246",
    name: "Bamboo Shoot",
    category: "other",
    density: 0.6,
    fdc: "FDC 169211 · Bamboo shoots, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw bamboo shoots. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 27,
      protein_g: 2.6,
      fat_g: 0.3,
      saturated_fat_g: 0.07,
      carbohydrate_g: 5.2,
      sugars_g: 3.0,
      fibre_g: 2.2,
      sodium_mg: 4,
      calcium_mg: 13,
      iron_mg: 0.5,
      magnesium_mg: 3,
      potassium_mg: 533,
      zinc_mg: 1.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "water-chestnut",
    code: "ING-247",
    name: "Water Chestnut",
    category: "other",
    density: 0.8,
    fdc: "FDC 170402 · Waterchestnuts, chinese, (matai), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw water chestnuts. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 97,
      protein_g: 1.4,
      fat_g: 0.1,
      saturated_fat_g: 0.03,
      carbohydrate_g: 23.94,
      sugars_g: 4.8,
      fibre_g: 3.0,
      sodium_mg: 14,
      calcium_mg: 11,
      iron_mg: 0.06,
      magnesium_mg: 22,
      potassium_mg: 584,
      zinc_mg: 0.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 16,
      caffeine_mg: 0,
    },
  },
  {
    id: "sunchoke",
    code: "ING-248",
    name: "Sunchoke",
    category: "other",
    density: 0.75,
    fdc: "FDC 169236 · Jerusalem-artichokes, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sunchoke (Jerusalem artichoke). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 73,
      protein_g: 2.0,
      fat_g: 0.01,
      saturated_fat_g: 0,
      carbohydrate_g: 17.44,
      sugars_g: 9.6,
      fibre_g: 1.6,
      sodium_mg: 4,
      calcium_mg: 14,
      iron_mg: 3.4,
      magnesium_mg: 17,
      potassium_mg: 429,
      zinc_mg: 0.12,
      vitamin_a_ug: 1,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 13,
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
  { ing: "lotus-root", cell: "chia", template: "tenon-radicchio-chia-elevated", fromId: "radicchio" },
  { ing: "sunchoke", cell: "overnight-oats", template: "tenon-jicama-overnight-oats-elevated", fromId: "jicama" },
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
  out = out.replaceAll("Three thousand builds.", "Three thousand fifty builds.");
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
