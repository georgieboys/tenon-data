#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10365;
const baseBuilds = 10364;

const INGREDIENTS = [
  {
    id: "tofu-smoked",
    code: "ING-838",
    name: "Tofu Smoked",
    category: "other",
    density: 1.05,
    fdc: "FDC 172476 · Tofu, raw, firm, prepared with calcium sulfate (SR Legacy) as smoked tofu proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Smoked tofu. Contains soy. Nutrition uses firm tofu proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 150,
      protein_g: 17.0,
      fat_g: 9.0,
      saturated_fat_g: 1.4,
      carbohydrate_g: 3.0,
      sugars_g: 0.5,
      fibre_g: 2.0,
      sodium_mg: 400,
      calcium_mg: 600,
      iron_mg: 2.5,
      magnesium_mg: 50,
      potassium_mg: 200,
      zinc_mg: 1.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "tofu-extra-firm",
    code: "ING-839",
    name: "Tofu Extra Firm",
    category: "other",
    density: 1.08,
    fdc: "FDC 172476 · Tofu, raw, firm, prepared with calcium sulfate (SR Legacy) as extra-firm proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Extra-firm tofu. Contains soy. Nutrition uses firm tofu proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 160,
      protein_g: 19.0,
      fat_g: 9.5,
      saturated_fat_g: 1.5,
      carbohydrate_g: 2.5,
      sugars_g: 0.5,
      fibre_g: 2.5,
      sodium_mg: 15,
      calcium_mg: 700,
      iron_mg: 2.8,
      magnesium_mg: 60,
      potassium_mg: 240,
      zinc_mg: 1.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 0,
    },
  },
  {
    id: "tempeh-smoked",
    code: "ING-840",
    name: "Tempeh Smoked",
    category: "other",
    density: 1.0,
    fdc: "FDC 174272 · Tempeh (SR Legacy) as smoked tempeh proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Smoked tempeh. Contains soy. Nutrition uses tempeh proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 200,
      protein_g: 20.0,
      fat_g: 11.0,
      saturated_fat_g: 2.2,
      carbohydrate_g: 8.0,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 350,
      calcium_mg: 100,
      iron_mg: 2.5,
      magnesium_mg: 80,
      potassium_mg: 400,
      zinc_mg: 1.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.1,
      folate_ug: 24,
      caffeine_mg: 0,
    },
  },
  {
    id: "natto",
    code: "ING-841",
    name: "Natto",
    category: "other",
    density: 1.0,
    fdc: "FDC 172446 · Natto (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Natto. Contains soy. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 211,
      protein_g: 17.7,
      fat_g: 11.0,
      saturated_fat_g: 1.6,
      carbohydrate_g: 12.7,
      sugars_g: 4.9,
      fibre_g: 5.4,
      sodium_mg: 7,
      calcium_mg: 217,
      iron_mg: 8.6,
      magnesium_mg: 115,
      potassium_mg: 729,
      zinc_mg: 3.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 13.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 23.1,
      vitamin_b12_ug: 0,
      folate_ug: 8,
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
  { ing: "tofu-smoked", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "natto", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand four hundred fourteen builds.");
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
