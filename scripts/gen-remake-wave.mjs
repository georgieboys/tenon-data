#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3201;
const baseBuilds = 3200;

const INGREDIENTS = [
  {
    id: "borage",
    code: "ING-261",
    name: "Borage",
    category: "other",
    density: 0.3,
    fdc: "FDC 170928 · Borage proxy via chervil dried scaled for fresh leaf estimate. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh borage leaf estimate. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 21,
      protein_g: 1.8,
      fat_g: 0.7,
      saturated_fat_g: 0.17,
      carbohydrate_g: 3.06,
      sugars_g: 0.5,
      fibre_g: 1.0,
      sodium_mg: 80,
      calcium_mg: 93,
      iron_mg: 3.3,
      magnesium_mg: 52,
      potassium_mg: 470,
      zinc_mg: 0.2,
      vitamin_a_ug: 210,
      vitamin_c_mg: 35.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 250,
      vitamin_b12_ug: 0,
      folate_ug: 13,
      caffeine_mg: 0,
    },
  },
  {
    id: "lovage",
    code: "ING-262",
    name: "Lovage",
    category: "other",
    density: 0.3,
    fdc: "FDC 170917 · Lovage proxy via celery seed scaled for leaf. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh lovage leaf estimate. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 42,
      protein_g: 3.5,
      fat_g: 0.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 7.6,
      sugars_g: 1.5,
      fibre_g: 3.5,
      sodium_mg: 34,
      calcium_mg: 140,
      iron_mg: 2.5,
      magnesium_mg: 45,
      potassium_mg: 390,
      zinc_mg: 0.4,
      vitamin_a_ug: 180,
      vitamin_c_mg: 40.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "bitter-melon",
    code: "ING-263",
    name: "Bitter Melon",
    category: "other",
    density: 0.6,
    fdc: "FDC 168393 · Balsam-pear (bitter gourd), leafy tips, raw scaled via fruit estimate FDC 168392. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw bitter melon fruit. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 17,
      protein_g: 1.0,
      fat_g: 0.17,
      saturated_fat_g: 0.01,
      carbohydrate_g: 3.7,
      sugars_g: 0,
      fibre_g: 2.8,
      sodium_mg: 5,
      calcium_mg: 19,
      iron_mg: 0.43,
      magnesium_mg: 17,
      potassium_mg: 296,
      zinc_mg: 0.8,
      vitamin_a_ug: 24,
      vitamin_c_mg: 84.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.8,
      vitamin_b12_ug: 0,
      folate_ug: 72,
      caffeine_mg: 0,
    },
  },
  {
    id: "winter-melon",
    code: "ING-264",
    name: "Winter Melon",
    category: "other",
    density: 0.7,
    fdc: "FDC 169226 · Winter melon proxy via wax gourd estimate. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw winter melon. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 13,
      protein_g: 0.4,
      fat_g: 0.2,
      saturated_fat_g: 0.02,
      carbohydrate_g: 3.0,
      sugars_g: 0,
      fibre_g: 2.9,
      sodium_mg: 111,
      calcium_mg: 19,
      iron_mg: 0.4,
      magnesium_mg: 10,
      potassium_mg: 6,
      zinc_mg: 0.61,
      vitamin_a_ug: 0,
      vitamin_c_mg: 13.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 5,
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
  { ing: "borage", cell: "chia", template: "tenon-napa-cabbage-chia-elevated", fromId: "napa-cabbage" },
  { ing: "winter-melon", cell: "overnight-oats", template: "tenon-chervil-overnight-oats-elevated", fromId: "chervil" },
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
  out = out.replaceAll("Three thousand two hundred builds.", "Three thousand two hundred fifty builds.");
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
