#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2551;
const baseBuilds = 2550;

const INGREDIENTS = [
  {
    id: "artichoke",
    code: "ING-206",
    name: "Artichoke",
    category: "other",
    density: 0.7,
    fdc: "FDC 169205 · Artichokes, (globe or french), raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw globe artichoke. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 47,
      protein_g: 3.27,
      fat_g: 0.15,
      saturated_fat_g: 0.04,
      carbohydrate_g: 10.51,
      sugars_g: 0.99,
      fibre_g: 5.4,
      sodium_mg: 94,
      calcium_mg: 44,
      iron_mg: 1.28,
      magnesium_mg: 60,
      potassium_mg: 370,
      zinc_mg: 0.49,
      vitamin_a_ug: 1,
      vitamin_c_mg: 11.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 14.8,
      vitamin_b12_ug: 0,
      folate_ug: 68,
      caffeine_mg: 0,
    },
  },
  {
    id: "pea",
    code: "ING-207",
    name: "Green Pea",
    category: "other",
    density: 0.75,
    fdc: "FDC 170419 · Peas, green, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw green peas. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 81,
      protein_g: 5.42,
      fat_g: 0.4,
      saturated_fat_g: 0.07,
      carbohydrate_g: 14.45,
      sugars_g: 5.67,
      fibre_g: 5.7,
      sodium_mg: 5,
      calcium_mg: 25,
      iron_mg: 1.47,
      magnesium_mg: 33,
      potassium_mg: 244,
      zinc_mg: 1.24,
      vitamin_a_ug: 38,
      vitamin_c_mg: 40,
      vitamin_d_ug: 0,
      vitamin_k_ug: 24.8,
      vitamin_b12_ug: 0,
      folate_ug: 65,
      caffeine_mg: 0,
    },
  },
  {
    id: "green-bean",
    code: "ING-208",
    name: "Green Bean",
    category: "other",
    density: 0.6,
    fdc: "FDC 169961 · Beans, snap, green, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw green beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 31,
      protein_g: 1.83,
      fat_g: 0.22,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.97,
      sugars_g: 3.26,
      fibre_g: 2.7,
      sodium_mg: 6,
      calcium_mg: 37,
      iron_mg: 1.03,
      magnesium_mg: 25,
      potassium_mg: 211,
      zinc_mg: 0.24,
      vitamin_a_ug: 35,
      vitamin_c_mg: 12.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 43,
      vitamin_b12_ug: 0,
      folate_ug: 33,
      caffeine_mg: 0,
    },
  },
  {
    id: "snap-pea",
    code: "ING-209",
    name: "Snap Pea",
    category: "other",
    density: 0.65,
    fdc: "FDC 170010 · Peas, edible-podded, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw snap peas. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 42,
      protein_g: 2.8,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 7.55,
      sugars_g: 4.0,
      fibre_g: 2.6,
      sodium_mg: 4,
      calcium_mg: 43,
      iron_mg: 2.08,
      magnesium_mg: 24,
      potassium_mg: 200,
      zinc_mg: 0.27,
      vitamin_a_ug: 54,
      vitamin_c_mg: 60,
      vitamin_d_ug: 0,
      vitamin_k_ug: 25,
      vitamin_b12_ug: 0,
      folate_ug: 42,
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
  { ing: "artichoke", cell: "chia", template: "tenon-sorrel-chia-elevated", fromId: "sorrel" },
  { ing: "snap-pea", cell: "overnight-oats", template: "tenon-okra-overnight-oats-elevated", fromId: "okra" },
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
  out = out.replaceAll("Two thousand five hundred fifty builds.", "Two thousand six hundred builds.");
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
