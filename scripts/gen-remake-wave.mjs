#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 9165;
const baseBuilds = 9164;

const INGREDIENTS = [
  {
    id: "kefir-goat",
    code: "ING-742",
    name: "Kefir Goat",
    category: "dairy",
    density: 1.03,
    fdc: "FDC 170904 · Kefir, lowfat, plain, LIFEWAY (SR Legacy) as goat kefir proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Goat milk kefir. Contains milk. Nutrition uses lowfat kefir proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 43,
      protein_g: 3.8,
      fat_g: 1.0,
      saturated_fat_g: 0.7,
      carbohydrate_g: 4.8,
      sugars_g: 4.5,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 130,
      iron_mg: 0.04,
      magnesium_mg: 12,
      potassium_mg: 160,
      zinc_mg: 0.4,
      vitamin_a_ug: 20,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.3,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "quark-light",
    code: "ING-743",
    name: "Quark Light",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170904 · Yogurt, Greek, plain, nonfat (SR Legacy) as light quark proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light quark. Contains milk. Nutrition uses nonfat Greek yogurt proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 67,
      protein_g: 12.0,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 4.0,
      sugars_g: 3.5,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 100,
      iron_mg: 0.05,
      magnesium_mg: 12,
      potassium_mg: 150,
      zinc_mg: 0.5,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0.5,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "labneh-light",
    code: "ING-744",
    name: "Labneh Light",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170904 · Yogurt, Greek, plain, nonfat (SR Legacy) as light labneh proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light labneh. Contains milk. Nutrition uses nonfat Greek yogurt proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 100,
      protein_g: 9.0,
      fat_g: 4.0,
      saturated_fat_g: 2.5,
      carbohydrate_g: 4.5,
      sugars_g: 4.0,
      fibre_g: 0,
      sodium_mg: 55,
      calcium_mg: 120,
      iron_mg: 0.05,
      magnesium_mg: 12,
      potassium_mg: 140,
      zinc_mg: 0.5,
      vitamin_a_ug: 30,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.4,
      folate_ug: 12,
      caffeine_mg: 0,
    },
  },
  {
    id: "cottage-cheese-low-fat",
    code: "ING-745",
    name: "Cottage Cheese Low Fat",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 172179 · Cheese, cottage, lowfat, 1% milkfat (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Low-fat cottage cheese. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 72,
      protein_g: 12.4,
      fat_g: 1.0,
      saturated_fat_g: 0.6,
      carbohydrate_g: 2.7,
      sugars_g: 2.7,
      fibre_g: 0,
      sodium_mg: 406,
      calcium_mg: 61,
      iron_mg: 0.1,
      magnesium_mg: 5,
      potassium_mg: 86,
      zinc_mg: 0.4,
      vitamin_a_ug: 12,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0.5,
      folate_ug: 12,
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
  { ing: "kefir-goat", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "cottage-cheese-low-fat", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand two hundred fourteen builds.");
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
