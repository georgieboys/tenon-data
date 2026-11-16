#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11641;
const baseBuilds = 11640;
const proseCount = "Eleven thousand six hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "cultured-butter",
    code: "ING-942",
    name: "Cultured Butter",
    category: "fat",
    density: 0.91,
    fdc: "FDC 173410 · Butter, salted (SR Legacy) as cultured butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Cultured butter. Nutrition uses salted butter proxy until a café CoA lands. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 717,
      protein_g: 0.85,
      fat_g: 81.11,
      saturated_fat_g: 51.368,
      carbohydrate_g: 0.06,
      sugars_g: 0.06,
      fibre_g: 0,
      sodium_mg: 400,
      calcium_mg: 24,
      iron_mg: 0.02,
      magnesium_mg: 2,
      potassium_mg: 24,
      zinc_mg: 0.09,
      vitamin_a_ug: 684,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 7,
      vitamin_b12_ug: 0.17,
      folate_ug: 3,
      caffeine_mg: 0,
    },
  },
  {
    id: "brown-butter",
    code: "ING-943",
    name: "Brown Butter",
    category: "fat",
    density: 0.9,
    fdc: "FDC 173410 · Butter, salted (SR Legacy) as brown butter (beurre noisette) proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Brown butter (beurre noisette). Nutrition uses salted butter proxy until a café CoA lands. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 730,
      protein_g: 0.9,
      fat_g: 82.0,
      saturated_fat_g: 52.0,
      carbohydrate_g: 0.1,
      sugars_g: 0.1,
      fibre_g: 0,
      sodium_mg: 500,
      calcium_mg: 24,
      iron_mg: 0.02,
      magnesium_mg: 2,
      potassium_mg: 24,
      zinc_mg: 0.09,
      vitamin_a_ug: 650,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 7,
      vitamin_b12_ug: 0.17,
      folate_ug: 3,
      caffeine_mg: 0,
    },
  },
  {
    id: "kefir-grains",
    code: "ING-944",
    name: "Kefir Grains",
    category: "other",
    density: 1.0,
    fdc: "FDC 170903 · Yogurt, Greek, plain, nonfat (SR Legacy) as dairy kefir grains proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Dairy kefir grains (SCOBY). Nutrition uses nonfat Greek yogurt as a culture-carrier proxy until a café CoA lands. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 59,
      protein_g: 10.2,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 3.6,
      sugars_g: 3.2,
      fibre_g: 0,
      sodium_mg: 36,
      calcium_mg: 110,
      iron_mg: 0.04,
      magnesium_mg: 11,
      potassium_mg: 141,
      zinc_mg: 0.5,
      vitamin_a_ug: 4,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.75,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "tosazu",
    code: "ING-945",
    name: "Tosazu",
    category: "other",
    density: 1.02,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) blended with FDC 168456 kelp as tosazu (bonito–vinegar) proxy. Proxy until the café SKU is labelled.",
    allergens: "[fish]",
    note: "Tosazu (Tosa vinegar with katsuobushi / kelp). Nutrition uses vinegar+kelp proxy; contains fish from bonito. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: false },
    nutrition: {
      energy_kcal: 22,
      protein_g: 0.4,
      fat_g: 0.1,
      saturated_fat_g: 0.0,
      carbohydrate_g: 1.2,
      sugars_g: 0.5,
      fibre_g: 0.1,
      sodium_mg: 180,
      calcium_mg: 20,
      iron_mg: 0.3,
      magnesium_mg: 10,
      potassium_mg: 40,
      zinc_mg: 0.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0.2,
      folate_ug: 5,
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
  { ing: "brown-butter", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "cultured-butter", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
