#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12591;
const baseBuilds = 12590;
const proseCount = "Twelve thousand six hundred forty builds.";

const INGREDIENTS = [
  {
    id: "lemongrass-dried",
    code: "ING-1018",
    name: "Lemongrass Dried",
    category: "spice",
    density: 0.35,
    fdc: "FDC 168277 · Lemon grass (citronella), raw (SR Legacy) as dried lemongrass proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried lemongrass stalk. Nutrition uses raw lemongrass as closest SR Legacy proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 120,
      protein_g: 2.2,
      fat_g: 0.6,
      saturated_fat_g: 0.15,
      carbohydrate_g: 28,
      sugars_g: 0,
      fibre_g: 4,
      sodium_mg: 8,
      calcium_mg: 80,
      iron_mg: 9,
      magnesium_mg: 70,
      potassium_mg: 800,
      zinc_mg: 2.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 70,
      caffeine_mg: 0,
    },
  },
  {
    id: "lavender-flowers",
    code: "ING-1019",
    name: "Lavender Flowers",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as culinary lavender flower proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Culinary dried lavender flowers. Nutrition uses basil as closest SR Legacy herb proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 50,
      protein_g: 2,
      fat_g: 0.7,
      saturated_fat_g: 0.1,
      carbohydrate_g: 10,
      sugars_g: 0.5,
      fibre_g: 5,
      sodium_mg: 5,
      calcium_mg: 150,
      iron_mg: 2,
      magnesium_mg: 40,
      potassium_mg: 200,
      zinc_mg: 0.4,
      vitamin_a_ug: 50,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 30,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "earl-grey-tea",
    code: "ING-1020",
    name: "Earl Grey Tea",
    category: "spice",
    density: 0.35,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as Earl Grey dry-leaf powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Earl Grey (bergamot-scented black tea) dry leaf. Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 18,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 40,
      sugars_g: 0,
      fibre_g: 28,
      sodium_mg: 10,
      calcium_mg: 250,
      iron_mg: 10,
      magnesium_mg: 120,
      potassium_mg: 1500,
      zinc_mg: 1.5,
      vitamin_a_ug: 200,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 100,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 1600,
    },
  },
  {
    id: "yerba-mate-powder",
    code: "ING-1021",
    name: "Yerba Mate Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as yerba mate powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Yerba mate powder (Ilex paraguariensis). Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Naturally caffeinated. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 290,
      protein_g: 16,
      fat_g: 2.5,
      saturated_fat_g: 0.4,
      carbohydrate_g: 45,
      sugars_g: 1,
      fibre_g: 25,
      sodium_mg: 15,
      calcium_mg: 280,
      iron_mg: 9,
      magnesium_mg: 140,
      potassium_mg: 1600,
      zinc_mg: 1.8,
      vitamin_a_ug: 300,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 1400,
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
  { ing: "lavender-flowers", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "yerba-mate-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
