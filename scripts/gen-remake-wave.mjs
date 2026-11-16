#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8765;
const baseBuilds = 8764;

const INGREDIENTS = [
  {
    id: "fromage-blanc",
    code: "ING-710",
    name: "Fromage Blanc",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170886 · Yogurt, Greek, plain, nonfat (SR Legacy) as fromage blanc proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Fromage blanc. Contains milk. Nutrition uses Greek yogurt nonfat proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 70,
      protein_g: 8.0,
      fat_g: 0.5,
      saturated_fat_g: 0.3,
      carbohydrate_g: 4.0,
      sugars_g: 4.0,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 100,
      iron_mg: 0.04,
      magnesium_mg: 11,
      potassium_mg: 140,
      zinc_mg: 0.5,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.05,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.6,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "fromage-frais",
    code: "ING-711",
    name: "Fromage Frais",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170886 · Yogurt, Greek, plain, nonfat (SR Legacy) as fromage frais proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Fromage frais. Contains milk. Nutrition uses Greek yogurt nonfat proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 75,
      protein_g: 7.0,
      fat_g: 2.0,
      saturated_fat_g: 1.3,
      carbohydrate_g: 4.5,
      sugars_g: 4.5,
      fibre_g: 0,
      sodium_mg: 40,
      calcium_mg: 100,
      iron_mg: 0.04,
      magnesium_mg: 11,
      potassium_mg: 140,
      zinc_mg: 0.5,
      vitamin_a_ug: 20,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.5,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "ricotta-salata",
    code: "ING-712",
    name: "Ricotta Salata",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170849 · Cheese, ricotta, whole milk (SR Legacy) as ricotta salata proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Ricotta salata (aged, salted). Contains milk. Nutrition uses whole-milk ricotta proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 174,
      protein_g: 11.3,
      fat_g: 13.0,
      saturated_fat_g: 8.3,
      carbohydrate_g: 3.0,
      sugars_g: 0.3,
      fibre_g: 0,
      sodium_mg: 900,
      calcium_mg: 207,
      iron_mg: 0.4,
      magnesium_mg: 11,
      potassium_mg: 105,
      zinc_mg: 1.2,
      vitamin_a_ug: 120,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.2,
      vitamin_k_ug: 1.1,
      vitamin_b12_ug: 0.3,
      folate_ug: 12,
      caffeine_mg: 0,
    },
  },
  {
    id: "cottage-cheese-full-fat",
    code: "ING-713",
    name: "Cottage Cheese Full Fat",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 172179 · Cheese, cottage, creamed, large or small curd (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Full-fat cottage cheese. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 98,
      protein_g: 11.1,
      fat_g: 4.3,
      saturated_fat_g: 1.7,
      carbohydrate_g: 3.4,
      sugars_g: 2.7,
      fibre_g: 0,
      sodium_mg: 364,
      calcium_mg: 83,
      iron_mg: 0.1,
      magnesium_mg: 8,
      potassium_mg: 104,
      zinc_mg: 0.4,
      vitamin_a_ug: 37,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.1,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0.4,
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
  { ing: "fromage-blanc", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "cottage-cheese-full-fat", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Eight thousand eight hundred fourteen builds.");
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
