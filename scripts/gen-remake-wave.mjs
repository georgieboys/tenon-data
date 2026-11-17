#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 14091;
const baseBuilds = 14090;
const proseCount = "Fourteen thousand one hundred forty builds.";

const INGREDIENTS = [
  {
    id: "chia-black-powder",
    code: "ING-1138",
    name: "Chia Black Powder",
    category: "nut_seed",
    density: 0.65,
    fdc: "FDC 170554 · Seeds, chia seeds, dried (SR Legacy) as black chia powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Black chia powder (distinct from chia-seed-powder and whole chia-black). Nutrition uses dried chia proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 486,
      protein_g: 16.5,
      fat_g: 30.7,
      saturated_fat_g: 3.3,
      carbohydrate_g: 42.1,
      sugars_g: 0,
      fibre_g: 34.4,
      sodium_mg: 16,
      calcium_mg: 631,
      iron_mg: 7.7,
      magnesium_mg: 335,
      potassium_mg: 407,
      zinc_mg: 4.6,
      vitamin_a_ug: 54,
      vitamin_c_mg: 1.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "lupin-powder",
    code: "ING-1139",
    name: "Lupin Powder",
    category: "nut_seed",
    density: 0.65,
    fdc: "FDC 172420 · Lupins, mature seeds, raw (SR Legacy) as lupin powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Lupin powder (distinct from whole lupin). Potential cross-reactivity with peanut — flag in café SOP when locked. Nutrition uses SR Legacy lupin until a café CoA lands.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 371,
      protein_g: 36.2,
      fat_g: 9.7,
      saturated_fat_g: 1.2,
      carbohydrate_g: 40.4,
      sugars_g: 0,
      fibre_g: 18.9,
      sodium_mg: 15,
      calcium_mg: 176,
      iron_mg: 4.4,
      magnesium_mg: 198,
      potassium_mg: 1013,
      zinc_mg: 4.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 355,
      caffeine_mg: 0,
    },
  },
  {
    id: "fava-powder",
    code: "ING-1140",
    name: "Fava Powder",
    category: "nut_seed",
    density: 0.7,
    fdc: "FDC 175192 · Broadbeans (fava beans), mature seeds, raw (SR Legacy) as fava powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fava powder (distinct from whole fava). Nutrition uses SR Legacy broadbean until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 341,
      protein_g: 26.1,
      fat_g: 1.5,
      saturated_fat_g: 0.3,
      carbohydrate_g: 58.3,
      sugars_g: 5.7,
      fibre_g: 25,
      sodium_mg: 13,
      calcium_mg: 103,
      iron_mg: 6.7,
      magnesium_mg: 192,
      potassium_mg: 1062,
      zinc_mg: 3.1,
      vitamin_a_ug: 3,
      vitamin_c_mg: 1.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 9,
      vitamin_b12_ug: 0,
      folate_ug: 423,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-eyed-pea-powder",
    code: "ING-1141",
    name: "Black Eyed Pea Powder",
    category: "nut_seed",
    density: 0.7,
    fdc: "FDC 175190 · Cowpeas, common (blackeyes, crowder, southern), mature seeds, raw (SR Legacy) as black-eyed pea powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Black-eyed pea powder (distinct from whole black-eyed pea). Nutrition uses SR Legacy cowpea until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 336,
      protein_g: 23.5,
      fat_g: 1.3,
      saturated_fat_g: 0.3,
      carbohydrate_g: 60,
      sugars_g: 6.9,
      fibre_g: 10.6,
      sodium_mg: 16,
      calcium_mg: 110,
      iron_mg: 8.3,
      magnesium_mg: 184,
      potassium_mg: 1112,
      zinc_mg: 3.4,
      vitamin_a_ug: 2,
      vitamin_c_mg: 1.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 633,
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
  { ing: "chia-black-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "lupin-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
