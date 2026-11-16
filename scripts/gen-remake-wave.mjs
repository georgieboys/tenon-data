#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8815;
const baseBuilds = 8814;

const INGREDIENTS = [
  {
    id: "mascarpone-light",
    code: "ING-714",
    name: "Mascarpone Light",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170903 · Yogurt, Greek, plain, whole milk (SR Legacy) as light mascarpone proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light mascarpone cell. Contains milk. Nutrition uses Greek yogurt whole-milk proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 250,
      protein_g: 5.0,
      fat_g: 25.0,
      saturated_fat_g: 16.0,
      carbohydrate_g: 3.0,
      sugars_g: 3.0,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 80,
      iron_mg: 0.05,
      magnesium_mg: 10,
      potassium_mg: 100,
      zinc_mg: 0.4,
      vitamin_a_ug: 200,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 0.4,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "pastry-cream",
    code: "ING-715",
    name: "Pastry Cream",
    category: "dairy",
    density: 1.1,
    fdc: "FDC 171840 · Custard, egg, dry mix (SR Legacy) as pastry cream proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk, egg]",
    note: "Pastry cream (crème pâtissière). Contains milk and egg. Nutrition uses custard-mix proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 140,
      protein_g: 4.0,
      fat_g: 5.0,
      saturated_fat_g: 2.5,
      carbohydrate_g: 20.0,
      sugars_g: 12.0,
      fibre_g: 0,
      sodium_mg: 80,
      calcium_mg: 80,
      iron_mg: 0.3,
      magnesium_mg: 10,
      potassium_mg: 100,
      zinc_mg: 0.4,
      vitamin_a_ug: 50,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 0.5,
      vitamin_b12_ug: 0.4,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "creme-anglaise",
    code: "ING-716",
    name: "Creme Anglaise",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 171840 · Custard, egg, dry mix (SR Legacy) as crème anglaise proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk, egg]",
    note: "Crème anglaise. Contains milk and egg. Nutrition uses custard-mix proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 120,
      protein_g: 4.0,
      fat_g: 6.0,
      saturated_fat_g: 3.5,
      carbohydrate_g: 12.0,
      sugars_g: 11.0,
      fibre_g: 0,
      sodium_mg: 50,
      calcium_mg: 90,
      iron_mg: 0.3,
      magnesium_mg: 10,
      potassium_mg: 110,
      zinc_mg: 0.4,
      vitamin_a_ug: 60,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 0.5,
      vitamin_b12_ug: 0.5,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "clotted-cream-devon",
    code: "ING-717",
    name: "Clotted Cream Devon",
    category: "dairy",
    density: 0.98,
    fdc: "FDC 170857 · Cream, fluid, heavy whipping (SR Legacy) as Devon clotted cream proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Devon-style clotted cream cell. Contains milk. Nutrition uses heavy cream proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 586,
      protein_g: 1.6,
      fat_g: 63.5,
      saturated_fat_g: 39.7,
      carbohydrate_g: 2.7,
      sugars_g: 2.7,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 60,
      iron_mg: 0.1,
      magnesium_mg: 7,
      potassium_mg: 80,
      zinc_mg: 0.2,
      vitamin_a_ug: 600,
      vitamin_c_mg: 0.6,
      vitamin_d_ug: 0.8,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0.2,
      folate_ug: 4,
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
  { ing: "mascarpone-light", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "clotted-cream-devon", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  let out = src;
  out = out.replaceAll("tenon-raspberry-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("raspberry", ingId);
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand eight hundred sixty-four builds.");
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
