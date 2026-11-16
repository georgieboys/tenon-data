#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6351;
const baseBuilds = 6350;

const INGREDIENTS = [
  {
    id: "soy-sauce",
    code: "ING-516",
    name: "Soy Sauce",
    category: "other",
    density: 1.15,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy, gluten]",
    note: "Soy sauce (shoyu). Contains soy and gluten. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 53,
      protein_g: 8.14,
      fat_g: 0.04,
      saturated_fat_g: 0.01,
      carbohydrate_g: 4.93,
      sugars_g: 0.4,
      fibre_g: 0.8,
      sodium_mg: 5493,
      calcium_mg: 33,
      iron_mg: 1.45,
      magnesium_mg: 74,
      potassium_mg: 212,
      zinc_mg: 0.87,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "tamari",
    code: "ING-517",
    name: "Tamari",
    category: "other",
    density: 1.15,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as tamari proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Tamari. Contains soy. Nutrition uses shoyu proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 60,
      protein_g: 10.51,
      fat_g: 0.1,
      saturated_fat_g: 0.01,
      carbohydrate_g: 5.57,
      sugars_g: 0.5,
      fibre_g: 0.8,
      sodium_mg: 5586,
      calcium_mg: 20,
      iron_mg: 2.38,
      magnesium_mg: 40,
      potassium_mg: 212,
      zinc_mg: 0.33,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 18,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-aminos",
    code: "ING-518",
    name: "Coconut Aminos",
    category: "other",
    density: 1.12,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as coconut aminos proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Coconut aminos. Nutrition uses soy-sauce energy/sodium proxy shape until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 90,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 20,
      sugars_g: 18,
      fibre_g: 0,
      sodium_mg: 720,
      calcium_mg: 10,
      iron_mg: 0.2,
      magnesium_mg: 10,
      potassium_mg: 150,
      zinc_mg: 0.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "fish-sauce",
    code: "ING-519",
    name: "Fish Sauce",
    category: "other",
    density: 1.2,
    fdc: "FDC 174277 · Soy sauce made from soy and wheat (shoyu) (SR Legacy) as fish sauce proxy. Proxy until the café SKU is labelled.",
    allergens: "[fish]",
    note: "Fish sauce. Not plant-based. Nutrition uses soy-sauce proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 5.06,
      fat_g: 0.01,
      saturated_fat_g: 0,
      carbohydrate_g: 3.64,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 7851,
      calcium_mg: 43,
      iron_mg: 0.78,
      magnesium_mg: 175,
      potassium_mg: 288,
      zinc_mg: 0.2,
      vitamin_a_ug: 4,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.48,
      folate_ug: 12,
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
  { ing: "soy-sauce", cell: "chia", template: "tenon-sesame-oil-chia-elevated", fromId: "sesame-oil" },
  { ing: "fish-sauce", cell: "overnight-oats", template: "tenon-mct-oil-overnight-oats-elevated", fromId: "mct-oil" },
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
  out = out.replaceAll("Six thousand three hundred fifty builds.", "Six thousand four hundred builds.");
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
