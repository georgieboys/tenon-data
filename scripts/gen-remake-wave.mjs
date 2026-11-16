#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11591;
const baseBuilds = 11590;
const proseCount = "Eleven thousand six hundred forty builds.";

const INGREDIENTS = [
  {
    id: "brown-rice-koji",
    code: "ING-938",
    name: "Brown Rice Koji",
    category: "grain",
    density: 0.55,
    fdc: "FDC 169703 · Rice, brown, long-grain, raw (SR Legacy) as brown rice koji proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Brown rice koji (Aspergillus oryzae on brown rice). Nutrition uses brown rice proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 370,
      protein_g: 7.5,
      fat_g: 2.9,
      saturated_fat_g: 0.6,
      carbohydrate_g: 77.2,
      sugars_g: 0.7,
      fibre_g: 3.5,
      sodium_mg: 5,
      calcium_mg: 23,
      iron_mg: 1.5,
      magnesium_mg: 143,
      potassium_mg: 223,
      zinc_mg: 2.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "nori-paste",
    code: "ING-939",
    name: "Nori Paste",
    category: "other",
    density: 1.05,
    fdc: "FDC 168457 · Seaweed, laver, raw (SR Legacy) as nori paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Nori paste. Nutrition uses laver proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 35,
      protein_g: 5.8,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 5.1,
      sugars_g: 0.5,
      fibre_g: 0.3,
      sodium_mg: 48,
      calcium_mg: 70,
      iron_mg: 1.8,
      magnesium_mg: 2,
      potassium_mg: 356,
      zinc_mg: 1.1,
      vitamin_a_ug: 260,
      vitamin_c_mg: 39.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.0,
      vitamin_b12_ug: 0,
      folate_ug: 146,
      caffeine_mg: 0,
    },
  },
  {
    id: "kelp-noodles",
    code: "ING-940",
    name: "Kelp Noodles",
    category: "other",
    density: 0.95,
    fdc: "FDC 168456 · Seaweed, kelp, raw (SR Legacy) as kelp noodles proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Kelp noodles (sodium alginate / kelp extract strands). Nutrition uses kelp proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 43,
      protein_g: 1.7,
      fat_g: 0.6,
      saturated_fat_g: 0.2,
      carbohydrate_g: 9.6,
      sugars_g: 0.6,
      fibre_g: 1.3,
      sodium_mg: 233,
      calcium_mg: 168,
      iron_mg: 2.9,
      magnesium_mg: 121,
      potassium_mg: 89,
      zinc_mg: 1.2,
      vitamin_a_ug: 6,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 66,
      vitamin_b12_ug: 0,
      folate_ug: 180,
      caffeine_mg: 0,
    },
  },
  {
    id: "sea-moss-gel",
    code: "ING-941",
    name: "Sea Moss Gel",
    category: "other",
    density: 1.0,
    fdc: "FDC 168454 · Seaweed, irishmoss, raw (SR Legacy) diluted as sea moss gel proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sea moss gel (hydrated irish moss). Nutrition uses diluted irishmoss proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 10,
      protein_g: 0.3,
      fat_g: 0.0,
      saturated_fat_g: 0.0,
      carbohydrate_g: 2.5,
      sugars_g: 0.1,
      fibre_g: 0.3,
      sodium_mg: 15,
      calcium_mg: 15,
      iron_mg: 1.8,
      magnesium_mg: 30,
      potassium_mg: 12,
      zinc_mg: 0.4,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 36,
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
  { ing: "sea-moss-gel", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "brown-rice-koji", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
