#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 8965;
const baseBuilds = 8964;

const INGREDIENTS = [
  {
    id: "scamorza",
    code: "ING-726",
    name: "Scamorza",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170846 · Cheese, mozzarella, whole milk (SR Legacy) as scamorza proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Scamorza (pear-shaped stretched-curd cheese). Contains milk. Nutrition uses whole-milk mozzarella proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 290,
      protein_g: 22.0,
      fat_g: 22.0,
      saturated_fat_g: 14.0,
      carbohydrate_g: 1.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 550,
      calcium_mg: 550,
      iron_mg: 0.2,
      magnesium_mg: 20,
      potassium_mg: 75,
      zinc_mg: 2.5,
      vitamin_a_ug: 170,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.3,
      vitamin_k_ug: 1.5,
      vitamin_b12_ug: 1.6,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "camembert",
    code: "ING-727",
    name: "Camembert",
    category: "dairy",
    density: 1.0,
    fdc: "FDC 172176 · Cheese, camembert (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Camembert. Contains milk. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 19.8,
      fat_g: 24.3,
      saturated_fat_g: 15.3,
      carbohydrate_g: 0.5,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 842,
      calcium_mg: 388,
      iron_mg: 0.3,
      magnesium_mg: 20,
      potassium_mg: 187,
      zinc_mg: 2.4,
      vitamin_a_ug: 241,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.4,
      vitamin_k_ug: 2.0,
      vitamin_b12_ug: 1.3,
      folate_ug: 62,
      caffeine_mg: 0,
    },
  },
  {
    id: "gorgonzola",
    code: "ING-728",
    name: "Gorgonzola",
    category: "dairy",
    density: 1.0,
    fdc: "FDC 172175 · Cheese, blue (SR Legacy) as gorgonzola proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Gorgonzola. Contains milk. Nutrition uses blue cheese proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 353,
      protein_g: 21.4,
      fat_g: 28.7,
      saturated_fat_g: 18.7,
      carbohydrate_g: 2.3,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 1395,
      calcium_mg: 528,
      iron_mg: 0.3,
      magnesium_mg: 23,
      potassium_mg: 256,
      zinc_mg: 2.7,
      vitamin_a_ug: 198,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.4,
      vitamin_b12_ug: 1.2,
      folate_ug: 36,
      caffeine_mg: 0,
    },
  },
  {
    id: "caciocavallo",
    code: "ING-729",
    name: "Caciocavallo",
    category: "dairy",
    density: 1.05,
    fdc: "FDC 170844 · Cheese, provolone (SR Legacy) as caciocavallo proxy. Proxy until the café SKU is labelled.",
    allergens: "[milk]",
    note: "Caciocavallo (southern Italian stretched-curd). Contains milk. Nutrition uses provolone proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: false, vegetarian: true },
    nutrition: {
      energy_kcal: 351,
      protein_g: 25.6,
      fat_g: 26.6,
      saturated_fat_g: 17.1,
      carbohydrate_g: 2.1,
      sugars_g: 0.6,
      fibre_g: 0,
      sodium_mg: 876,
      calcium_mg: 756,
      iron_mg: 0.5,
      magnesium_mg: 28,
      potassium_mg: 138,
      zinc_mg: 3.2,
      vitamin_a_ug: 230,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0.5,
      vitamin_k_ug: 2.2,
      vitamin_b12_ug: 1.5,
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
  { ing: "scamorza", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "caciocavallo", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Nine thousand fourteen builds.");
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
