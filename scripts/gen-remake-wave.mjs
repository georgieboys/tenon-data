#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7715;
const baseBuilds = 7714;

const INGREDIENTS = [
  {
    id: "einkorn-flour",
    code: "ING-626",
    name: "Einkorn Flour",
    category: "grain",
    density: 0.6,
    fdc: "FDC 168944 · Wheat flour, whole-grain (SR Legacy) as einkorn flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Einkorn flour. Gluten allergen. Nutrition uses whole-wheat flour proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 340,
      protein_g: 13.2,
      fat_g: 2.5,
      saturated_fat_g: 0.4,
      carbohydrate_g: 72.0,
      sugars_g: 0.4,
      fibre_g: 9.0,
      sodium_mg: 2,
      calcium_mg: 34,
      iron_mg: 3.6,
      magnesium_mg: 137,
      potassium_mg: 405,
      zinc_mg: 2.6,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 44,
      caffeine_mg: 0,
    },
  },
  {
    id: "fonio-flour",
    code: "ING-627",
    name: "Fonio Flour",
    category: "grain",
    density: 0.65,
    fdc: "FDC 169702 · Millet, raw (SR Legacy) as fonio flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fonio flour. Nutrition uses millet proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 378,
      protein_g: 11.0,
      fat_g: 4.2,
      saturated_fat_g: 0.7,
      carbohydrate_g: 73.0,
      sugars_g: 0,
      fibre_g: 8.5,
      sodium_mg: 5,
      calcium_mg: 8,
      iron_mg: 3.0,
      magnesium_mg: 114,
      potassium_mg: 195,
      zinc_mg: 1.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.9,
      vitamin_b12_ug: 0,
      folate_ug: 85,
      caffeine_mg: 0,
    },
  },
  {
    id: "triticale-flour",
    code: "ING-628",
    name: "Triticale Flour",
    category: "grain",
    density: 0.6,
    fdc: "FDC 168944 · Wheat flour, whole-grain (SR Legacy) as triticale flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Triticale flour. Gluten allergen. Nutrition uses whole-wheat flour proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 338,
      protein_g: 13.0,
      fat_g: 2.1,
      saturated_fat_g: 0.4,
      carbohydrate_g: 72.1,
      sugars_g: 1.0,
      fibre_g: 14.6,
      sodium_mg: 2,
      calcium_mg: 37,
      iron_mg: 2.6,
      magnesium_mg: 130,
      potassium_mg: 386,
      zinc_mg: 3.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 73,
      caffeine_mg: 0,
    },
  },
  {
    id: "dragonfruit",
    code: "ING-629",
    name: "Dragonfruit",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 2346408 · Dragon fruit, white-fleshed, raw (Foundation) as dragonfruit proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dragonfruit (pitaya). Nutrition uses white-fleshed dragon fruit proxy until café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 57,
      protein_g: 1.2,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 13.0,
      sugars_g: 7.7,
      fibre_g: 3.0,
      sodium_mg: 4,
      calcium_mg: 18,
      iron_mg: 0.7,
      magnesium_mg: 24,
      potassium_mg: 202,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 8,
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
  { ing: "einkorn-flour", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "dragonfruit", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  const diet = ing.diet || { plant_based: true, vegetarian: true };
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
  plant_based: ${diet.plant_based}
  vegetarian: ${diet.vegetarian}
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Seven thousand seven hundred sixty-four builds.");
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
