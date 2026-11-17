#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12541;
const baseBuilds = 12540;
const proseCount = "Twelve thousand five hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "rooibos-powder",
    code: "ING-1014",
    name: "Rooibos Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as rooibos powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Rooibos powder (Aspalathus). Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Caffeine-free. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 10,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 50,
      sugars_g: 1,
      fibre_g: 30,
      sodium_mg: 10,
      calcium_mg: 150,
      iron_mg: 8,
      magnesium_mg: 100,
      potassium_mg: 800,
      zinc_mg: 1,
      vitamin_a_ug: 50,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "hibiscus-powder",
    code: "ING-1015",
    name: "Hibiscus Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as hibiscus powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hibiscus powder (Roselle). Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 250,
      protein_g: 8,
      fat_g: 1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 55,
      sugars_g: 5,
      fibre_g: 25,
      sodium_mg: 15,
      calcium_mg: 200,
      iron_mg: 10,
      magnesium_mg: 80,
      potassium_mg: 900,
      zinc_mg: 1,
      vitamin_a_ug: 100,
      vitamin_c_mg: 40,
      vitamin_d_ug: 0,
      vitamin_k_ug: 30,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "chamomile-flowers",
    code: "ING-1016",
    name: "Chamomile Flowers",
    category: "spice",
    density: 0.2,
    fdc: "Branded dried chamomile flowers (no dedicated SR Legacy row). Herbal tea proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried chamomile flowers. Nutrition is a branded herbal proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 200,
      protein_g: 5,
      fat_g: 1,
      saturated_fat_g: 0.2,
      carbohydrate_g: 45,
      sugars_g: 2,
      fibre_g: 20,
      sodium_mg: 20,
      calcium_mg: 150,
      iron_mg: 5,
      magnesium_mg: 50,
      potassium_mg: 400,
      zinc_mg: 0.5,
      vitamin_a_ug: 50,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 0,
    },
  },
  {
    id: "peppermint-leaf",
    code: "ING-1017",
    name: "Peppermint Leaf",
    category: "spice",
    density: 0.25,
    fdc: "FDC 173474 · Spearmint, fresh (SR Legacy) as dried peppermint leaf proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried peppermint leaf. Nutrition uses spearmint as closest SR Legacy mint proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 70,
      protein_g: 3.8,
      fat_g: 0.9,
      saturated_fat_g: 0.2,
      carbohydrate_g: 15,
      sugars_g: 0.5,
      fibre_g: 8,
      sodium_mg: 30,
      calcium_mg: 200,
      iron_mg: 5,
      magnesium_mg: 60,
      potassium_mg: 500,
      zinc_mg: 0.8,
      vitamin_a_ug: 200,
      vitamin_c_mg: 30,
      vitamin_d_ug: 0,
      vitamin_k_ug: 100,
      vitamin_b12_ug: 0,
      folate_ug: 100,
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
  { ing: "hibiscus-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "peppermint-leaf", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
