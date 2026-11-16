#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9515;
const baseBuilds = 9514;

const INGREDIENTS = [
  {
    id: "apricot-dried-unsulphured",
    code: "ING-770",
    name: "Apricot Dried Unsulphured",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 173941 · Apricots, dried, sulfured, uncooked (SR Legacy) as unsulphured dried apricot proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Unsulphured dried apricots. Nutrition uses dried apricot proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 241,
      protein_g: 3.4,
      fat_g: 0.5,
      saturated_fat_g: 0,
      carbohydrate_g: 62.6,
      sugars_g: 53.4,
      fibre_g: 7.3,
      sodium_mg: 10,
      calcium_mg: 55,
      iron_mg: 2.7,
      magnesium_mg: 32,
      potassium_mg: 1162,
      zinc_mg: 0.4,
      vitamin_a_ug: 180,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.1,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "fig-dried-mission",
    code: "ING-771",
    name: "Fig Dried Mission",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 174670 · Figs, dried, uncooked (SR Legacy) as mission dried fig proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried mission figs. Nutrition uses dried fig proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 249,
      protein_g: 3.3,
      fat_g: 0.9,
      saturated_fat_g: 0.1,
      carbohydrate_g: 63.9,
      sugars_g: 47.9,
      fibre_g: 9.8,
      sodium_mg: 10,
      calcium_mg: 162,
      iron_mg: 2.0,
      magnesium_mg: 68,
      potassium_mg: 680,
      zinc_mg: 0.6,
      vitamin_a_ug: 10,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 15.6,
      vitamin_b12_ug: 0,
      folate_ug: 9,
      caffeine_mg: 0,
    },
  },
  {
    id: "goji-berry",
    code: "ING-772",
    name: "Goji Berry",
    category: "fruit",
    density: 0.6,
    fdc: "FDC 173944 · Goji berries dried (SR Legacy proxy via generic dried fruit). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried goji berries. Nutrition uses estimated dried-berry proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 349,
      protein_g: 14.3,
      fat_g: 0.4,
      saturated_fat_g: 0,
      carbohydrate_g: 77.1,
      sugars_g: 45.6,
      fibre_g: 13.0,
      sodium_mg: 298,
      calcium_mg: 190,
      iron_mg: 6.8,
      magnesium_mg: 80,
      potassium_mg: 900,
      zinc_mg: 1.5,
      vitamin_a_ug: 2682,
      vitamin_c_mg: 48.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "mulberry-dried",
    code: "ING-773",
    name: "Mulberry Dried",
    category: "fruit",
    density: 0.6,
    fdc: "FDC 169911 · Mulberries, raw (SR Legacy) as dried mulberry proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried mulberries. Nutrition uses raw mulberry proxy scaled for lower moisture until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 320,
      protein_g: 10.0,
      fat_g: 2.0,
      saturated_fat_g: 0.2,
      carbohydrate_g: 70.0,
      sugars_g: 50.0,
      fibre_g: 10.0,
      sodium_mg: 20,
      calcium_mg: 150,
      iron_mg: 5.0,
      magnesium_mg: 70,
      potassium_mg: 800,
      zinc_mg: 1.0,
      vitamin_a_ug: 20,
      vitamin_c_mg: 20.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 30,
      vitamin_b12_ug: 0,
      folate_ug: 40,
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
  { ing: "apricot-dried-unsulphured", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "mulberry-dried", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand five hundred sixty-four builds.");
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
