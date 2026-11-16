#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11091;
const baseBuilds = 11090;
const proseCount = "Eleven thousand one hundred forty builds.";

const INGREDIENTS = [
  {
    id: "furikake",
    code: "ING-898",
    name: "Furikake",
    category: "spice",
    density: 0.4,
    fdc: "FDC 168457 · Seaweed, laver, raw (SR Legacy) blended with sesame as nori–sesame furikake proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Nori–sesame furikake (no fish flakes in this open cell). Contains sesame. Nutrition blends laver + sesame proxies until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 12,
      fat_g: 15,
      saturated_fat_g: 2,
      carbohydrate_g: 30,
      sugars_g: 2,
      fibre_g: 8,
      sodium_mg: 800,
      calcium_mg: 200,
      iron_mg: 4,
      magnesium_mg: 100,
      potassium_mg: 500,
      zinc_mg: 2,
      vitamin_a_ug: 100,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "shichimi-togarashi",
    code: "ING-899",
    name: "Shichimi Togarashi",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170926 · Spices, pepper, red or cayenne (SR Legacy) as shichimi togarashi blend proxy. Proxy until the café SKU is labelled.",
    allergens: "[sesame]",
    note: "Shichimi togarashi. Contains sesame. Nutrition uses cayenne as heat proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 318,
      protein_g: 12,
      fat_g: 17.3,
      saturated_fat_g: 3.3,
      carbohydrate_g: 56.6,
      sugars_g: 10.3,
      fibre_g: 27.2,
      sodium_mg: 30,
      calcium_mg: 148,
      iron_mg: 7.8,
      magnesium_mg: 152,
      potassium_mg: 2014,
      zinc_mg: 2.5,
      vitamin_a_ug: 2081,
      vitamin_c_mg: 76.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 106,
      caffeine_mg: 0,
    },
  },
  {
    id: "tamarind-concentrate",
    code: "ING-900",
    name: "Tamarind Concentrate",
    category: "fruit",
    density: 1.2,
    fdc: "FDC 167787 · Tamarinds, raw (SR Legacy) as tamarind concentrate proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tamarind concentrate. Nutrition uses raw tamarind pulp as proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 239,
      protein_g: 2.8,
      fat_g: 0.6,
      saturated_fat_g: 0.3,
      carbohydrate_g: 62.5,
      sugars_g: 57.4,
      fibre_g: 5.1,
      sodium_mg: 28,
      calcium_mg: 74,
      iron_mg: 2.8,
      magnesium_mg: 92,
      potassium_mg: 628,
      zinc_mg: 0.1,
      vitamin_a_ug: 2,
      vitamin_c_mg: 3.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.8,
      vitamin_b12_ug: 0,
      folate_ug: 14,
      caffeine_mg: 0,
    },
  },
  {
    id: "palm-vinegar",
    code: "ING-901",
    name: "Palm Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as palm vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Palm vinegar. Nutrition uses distilled vinegar as proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 18,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.04,
      sugars_g: 0.04,
      fibre_g: 0,
      sodium_mg: 2,
      calcium_mg: 6,
      iron_mg: 0.03,
      magnesium_mg: 1,
      potassium_mg: 2,
      zinc_mg: 0.01,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
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
  { ing: "furikake", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "tamarind-concentrate", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
