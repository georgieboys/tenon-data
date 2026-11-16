#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8515;
const baseBuilds = 8514;

const INGREDIENTS = [
  {
    id: "hazelnut-butter-roasted",
    code: "ING-690",
    name: "Hazelnut Butter Roasted",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 170567 · Nuts, hazelnuts or filberts (SR Legacy) as roasted hazelnut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Roasted hazelnut butter. Tree nut allergen. Nutrition uses hazelnut proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 628,
      protein_g: 15.0,
      fat_g: 60.8,
      saturated_fat_g: 4.5,
      carbohydrate_g: 16.7,
      sugars_g: 4.3,
      fibre_g: 9.7,
      sodium_mg: 0,
      calcium_mg: 114,
      iron_mg: 4.7,
      magnesium_mg: 163,
      potassium_mg: 680,
      zinc_mg: 2.5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 14.2,
      vitamin_b12_ug: 0,
      folate_ug: 113,
      caffeine_mg: 0,
    },
  },
  {
    id: "macadamia-butter-roasted",
    code: "ING-691",
    name: "Macadamia Butter Roasted",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 170178 · Nuts, macadamia nuts, raw (SR Legacy) as roasted macadamia butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Roasted macadamia butter. Tree nut allergen. Nutrition uses macadamia proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 718,
      protein_g: 7.9,
      fat_g: 75.8,
      saturated_fat_g: 12.1,
      carbohydrate_g: 13.8,
      sugars_g: 4.6,
      fibre_g: 8.6,
      sodium_mg: 5,
      calcium_mg: 85,
      iron_mg: 3.7,
      magnesium_mg: 130,
      potassium_mg: 368,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 11,
      caffeine_mg: 0,
    },
  },
  {
    id: "pecan-butter-roasted",
    code: "ING-692",
    name: "Pecan Butter Roasted",
    category: "nut_seed",
    density: 1.05,
    fdc: "FDC 170182 · Nuts, pecans (SR Legacy) as roasted pecan butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Roasted pecan butter. Tree nut allergen. Nutrition uses pecan proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 691,
      protein_g: 9.2,
      fat_g: 72.0,
      saturated_fat_g: 6.2,
      carbohydrate_g: 13.9,
      sugars_g: 4.0,
      fibre_g: 9.6,
      sodium_mg: 0,
      calcium_mg: 70,
      iron_mg: 2.5,
      magnesium_mg: 121,
      potassium_mg: 410,
      zinc_mg: 4.5,
      vitamin_a_ug: 3,
      vitamin_c_mg: 1.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 22,
      caffeine_mg: 0,
    },
  },
  {
    id: "chestnut-butter",
    code: "ING-693",
    name: "Chestnut Butter",
    category: "nut_seed",
    density: 1.1,
    fdc: "FDC 170168 · Nuts, chestnuts, european, roasted (SR Legacy) as chestnut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Chestnut butter. Tree nut allergen. Nutrition uses roasted chestnut proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 245,
      protein_g: 3.2,
      fat_g: 2.2,
      saturated_fat_g: 0.4,
      carbohydrate_g: 53.0,
      sugars_g: 10.6,
      fibre_g: 5.1,
      sodium_mg: 2,
      calcium_mg: 29,
      iron_mg: 0.9,
      magnesium_mg: 33,
      potassium_mg: 592,
      zinc_mg: 0.6,
      vitamin_a_ug: 1,
      vitamin_c_mg: 26.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 70,
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
  { ing: "hazelnut-butter-roasted", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "chestnut-butter", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand five hundred sixty-four builds.");
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
