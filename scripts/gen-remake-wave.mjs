#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6701;
const baseBuilds = 6700;

const INGREDIENTS = [
  {
    id: "rye-flour",
    code: "ING-544",
    name: "Rye Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 168930 · Rye flour, dark (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Rye flour. Contains gluten. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 325,
      protein_g: 15.91,
      fat_g: 2.22,
      saturated_fat_g: 0.26,
      carbohydrate_g: 68.63,
      sugars_g: 2.3,
      fibre_g: 23.8,
      sodium_mg: 1,
      calcium_mg: 37,
      iron_mg: 2.67,
      magnesium_mg: 138,
      potassium_mg: 717,
      zinc_mg: 3.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.9,
      vitamin_b12_ug: 0,
      folate_ug: 60,
      caffeine_mg: 0,
    },
  },
  {
    id: "spelt-flour",
    code: "ING-545",
    name: "Spelt Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 168937 · Spelt, uncooked (SR Legacy) as spelt flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Spelt flour. Contains gluten. Nutrition uses whole spelt proxy until a dedicated FDC flour row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 338,
      protein_g: 14.57,
      fat_g: 2.43,
      saturated_fat_g: 0.41,
      carbohydrate_g: 70.19,
      sugars_g: 6.82,
      fibre_g: 10.7,
      sodium_mg: 8,
      calcium_mg: 27,
      iron_mg: 4.44,
      magnesium_mg: 136,
      potassium_mg: 388,
      zinc_mg: 3.28,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 45,
      caffeine_mg: 0,
    },
  },
  {
    id: "barley-flour",
    code: "ING-546",
    name: "Barley Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 170285 · Barley flour or meal (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[gluten]",
    note: "Barley flour. Contains gluten. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 345,
      protein_g: 10.5,
      fat_g: 1.6,
      saturated_fat_g: 0.34,
      carbohydrate_g: 74.52,
      sugars_g: 0.8,
      fibre_g: 10.1,
      sodium_mg: 4,
      calcium_mg: 32,
      iron_mg: 2.68,
      magnesium_mg: 96,
      potassium_mg: 309,
      zinc_mg: 2.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.2,
      vitamin_b12_ug: 0,
      folate_ug: 8,
      caffeine_mg: 0,
    },
  },
  {
    id: "quinoa-flour",
    code: "ING-547",
    name: "Quinoa Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 168874 · Quinoa, uncooked (SR Legacy) as quinoa flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Quinoa flour. Nutrition uses whole quinoa proxy until a dedicated FDC flour row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 368,
      protein_g: 14.12,
      fat_g: 6.07,
      saturated_fat_g: 0.71,
      carbohydrate_g: 64.16,
      sugars_g: 0,
      fibre_g: 7.0,
      sodium_mg: 5,
      calcium_mg: 47,
      iron_mg: 4.57,
      magnesium_mg: 197,
      potassium_mg: 563,
      zinc_mg: 3.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 184,
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
  { ing: "rye-flour", cell: "chia", template: "tenon-buckwheat-flour-chia-elevated", fromId: "buckwheat-flour" },
  { ing: "quinoa-flour", cell: "overnight-oats", template: "tenon-teff-flour-overnight-oats-elevated", fromId: "teff-flour" },
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
  out = out.replaceAll("Six thousand seven hundred builds.", "Six thousand seven hundred fifty builds.");
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
