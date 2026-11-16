#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6751;
const baseBuilds = 6750;

const INGREDIENTS = [
  {
    id: "amaranth-flour",
    code: "ING-548",
    name: "Amaranth Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 170682 · Amaranth grain, uncooked (SR Legacy) as amaranth flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Amaranth flour. Nutrition uses whole amaranth proxy until a dedicated FDC flour row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 371,
      protein_g: 13.56,
      fat_g: 7.02,
      saturated_fat_g: 1.46,
      carbohydrate_g: 65.25,
      sugars_g: 1.69,
      fibre_g: 6.7,
      sodium_mg: 4,
      calcium_mg: 159,
      iron_mg: 7.61,
      magnesium_mg: 248,
      potassium_mg: 508,
      zinc_mg: 2.87,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 82,
      caffeine_mg: 0,
    },
  },
  {
    id: "cassava-flour",
    code: "ING-549",
    name: "Cassava Flour",
    category: "grain",
    density: 0.65,
    fdc: "FDC 169792 · Cassava, raw (SR Legacy) as cassava flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cassava flour. Nutrition uses raw cassava proxy until a dedicated FDC flour row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 160,
      protein_g: 1.36,
      fat_g: 0.28,
      saturated_fat_g: 0.07,
      carbohydrate_g: 38.06,
      sugars_g: 1.7,
      fibre_g: 1.8,
      sodium_mg: 14,
      calcium_mg: 16,
      iron_mg: 0.27,
      magnesium_mg: 21,
      potassium_mg: 271,
      zinc_mg: 0.34,
      vitamin_a_ug: 1,
      vitamin_c_mg: 20.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 27,
      caffeine_mg: 0,
    },
  },
  {
    id: "tapioca-starch",
    code: "ING-550",
    name: "Tapioca Starch",
    category: "grain",
    density: 0.6,
    fdc: "FDC 168876 · Tapioca, pearl, dry (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Tapioca starch. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 358,
      protein_g: 0.19,
      fat_g: 0.02,
      saturated_fat_g: 0,
      carbohydrate_g: 88.69,
      sugars_g: 3.35,
      fibre_g: 0.9,
      sodium_mg: 1,
      calcium_mg: 20,
      iron_mg: 1.58,
      magnesium_mg: 1,
      potassium_mg: 11,
      zinc_mg: 0.12,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 4,
      caffeine_mg: 0,
    },
  },
  {
    id: "corn-flour",
    code: "ING-551",
    name: "Corn Flour",
    category: "grain",
    density: 0.65,
    fdc: "FDC 168917 · Corn flour, whole-grain, yellow (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Corn flour (whole-grain yellow). Distinct from cornstarch. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 361,
      protein_g: 6.93,
      fat_g: 3.86,
      saturated_fat_g: 0.54,
      carbohydrate_g: 76.85,
      sugars_g: 0.64,
      fibre_g: 7.3,
      sodium_mg: 5,
      calcium_mg: 7,
      iron_mg: 2.38,
      magnesium_mg: 93,
      potassium_mg: 315,
      zinc_mg: 1.73,
      vitamin_a_ug: 11,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 25,
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
  { ing: "amaranth-flour", cell: "chia", template: "tenon-rye-flour-chia-elevated", fromId: "rye-flour" },
  { ing: "corn-flour", cell: "overnight-oats", template: "tenon-quinoa-flour-overnight-oats-elevated", fromId: "quinoa-flour" },
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
  plant_based: true
  vegetarian: true
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
  out = out.replaceAll("Six thousand seven hundred fifty builds.", "Six thousand eight hundred builds.");
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
