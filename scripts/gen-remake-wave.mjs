#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10315;
const baseBuilds = 10314;

const INGREDIENTS = [
  {
    id: "lima-beans-cooked",
    code: "ING-834",
    name: "Lima Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 174252 · Lima beans, large, mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked lima beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 115,
      protein_g: 7.8,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 20.9,
      sugars_g: 2.9,
      fibre_g: 7.0,
      sodium_mg: 2,
      calcium_mg: 17,
      iron_mg: 2.4,
      magnesium_mg: 43,
      potassium_mg: 508,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 0,
      folate_ug: 83,
      caffeine_mg: 0,
    },
  },
  {
    id: "fava-beans-cooked",
    code: "ING-835",
    name: "Fava Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 175180 · Broadbeans (fava beans), mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked fava beans. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 110,
      protein_g: 7.6,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 19.7,
      sugars_g: 1.8,
      fibre_g: 5.4,
      sodium_mg: 5,
      calcium_mg: 36,
      iron_mg: 1.5,
      magnesium_mg: 43,
      potassium_mg: 268,
      zinc_mg: 1.0,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.9,
      vitamin_b12_ug: 0,
      folate_ug: 104,
      caffeine_mg: 0,
    },
  },
  {
    id: "butter-beans-cooked",
    code: "ING-836",
    name: "Butter Beans Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 174252 · Lima beans, large, mature seeds, cooked, boiled, without salt (SR Legacy) as butter beans proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked butter beans. Nutrition uses cooked lima beans proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 115,
      protein_g: 7.8,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 20.9,
      sugars_g: 2.9,
      fibre_g: 7.0,
      sodium_mg: 2,
      calcium_mg: 17,
      iron_mg: 2.4,
      magnesium_mg: 43,
      potassium_mg: 508,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 0,
      folate_ug: 83,
      caffeine_mg: 0,
    },
  },
  {
    id: "pigeon-peas-cooked",
    code: "ING-837",
    name: "Pigeon Peas Cooked",
    category: "other",
    density: 1.0,
    fdc: "FDC 172424 · Pigeon peas (red gram), mature seeds, cooked, boiled, without salt (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked pigeon peas. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 121,
      protein_g: 6.8,
      fat_g: 0.4,
      saturated_fat_g: 0.1,
      carbohydrate_g: 23.2,
      sugars_g: 0,
      fibre_g: 6.7,
      sodium_mg: 5,
      calcium_mg: 43,
      iron_mg: 1.1,
      magnesium_mg: 46,
      potassium_mg: 384,
      zinc_mg: 0.9,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 111,
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
  { ing: "lima-beans-cooked", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "pigeon-peas-cooked", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand three hundred sixty-four builds.");
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
