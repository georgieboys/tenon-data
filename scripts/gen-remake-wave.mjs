#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9415;
const baseBuilds = 9414;

const INGREDIENTS = [
  {
    id: "blueberry-wild",
    code: "ING-762",
    name: "Blueberry Wild",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 171711 · Blueberries, wild, frozen (SR Legacy) as wild blueberry proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Wild blueberries. Nutrition uses wild frozen blueberry proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 57,
      protein_g: 0.7,
      fat_g: 0.3,
      saturated_fat_g: 0,
      carbohydrate_g: 14.5,
      sugars_g: 9.0,
      fibre_g: 4.5,
      sodium_mg: 1,
      calcium_mg: 18,
      iron_mg: 0.4,
      magnesium_mg: 6,
      potassium_mg: 70,
      zinc_mg: 0.2,
      vitamin_a_ug: 3,
      vitamin_c_mg: 2.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 16,
      vitamin_b12_ug: 0,
      folate_ug: 6,
      caffeine_mg: 0,
    },
  },
  {
    id: "blackberry-frozen",
    code: "ING-763",
    name: "Blackberry Frozen",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 173946 · Blackberries, frozen, unsweetened (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Frozen blackberries. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 64,
      protein_g: 1.2,
      fat_g: 0.4,
      saturated_fat_g: 0,
      carbohydrate_g: 15.7,
      sugars_g: 10.0,
      fibre_g: 5.0,
      sodium_mg: 1,
      calcium_mg: 29,
      iron_mg: 0.8,
      magnesium_mg: 22,
      potassium_mg: 140,
      zinc_mg: 0.5,
      vitamin_a_ug: 11,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 34,
      caffeine_mg: 0,
    },
  },
  {
    id: "strawberry-freeze-dried",
    code: "ING-764",
    name: "Strawberry Freeze Dried",
    category: "fruit",
    density: 0.2,
    fdc: "FDC 167762 · Strawberries, raw (SR Legacy) as freeze-dried strawberry proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Freeze-dried strawberries. Nutrition uses raw strawberry proxy scaled for lower moisture until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 350,
      protein_g: 7.0,
      fat_g: 2.0,
      saturated_fat_g: 0.1,
      carbohydrate_g: 80.0,
      sugars_g: 55.0,
      fibre_g: 15.0,
      sodium_mg: 10,
      calcium_mg: 100,
      iron_mg: 3.0,
      magnesium_mg: 80,
      potassium_mg: 1200,
      zinc_mg: 1.0,
      vitamin_a_ug: 10,
      vitamin_c_mg: 400,
      vitamin_d_ug: 0,
      vitamin_k_ug: 15,
      vitamin_b12_ug: 0,
      folate_ug: 80,
      caffeine_mg: 0,
    },
  },
  {
    id: "freeze-dried-raspberry",
    code: "ING-765",
    name: "Freeze Dried Raspberry",
    category: "fruit",
    density: 0.2,
    fdc: "FDC 167755 · Raspberries, raw (SR Legacy) as freeze-dried raspberry proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Freeze-dried raspberries. Nutrition uses raw raspberry proxy scaled for lower moisture until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 350,
      protein_g: 6.0,
      fat_g: 3.0,
      saturated_fat_g: 0.1,
      carbohydrate_g: 78.0,
      sugars_g: 40.0,
      fibre_g: 30.0,
      sodium_mg: 5,
      calcium_mg: 120,
      iron_mg: 3.5,
      magnesium_mg: 100,
      potassium_mg: 900,
      zinc_mg: 1.5,
      vitamin_a_ug: 10,
      vitamin_c_mg: 150,
      vitamin_d_ug: 0,
      vitamin_k_ug: 40,
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
  { ing: "blueberry-wild", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "freeze-dried-raspberry", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  // Tokenize first so ingredient ids that contain "raspberry" cannot double-rewrite.
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand four hundred sixty-four builds.");
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
