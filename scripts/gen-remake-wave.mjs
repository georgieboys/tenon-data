#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7765;
const baseBuilds = 7764;

const INGREDIENTS = [
  {
    id: "black-garlic",
    code: "ING-630",
    name: "Black Garlic",
    category: "other",
    density: 0.9,
    fdc: "FDC 169230 · Garlic, raw (SR Legacy) as black garlic proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Black garlic (aged). Nutrition uses raw garlic proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 149,
      protein_g: 6.4,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 33.1,
      sugars_g: 1.0,
      fibre_g: 2.1,
      sodium_mg: 17,
      calcium_mg: 181,
      iron_mg: 1.7,
      magnesium_mg: 25,
      potassium_mg: 401,
      zinc_mg: 1.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 31.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.7,
      vitamin_b12_ug: 0,
      folate_ug: 3,
      caffeine_mg: 0,
    },
  },
  {
    id: "fermented-black-beans",
    code: "ING-631",
    name: "Fermented Black Beans",
    category: "other",
    density: 0.85,
    fdc: "FDC 175186 · Beans, black, mature seeds, cooked, boiled, without salt (SR Legacy) as fermented black beans proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Fermented black beans (douchi). Soy allergen when soy-based. Nutrition uses cooked black bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 132,
      protein_g: 8.9,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 23.7,
      sugars_g: 0.3,
      fibre_g: 8.7,
      sodium_mg: 2400,
      calcium_mg: 27,
      iron_mg: 2.1,
      magnesium_mg: 70,
      potassium_mg: 355,
      zinc_mg: 1.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.3,
      vitamin_b12_ug: 0,
      folate_ug: 149,
      caffeine_mg: 0,
    },
  },
  {
    id: "yuzu-kosho",
    code: "ING-632",
    name: "Yuzu Kosho",
    category: "other",
    density: 1.05,
    fdc: "FDC 167747 · Lemon juice, raw (SR Legacy) as yuzu kosho proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Yuzu kosho (citrus-chili paste). Nutrition uses lemon juice proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 22,
      protein_g: 0.4,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 6.9,
      sugars_g: 2.5,
      fibre_g: 0.3,
      sodium_mg: 1800,
      calcium_mg: 6,
      iron_mg: 0.1,
      magnesium_mg: 6,
      potassium_mg: 103,
      zinc_mg: 0.05,
      vitamin_a_ug: 0,
      vitamin_c_mg: 38.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "labneh",
    code: "ING-633",
    name: "Labneh",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170903 · Yogurt, Greek, plain, whole milk (SR Legacy) as labneh proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Labneh (strained yogurt cheese). Contains milk. Nutrition uses Greek yogurt whole-milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 97,
      protein_g: 9.0,
      fat_g: 5.0,
      saturated_fat_g: 3.2,
      carbohydrate_g: 3.6,
      sugars_g: 3.6,
      fibre_g: 0,
      sodium_mg: 350,
      calcium_mg: 100,
      iron_mg: 0.04,
      magnesium_mg: 11,
      potassium_mg: 141,
      zinc_mg: 0.52,
      vitamin_a_ug: 40,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.75,
      folate_ug: 7,
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
  { ing: "black-garlic", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "labneh", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Seven thousand eight hundred fourteen builds.");
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
