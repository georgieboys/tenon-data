#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6551;
const baseBuilds = 6550;

const INGREDIENTS = [
  {
    id: "chili-crisp",
    code: "ING-532",
    name: "Chili Crisp",
    category: "other",
    density: 1.05,
    fdc: "FDC 171413 · Oil, olive, salad or cooking (SR Legacy) as chili crisp oil-fraction proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Chili crisp. Nutrition uses oil-fraction proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 540,
      protein_g: 2.0,
      fat_g: 52.0,
      saturated_fat_g: 8.0,
      carbohydrate_g: 12.0,
      sugars_g: 2.0,
      fibre_g: 3.0,
      sodium_mg: 1200,
      calcium_mg: 30,
      iron_mg: 1.5,
      magnesium_mg: 20,
      potassium_mg: 200,
      zinc_mg: 0.3,
      vitamin_a_ug: 100,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "worcestershire",
    code: "ING-533",
    name: "Worcestershire Sauce",
    category: "other",
    density: 1.15,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as Worcestershire proxy. Proxy until the café SKU is labelled.",
    allergens: "[fish, soy, gluten]",
    note: "Worcestershire sauce. Contains fish, soy and gluten. Nutrition uses soy-sauce proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 78,
      protein_g: 0.8,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 19.0,
      sugars_g: 15.0,
      fibre_g: 0,
      sodium_mg: 980,
      calcium_mg: 40,
      iron_mg: 1.0,
      magnesium_mg: 10,
      potassium_mg: 150,
      zinc_mg: 0.1,
      vitamin_a_ug: 5,
      vitamin_c_mg: 2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.1,
      folate_ug: 5,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: false },
  },
  {
    id: "ponzu",
    code: "ING-534",
    name: "Ponzu",
    category: "other",
    density: 1.1,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as ponzu proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy, gluten]",
    note: "Ponzu. Contains soy and gluten. Nutrition uses soy-sauce proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 3.0,
      fat_g: 0.05,
      saturated_fat_g: 0,
      carbohydrate_g: 6.0,
      sugars_g: 4.0,
      fibre_g: 0.2,
      sodium_mg: 2800,
      calcium_mg: 20,
      iron_mg: 0.8,
      magnesium_mg: 30,
      potassium_mg: 150,
      zinc_mg: 0.3,
      vitamin_a_ug: 2,
      vitamin_c_mg: 8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "oyster-sauce",
    code: "ING-535",
    name: "Oyster Sauce",
    category: "other",
    density: 1.25,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as oyster sauce proxy. Proxy until the café SKU is labelled.",
    allergens: "[mollusc, soy, gluten]",
    note: "Oyster sauce. Contains mollusc, soy and gluten. Nutrition uses soy-sauce proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 51,
      protein_g: 1.4,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 11.0,
      sugars_g: 6.0,
      fibre_g: 0.3,
      sodium_mg: 2730,
      calcium_mg: 20,
      iron_mg: 0.5,
      magnesium_mg: 15,
      potassium_mg: 100,
      zinc_mg: 0.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.5,
      folate_ug: 5,
      caffeine_mg: 0,
    },
    diet: { plant_based: false, vegetarian: false },
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
  { ing: "chili-crisp", cell: "chia", template: "tenon-ketchup-chia-elevated", fromId: "ketchup" },
  { ing: "oyster-sauce", cell: "overnight-oats", template: "tenon-harissa-overnight-oats-elevated", fromId: "harissa" },
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
  out = out.replaceAll("Six thousand five hundred fifty builds.", "Six thousand six hundred builds.");
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
