#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6901;
const baseBuilds = 6900;

const INGREDIENTS = [
  {
    id: "flax-milk",
    code: "ING-560",
    name: "Flax Milk",
    category: "plant_milk",
    density: 1.02,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy) as flax milk proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Flax milk. Nutrition uses almond milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 0,
      fat_g: 2.5,
      saturated_fat_g: 0.2,
      carbohydrate_g: 1.0,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 70,
      calcium_mg: 180,
      iron_mg: 0.2,
      magnesium_mg: 5,
      potassium_mg: 20,
      zinc_mg: 0.1,
      vitamin_a_ug: 60,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "hazelnut-milk",
    code: "ING-561",
    name: "Hazelnut Milk",
    category: "plant_milk",
    density: 1.02,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy) as hazelnut milk proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Hazelnut milk. Contains tree nut. Nutrition uses almond milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 29,
      protein_g: 0.4,
      fat_g: 2.8,
      saturated_fat_g: 0.2,
      carbohydrate_g: 0.8,
      sugars_g: 0.5,
      fibre_g: 0.2,
      sodium_mg: 55,
      calcium_mg: 150,
      iron_mg: 0.3,
      magnesium_mg: 12,
      potassium_mg: 60,
      zinc_mg: 0.2,
      vitamin_a_ug: 60,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 3,
      caffeine_mg: 0,
    },
  },
  {
    id: "pistachio-milk",
    code: "ING-562",
    name: "Pistachio Milk",
    category: "plant_milk",
    density: 1.02,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy) as pistachio milk proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Pistachio milk. Contains tree nut. Nutrition uses almond milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.0,
      fat_g: 3.0,
      saturated_fat_g: 0.4,
      carbohydrate_g: 2.0,
      sugars_g: 1.0,
      fibre_g: 0.5,
      sodium_mg: 65,
      calcium_mg: 160,
      iron_mg: 0.4,
      magnesium_mg: 15,
      potassium_mg: 80,
      zinc_mg: 0.2,
      vitamin_a_ug: 60,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "sesame-milk",
    code: "ING-563",
    name: "Sesame Milk",
    category: "plant_milk",
    density: 1.02,
    fdc: "FDC 174832 · Beverages, almond milk, unsweetened, shelf stable (SR Legacy) as sesame milk proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Sesame milk. Contains sesame. Nutrition uses almond milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 50,
      protein_g: 1.5,
      fat_g: 4.0,
      saturated_fat_g: 0.6,
      carbohydrate_g: 2.0,
      sugars_g: 0.5,
      fibre_g: 0.5,
      sodium_mg: 50,
      calcium_mg: 200,
      iron_mg: 1.0,
      magnesium_mg: 40,
      potassium_mg: 90,
      zinc_mg: 0.5,
      vitamin_a_ug: 60,
      vitamin_c_mg: 0,
      vitamin_d_ug: 1.0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
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
  { ing: "flax-milk", cell: "chia", template: "tenon-hemp-milk-chia-elevated", fromId: "hemp-milk" },
  { ing: "sesame-milk", cell: "overnight-oats", template: "tenon-pea-milk-overnight-oats-elevated", fromId: "pea-milk" },
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
  out = out.replaceAll("Six thousand nine hundred builds.", "Six thousand nine hundred fifty builds.");
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
