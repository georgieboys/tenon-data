#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5701;
const baseBuilds = 5700;

const INGREDIENTS = [
  {
    id: "einkorn",
    code: "ING-464",
    name: "Einkorn",
    category: "grain",
    density: 0.75,
    fdc: "FDC 168894 · Spelt, uncooked (SR Legacy) as einkorn proxy pending dedicated FDC row. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Whole einkorn wheat berries. Nutrition uses spelt proxy until a dedicated FDC row or café CoA lands. Contains gluten. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 338,
      protein_g: 14.6,
      fat_g: 2.4,
      saturated_fat_g: 0.4,
      carbohydrate_g: 70.2,
      sugars_g: 0,
      fibre_g: 10.7,
      sodium_mg: 8,
      calcium_mg: 27,
      iron_mg: 4.4,
      magnesium_mg: 136,
      potassium_mg: 388,
      zinc_mg: 3.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 45,
      caffeine_mg: 0,
    },
  },
  {
    id: "emmer",
    code: "ING-465",
    name: "Emmer",
    category: "grain",
    density: 0.75,
    fdc: "FDC 168894 · Spelt, uncooked (SR Legacy) as emmer / farro dicoccum proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Whole emmer (farro dicoccum) berries. Distinct from farro SKU when labelled separately. Contains gluten. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 338,
      protein_g: 14.6,
      fat_g: 2.4,
      saturated_fat_g: 0.4,
      carbohydrate_g: 70.2,
      sugars_g: 0,
      fibre_g: 10.7,
      sodium_mg: 8,
      calcium_mg: 27,
      iron_mg: 4.4,
      magnesium_mg: 136,
      potassium_mg: 388,
      zinc_mg: 3.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 45,
      caffeine_mg: 0,
    },
  },
  {
    id: "wild-rice",
    code: "ING-466",
    name: "Wild Rice",
    category: "grain",
    density: 0.75,
    fdc: "FDC 169726 · Wild rice, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried wild rice. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 357,
      protein_g: 14.7,
      fat_g: 1.1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 74.9,
      sugars_g: 2.5,
      fibre_g: 6.2,
      sodium_mg: 7,
      calcium_mg: 21,
      iron_mg: 2.0,
      magnesium_mg: 177,
      potassium_mg: 427,
      zinc_mg: 6.0,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 95,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-rice",
    code: "ING-467",
    name: "Black Rice",
    category: "grain",
    density: 0.75,
    fdc: "FDC 169703 · Rice, brown, long-grain, raw (SR Legacy) as black / forbidden rice proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried black (forbidden) rice. Nutrition uses brown-rice proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 370,
      protein_g: 7.9,
      fat_g: 2.9,
      saturated_fat_g: 0.6,
      carbohydrate_g: 77.2,
      sugars_g: 0.7,
      fibre_g: 3.5,
      sodium_mg: 7,
      calcium_mg: 23,
      iron_mg: 1.5,
      magnesium_mg: 143,
      potassium_mg: 223,
      zinc_mg: 2.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
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
  { ing: "einkorn", cell: "chia", template: "tenon-rye-flake-chia-elevated", fromId: "rye-flake" },
  { ing: "black-rice", cell: "overnight-oats", template: "tenon-triticale-overnight-oats-elevated", fromId: "triticale" },
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
  out = out.replaceAll("Five thousand seven hundred builds.", "Five thousand seven hundred fifty builds.");
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
