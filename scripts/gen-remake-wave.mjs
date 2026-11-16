#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6051;
const baseBuilds = 6050;

const INGREDIENTS = [
  {
    id: "flax-butter",
    code: "ING-492",
    name: "Flax Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 169414 · Seeds, flaxseed (SR Legacy) as flax butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Plain flaxseed butter. Nutrition uses whole flaxseed proxy until a dedicated butter FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 534,
      protein_g: 18.3,
      fat_g: 42.2,
      saturated_fat_g: 3.7,
      carbohydrate_g: 28.9,
      sugars_g: 1.6,
      fibre_g: 27.3,
      sodium_mg: 30,
      calcium_mg: 255,
      iron_mg: 5.7,
      magnesium_mg: 392,
      potassium_mg: 813,
      zinc_mg: 4.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.3,
      vitamin_b12_ug: 0,
      folate_ug: 87,
      caffeine_mg: 0,
    },
  },
  {
    id: "chia-butter",
    code: "ING-493",
    name: "Chia Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170554 · Seeds, chia seeds, dried (SR Legacy) as chia butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Plain chia seed butter. Nutrition uses dried chia seed proxy until a dedicated butter FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 486,
      protein_g: 16.5,
      fat_g: 30.7,
      saturated_fat_g: 3.3,
      carbohydrate_g: 42.1,
      sugars_g: 0,
      fibre_g: 34.4,
      sodium_mg: 16,
      calcium_mg: 631,
      iron_mg: 7.7,
      magnesium_mg: 335,
      potassium_mg: 407,
      zinc_mg: 4.6,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "almond-butter-smooth",
    code: "ING-494",
    name: "Almond Butter Smooth",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 168588 · Nuts, almond butter, plain, without salt added (SR Legacy) as smooth almond butter SKU. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Smooth almond butter without salt. Distinct catalogue cell from almond-butter for SKU labelling. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 614,
      protein_g: 21.0,
      fat_g: 55.5,
      saturated_fat_g: 4.2,
      carbohydrate_g: 18.8,
      sugars_g: 6.3,
      fibre_g: 10.3,
      sodium_mg: 7,
      calcium_mg: 347,
      iron_mg: 3.5,
      magnesium_mg: 279,
      potassium_mg: 748,
      zinc_mg: 3.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 53,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-butter",
    code: "ING-495",
    name: "Coconut Butter",
    category: "nut_seed",
    density: 0.95,
    fdc: "FDC 170169 · Nuts, coconut meat, raw (SR Legacy) as coconut butter / manna proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Coconut butter (coconut manna). Nutrition uses raw coconut meat proxy until a dedicated butter FDC row or café CoA lands. Tree nut allergen where labelled. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 354,
      protein_g: 3.3,
      fat_g: 33.5,
      saturated_fat_g: 29.7,
      carbohydrate_g: 15.2,
      sugars_g: 6.2,
      fibre_g: 9.0,
      sodium_mg: 20,
      calcium_mg: 14,
      iron_mg: 2.4,
      magnesium_mg: 32,
      potassium_mg: 356,
      zinc_mg: 1.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 3.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0,
      folate_ug: 26,
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
  { ing: "flax-butter", cell: "chia", template: "tenon-macadamia-butter-chia-elevated", fromId: "macadamia-butter" },
  { ing: "coconut-butter", cell: "overnight-oats", template: "tenon-peanut-butter-smooth-overnight-oats-elevated", fromId: "peanut-butter-smooth" },
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
  out = out.replaceAll("Six thousand fifty builds.", "Six thousand one hundred builds.");
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
