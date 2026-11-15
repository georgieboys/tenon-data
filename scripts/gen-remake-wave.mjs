#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1001;
const baseBuilds = 1000;

const INGREDIENTS = [
  {
    id: "cucumber",
    code: "ING-079",
    name: "Cucumber",
    category: "other",
    density: 0.5,
    fdc: "FDC 168409 · Cucumber, with peel, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw cucumber. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 15,
      protein_g: 0.65,
      fat_g: 0.11,
      saturated_fat_g: 0.04,
      carbohydrate_g: 3.63,
      sugars_g: 1.67,
      fibre_g: 0.5,
      sodium_mg: 2,
      calcium_mg: 16,
      iron_mg: 0.28,
      magnesium_mg: 13,
      potassium_mg: 147,
      zinc_mg: 0.2,
      vitamin_a_ug: 5,
      vitamin_c_mg: 2.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 16.4,
      vitamin_b12_ug: 0,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "celery",
    code: "ING-080",
    name: "Celery",
    category: "other",
    density: 0.5,
    fdc: "FDC 169988 · Celery, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw celery. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 14,
      protein_g: 0.69,
      fat_g: 0.17,
      saturated_fat_g: 0.04,
      carbohydrate_g: 2.97,
      sugars_g: 1.34,
      fibre_g: 1.6,
      sodium_mg: 80,
      calcium_mg: 40,
      iron_mg: 0.2,
      magnesium_mg: 11,
      potassium_mg: 260,
      zinc_mg: 0.13,
      vitamin_a_ug: 22,
      vitamin_c_mg: 3.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 29.3,
      vitamin_b12_ug: 0,
      folate_ug: 36,
      caffeine_mg: 0,
    },
  },
  {
    id: "mushroom",
    code: "ING-081",
    name: "Mushroom",
    category: "other",
    density: 0.4,
    fdc: "FDC 169251 · Mushrooms, white, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw white mushroom. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 3.09,
      fat_g: 0.34,
      saturated_fat_g: 0.05,
      carbohydrate_g: 3.26,
      sugars_g: 1.98,
      fibre_g: 1,
      sodium_mg: 5,
      calcium_mg: 3,
      iron_mg: 0.5,
      magnesium_mg: 9,
      potassium_mg: 318,
      zinc_mg: 0.52,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2.1,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.04,
      folate_ug: 17,
      caffeine_mg: 0,
    },
  },
  {
    id: "sweet-potato",
    code: "ING-082",
    name: "Sweet Potato",
    category: "other",
    density: 0.7,
    fdc: "FDC 168482 · Sweet potato, raw, unprepared (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sweet potato. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 86,
      protein_g: 1.57,
      fat_g: 0.05,
      saturated_fat_g: 0.02,
      carbohydrate_g: 20.12,
      sugars_g: 4.18,
      fibre_g: 3,
      sodium_mg: 55,
      calcium_mg: 30,
      iron_mg: 0.61,
      magnesium_mg: 25,
      potassium_mg: 337,
      zinc_mg: 0.3,
      vitamin_a_ug: 709,
      vitamin_c_mg: 2.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.8,
      vitamin_b12_ug: 0,
      folate_ug: 11,
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
  { ing: "mushroom", cell: "chia", template: "tenon-kiwi-chia-elevated", fromId: "kiwi" },
  { ing: "sweet-potato", cell: "overnight-oats", template: "tenon-pomegranate-overnight-oats-elevated", fromId: "pomegranate" },
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
  out = out.replaceAll(`One thousand builds.`, "One thousand fifty builds.");
  return out;
}

let code = startCode;
for (const ing of INGREDIENTS) {
  writeFileSync(path.join(root, "ingredients", `${ing.id}.md`), ingredientMd(ing));
  console.log(`+ ingredient ${ing.id}`);
  for (const cell of CELLS) {
    const srcBuild = readFileSync(path.join(root, "builds", `tenon-raspberry-${cell}.md`), "utf8");
    const srcMenu = readFileSync(path.join(root, "menu", `tenon-raspberry-${cell}.md`), "utf8");
    writeFileSync(
      path.join(root, "builds", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcBuild, ing.id, ing.name, code, "build"),
    );
    writeFileSync(
      path.join(root, "menu", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcMenu, ing.id, ing.name, code, "menu"),
    );
    code += 1;
  }
}
for (const elev of ELEVATED) {
  const cellSlug = `${elev.cell}-elevated`;
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.template}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.template}.md`), "utf8");
  const meta = INGREDIENTS.find((i) => i.id === elev.ing);
  writeFileSync(
    path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcBuild, elev.fromId, elev.ing, meta.name, code, "build"),
  );
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, elev.fromId, elev.ing, meta.name, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}
console.log(
  `done through BLD-${code - 1}; expected builds ${baseBuilds + INGREDIENTS.length * CELLS.length + ELEVATED.length}`,
);
