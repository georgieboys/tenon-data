#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8915;
const baseBuilds = 8914;

const INGREDIENTS = [
  {
    id: "mozzarella-fresh",
    code: "ING-722",
    name: "Mozzarella Fresh",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170846 · Cheese, mozzarella, whole milk (SR Legacy) as fresh mozzarella proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Fresh mozzarella. Contains milk. Nutrition uses whole-milk mozzarella proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 18.0,
      fat_g: 22.0,
      saturated_fat_g: 13.0,
      carbohydrate_g: 2.0,
      sugars_g: 1.0,
      fibre_g: 0,
      sodium_mg: 300,
      calcium_mg: 450,
      iron_mg: 0.2,
      magnesium_mg: 15,
      potassium_mg: 70,
      zinc_mg: 2.0,
      vitamin_a_ug: 180,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.5,
      vitamin_b12_ug: 1.5,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "mozzarella-low-moisture",
    code: "ING-723",
    name: "Mozzarella Low Moisture",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170847 · Cheese, mozzarella, low moisture, part skim (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Low-moisture mozzarella. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 295,
      protein_g: 23.7,
      fat_g: 19.7,
      saturated_fat_g: 11.5,
      carbohydrate_g: 5.6,
      sugars_g: 1.5,
      fibre_g: 0,
      sodium_mg: 600,
      calcium_mg: 710,
      iron_mg: 0.2,
      magnesium_mg: 23,
      potassium_mg: 80,
      zinc_mg: 2.8,
      vitamin_a_ug: 160,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.8,
      vitamin_b12_ug: 2.0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "stracciatella",
    code: "ING-724",
    name: "Stracciatella",
    category: "dairy",
    density: 1.0,
    fdc: "FDC 170846 · Cheese, mozzarella, whole milk (SR Legacy) as stracciatella proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Stracciatella (shredded mozzarella in cream). Contains milk. Nutrition uses whole-milk mozzarella proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 12.0,
      fat_g: 28.0,
      saturated_fat_g: 18.0,
      carbohydrate_g: 2.0,
      sugars_g: 1.5,
      fibre_g: 0,
      sodium_mg: 280,
      calcium_mg: 350,
      iron_mg: 0.2,
      magnesium_mg: 12,
      potassium_mg: 70,
      zinc_mg: 1.5,
      vitamin_a_ug: 220,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.5,
      vitamin_b12_ug: 1.2,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "sour-cream-light",
    code: "ING-725",
    name: "Sour Cream Light",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170860 · Cream, sour, reduced fat (SR Legacy) as light sour cream proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Light sour cream. Contains milk. Nutrition uses reduced-fat sour cream proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 135,
      protein_g: 3.5,
      fat_g: 12.0,
      saturated_fat_g: 7.5,
      carbohydrate_g: 4.3,
      sugars_g: 4.0,
      fibre_g: 0,
      sodium_mg: 50,
      calcium_mg: 100,
      iron_mg: 0.05,
      magnesium_mg: 10,
      potassium_mg: 120,
      zinc_mg: 0.3,
      vitamin_a_ug: 90,
      vitamin_c_mg: 0.8,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.8,
      vitamin_b12_ug: 0.3,
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
  { ing: "mozzarella-fresh", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "sour-cream-light", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand nine hundred sixty-four builds.");
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
