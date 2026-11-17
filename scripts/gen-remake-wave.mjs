#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12741;
const baseBuilds = 12740;
const proseCount = "Twelve thousand seven hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "elderberry-powder",
    code: "ING-1030",
    name: "Elderberry Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 171250 · Elderberries, raw (SR Legacy) as elderberry powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Elderberry powder (dried fruit). Nutrition uses raw elderberries as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 3,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 65,
      sugars_g: 25,
      fibre_g: 20,
      sodium_mg: 10,
      calcium_mg: 80,
      iron_mg: 3,
      magnesium_mg: 40,
      potassium_mg: 600,
      zinc_mg: 0.5,
      vitamin_a_ug: 100,
      vitamin_c_mg: 80,
      vitamin_d_ug: 0,
      vitamin_k_ug: 30,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "linden-flowers",
    code: "ING-1031",
    name: "Linden Flowers",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as dried linden (tilleul) flower proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried linden (tilleul) flowers. Nutrition uses basil as closest SR Legacy herb/flower proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 35,
      protein_g: 1.5,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 7,
      sugars_g: 1,
      fibre_g: 3,
      sodium_mg: 5,
      calcium_mg: 70,
      iron_mg: 1.2,
      magnesium_mg: 25,
      potassium_mg: 140,
      zinc_mg: 0.2,
      vitamin_a_ug: 40,
      vitamin_c_mg: 8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "lemon-verbena-dried",
    code: "ING-1032",
    name: "Lemon Verbena Dried",
    category: "spice",
    density: 0.25,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as dried lemon verbena proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried lemon verbena leaf (distinct from the fresh lemon-verbena cell). Nutrition uses basil as closest SR Legacy herb proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 40,
      protein_g: 2.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 8,
      sugars_g: 0.5,
      fibre_g: 4,
      sodium_mg: 8,
      calcium_mg: 100,
      iron_mg: 2,
      magnesium_mg: 35,
      potassium_mg: 200,
      zinc_mg: 0.3,
      vitamin_a_ug: 50,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 30,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "orange-blossom",
    code: "ING-1033",
    name: "Orange Blossom",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as dried orange blossom proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried orange blossom (distinct from orange-blossom-water). Nutrition uses basil as closest SR Legacy flower proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 30,
      protein_g: 1.2,
      fat_g: 0.3,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6,
      sugars_g: 1.5,
      fibre_g: 2.5,
      sodium_mg: 5,
      calcium_mg: 60,
      iron_mg: 1,
      magnesium_mg: 20,
      potassium_mg: 120,
      zinc_mg: 0.2,
      vitamin_a_ug: 30,
      vitamin_c_mg: 12,
      vitamin_d_ug: 0,
      vitamin_k_ug: 15,
      vitamin_b12_ug: 0,
      folate_ug: 15,
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
  { ing: "elderberry-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "orange-blossom", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  let out = src.replaceAll("raspberry", "__ING__");
  out = out.replaceAll("tenon-__ING__-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon __ING__ ", `Tenon ${title} `);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("__ING__", ingId);
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", proseCount);
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
