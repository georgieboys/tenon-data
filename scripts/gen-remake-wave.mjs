#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10265;
const baseBuilds = 10264;

const INGREDIENTS = [
  {
    id: "tofu-firm",
    code: "ING-830",
    name: "Tofu Firm",
    category: "other",
    density: 1.05,
    fdc: "FDC 172476 · Tofu, raw, firm, prepared with calcium sulfate (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Firm tofu. Contains soy. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 144,
      protein_g: 17.3,
      fat_g: 8.7,
      saturated_fat_g: 1.3,
      carbohydrate_g: 2.8,
      sugars_g: 0.6,
      fibre_g: 2.3,
      sodium_mg: 14,
      calcium_mg: 683,
      iron_mg: 2.7,
      magnesium_mg: 58,
      potassium_mg: 237,
      zinc_mg: 1.6,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 29,
      caffeine_mg: 0,
    },
  },
  {
    id: "tofu-silken",
    code: "ING-831",
    name: "Tofu Silken",
    category: "other",
    density: 1.0,
    fdc: "FDC 174291 · Tofu, soft, prepared with calcium sulfate and magnesium chloride (nigari) (SR Legacy) as silken proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Silken tofu. Contains soy. Nutrition uses soft tofu proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 61,
      protein_g: 7.2,
      fat_g: 3.7,
      saturated_fat_g: 0.5,
      carbohydrate_g: 1.2,
      sugars_g: 0.7,
      fibre_g: 0.2,
      sodium_mg: 8,
      calcium_mg: 111,
      iron_mg: 1.1,
      magnesium_mg: 30,
      potassium_mg: 120,
      zinc_mg: 0.6,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.1,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 44,
      caffeine_mg: 0,
    },
  },
  {
    id: "tempeh-plain",
    code: "ING-832",
    name: "Tempeh Plain",
    category: "other",
    density: 1.0,
    fdc: "FDC 174272 · Tempeh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Plain tempeh. Contains soy. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 192,
      protein_g: 20.3,
      fat_g: 10.8,
      saturated_fat_g: 2.2,
      carbohydrate_g: 7.6,
      sugars_g: 0,
      fibre_g: 0,
      sodium_mg: 9,
      calcium_mg: 111,
      iron_mg: 2.7,
      magnesium_mg: 81,
      potassium_mg: 412,
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
    id: "seitan-plain",
    code: "ING-833",
    name: "Seitan Plain",
    category: "other",
    density: 1.05,
    fdc: "FDC 174272 · Seitan proxy via vital wheat gluten product. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Plain seitan. Contains gluten. Nutrition uses estimated vital-wheat-gluten cooked proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 140,
      protein_g: 25.0,
      fat_g: 2.0,
      saturated_fat_g: 0.3,
      carbohydrate_g: 5.0,
      sugars_g: 0,
      fibre_g: 1.0,
      sodium_mg: 300,
      calcium_mg: 20,
      iron_mg: 2.0,
      magnesium_mg: 30,
      potassium_mg: 100,
      zinc_mg: 1.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
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
  { ing: "tofu-firm", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "seitan-plain", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand three hundred fourteen builds.");
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
