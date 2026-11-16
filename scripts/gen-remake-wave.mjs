#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6651;
const baseBuilds = 6650;

const INGREDIENTS = [
  {
    id: "buckwheat-flour",
    code: "ING-540",
    name: "Buckwheat Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 170286 · Buckwheat flour, whole-groat (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Buckwheat flour. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 335,
      protein_g: 12.62,
      fat_g: 3.1,
      saturated_fat_g: 0.68,
      carbohydrate_g: 70.59,
      sugars_g: 2.6,
      fibre_g: 10.0,
      sodium_mg: 11,
      calcium_mg: 41,
      iron_mg: 4.06,
      magnesium_mg: 251,
      potassium_mg: 577,
      zinc_mg: 3.12,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 7,
      vitamin_b12_ug: 0,
      folate_ug: 54,
      caffeine_mg: 0,
    },
  },
  {
    id: "sorghum-flour",
    code: "ING-541",
    name: "Sorghum Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 169711 · Sorghum flour, whole-grain (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sorghum flour. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 359,
      protein_g: 8.43,
      fat_g: 3.34,
      saturated_fat_g: 0.61,
      carbohydrate_g: 76.64,
      sugars_g: 1.94,
      fibre_g: 6.6,
      sodium_mg: 3,
      calcium_mg: 12,
      iron_mg: 3.36,
      magnesium_mg: 123,
      potassium_mg: 324,
      zinc_mg: 1.66,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "millet-flour",
    code: "ING-542",
    name: "Millet Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 169702 · Millet, cooked (SR Legacy) flour proxy adjusted. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Millet flour. Nutrition uses millet grain proxy until a dedicated FDC flour row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 378,
      protein_g: 11.02,
      fat_g: 4.22,
      saturated_fat_g: 0.72,
      carbohydrate_g: 72.85,
      sugars_g: 0,
      fibre_g: 8.5,
      sodium_mg: 5,
      calcium_mg: 8,
      iron_mg: 3.01,
      magnesium_mg: 114,
      potassium_mg: 195,
      zinc_mg: 1.68,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.9,
      vitamin_b12_ug: 0,
      folate_ug: 85,
      caffeine_mg: 0,
    },
  },
  {
    id: "teff-flour",
    code: "ING-543",
    name: "Teff Flour",
    category: "grain",
    density: 0.7,
    fdc: "FDC 169745 · Teff, uncooked (SR Legacy) as teff flour proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Teff flour. Nutrition uses whole teff proxy until a dedicated FDC flour row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 367,
      protein_g: 13.3,
      fat_g: 2.38,
      saturated_fat_g: 0.45,
      carbohydrate_g: 73.13,
      sugars_g: 1.84,
      fibre_g: 8.0,
      sodium_mg: 12,
      calcium_mg: 180,
      iron_mg: 7.63,
      magnesium_mg: 184,
      potassium_mg: 427,
      zinc_mg: 3.63,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 0,
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
  { ing: "buckwheat-flour", cell: "chia", template: "tenon-white-miso-chia-elevated", fromId: "white-miso" },
  { ing: "teff-flour", cell: "overnight-oats", template: "tenon-black-bean-sauce-overnight-oats-elevated", fromId: "black-bean-sauce" },
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
  out = out.replaceAll("Six thousand six hundred fifty builds.", "Six thousand seven hundred builds.");
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
