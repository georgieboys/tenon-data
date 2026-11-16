#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9665;
const baseBuilds = 9664;

const INGREDIENTS = [
  {
    id: "vietnamese-mint",
    code: "ING-782",
    name: "Vietnamese Mint",
    category: "spice",
    density: 0.3,
    fdc: "FDC 173474 · Spearmint, fresh (SR Legacy) as Vietnamese mint proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Vietnamese mint (rau răm). Nutrition uses spearmint proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 44,
      protein_g: 3.3,
      fat_g: 0.7,
      saturated_fat_g: 0.2,
      carbohydrate_g: 8.4,
      sugars_g: 0,
      fibre_g: 6.8,
      sodium_mg: 30,
      calcium_mg: 199,
      iron_mg: 11.9,
      magnesium_mg: 63,
      potassium_mg: 458,
      zinc_mg: 1.1,
      vitamin_a_ug: 203,
      vitamin_c_mg: 13.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 105,
      caffeine_mg: 0,
    },
  },
  {
    id: "shiso-green",
    code: "ING-783",
    name: "Shiso Green",
    category: "spice",
    density: 0.3,
    fdc: "FDC 168462 · Basil, fresh (SR Legacy) as green shiso proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Green shiso (perilla). Nutrition uses fresh basil proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 37,
      protein_g: 3.2,
      fat_g: 0.6,
      saturated_fat_g: 0.1,
      carbohydrate_g: 7.0,
      sugars_g: 0.3,
      fibre_g: 3.0,
      sodium_mg: 4,
      calcium_mg: 177,
      iron_mg: 3.2,
      magnesium_mg: 64,
      potassium_mg: 295,
      zinc_mg: 0.8,
      vitamin_a_ug: 264,
      vitamin_c_mg: 18.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 415,
      vitamin_b12_ug: 0,
      folate_ug: 68,
      caffeine_mg: 0,
    },
  },
  {
    id: "wasabi-powder",
    code: "ING-784",
    name: "Wasabi Powder",
    category: "spice",
    density: 0.5,
    fdc: "FDC 170930 · Spices, horseradish (SR Legacy) as wasabi powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Wasabi powder. Nutrition uses horseradish proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 12.0,
      fat_g: 2.0,
      saturated_fat_g: 0.3,
      carbohydrate_g: 60.0,
      sugars_g: 5.0,
      fibre_g: 10.0,
      sodium_mg: 50,
      calcium_mg: 100,
      iron_mg: 3.0,
      magnesium_mg: 50,
      potassium_mg: 500,
      zinc_mg: 1.0,
      vitamin_a_ug: 5,
      vitamin_c_mg: 40.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "yuzu-juice",
    code: "ING-785",
    name: "Yuzu Juice",
    category: "fruit",
    density: 1.03,
    fdc: "FDC 167747 · Lemon juice, raw (SR Legacy) as yuzu juice proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Yuzu juice. Nutrition uses lemon juice proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 25,
      protein_g: 0.4,
      fat_g: 0.2,
      saturated_fat_g: 0,
      carbohydrate_g: 8.0,
      sugars_g: 2.5,
      fibre_g: 0.3,
      sodium_mg: 1,
      calcium_mg: 10,
      iron_mg: 0.1,
      magnesium_mg: 8,
      potassium_mg: 120,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 40.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 10,
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
  { ing: "vietnamese-mint", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "yuzu-juice", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand seven hundred fourteen builds.");
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
