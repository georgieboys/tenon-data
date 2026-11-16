#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4251;
const baseBuilds = 4250;

const INGREDIENTS = [
  {
    id: "nigella",
    code: "ING-345",
    name: "Nigella",
    category: "spice",
    density: 0.55,
    fdc: "FDC 170928 · Spices, cumin seed (SR Legacy) as nigella / kalonji proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried nigella (kalonji / black cumin) seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 375,
      protein_g: 18.0,
      fat_g: 22.0,
      saturated_fat_g: 2.5,
      carbohydrate_g: 44.0,
      sugars_g: 2.0,
      fibre_g: 10.0,
      sodium_mg: 40,
      calcium_mg: 500,
      iron_mg: 10.0,
      magnesium_mg: 200,
      potassium_mg: 800,
      zinc_mg: 3.5,
      vitamin_a_ug: 10,
      vitamin_c_mg: 2.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "annatto",
    code: "ING-346",
    name: "Annatto",
    category: "spice",
    density: 0.5,
    fdc: "FDC 170919 · Spices, paprika (SR Legacy) as annatto / achiote seed proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried annatto (achiote) seed. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 280,
      protein_g: 14.0,
      fat_g: 13.0,
      saturated_fat_g: 2.0,
      carbohydrate_g: 35.0,
      sugars_g: 5.0,
      fibre_g: 20.0,
      sodium_mg: 30,
      calcium_mg: 200,
      iron_mg: 8.0,
      magnesium_mg: 150,
      potassium_mg: 1500,
      zinc_mg: 2.0,
      vitamin_a_ug: 1500,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.0,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "epazote",
    code: "ING-347",
    name: "Epazote",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as epazote leafy herb proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh epazote leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 32,
      protein_g: 3.0,
      fat_g: 0.5,
      saturated_fat_g: 0.05,
      carbohydrate_g: 5.5,
      sugars_g: 0.4,
      fibre_g: 3.0,
      sodium_mg: 10,
      calcium_mg: 150,
      iron_mg: 2.5,
      magnesium_mg: 50,
      potassium_mg: 350,
      zinc_mg: 0.5,
      vitamin_a_ug: 200,
      vitamin_c_mg: 25.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200.0,
      vitamin_b12_ug: 0,
      folate_ug: 60,
      caffeine_mg: 0,
    },
  },
  {
    id: "hoja-santa",
    code: "ING-348",
    name: "Hoja Santa",
    category: "spice",
    density: 0.35,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as hoja santa leafy wrap proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh hoja santa (piper auritum) leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 2.8,
      fat_g: 0.5,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.0,
      sugars_g: 0.5,
      fibre_g: 2.5,
      sodium_mg: 20,
      calcium_mg: 180,
      iron_mg: 2.8,
      magnesium_mg: 55,
      potassium_mg: 400,
      zinc_mg: 0.5,
      vitamin_a_ug: 250,
      vitamin_c_mg: 18.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 220.0,
      vitamin_b12_ug: 0,
      folate_ug: 70,
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
  { ing: "nigella", cell: "chia", template: "tenon-lemon-myrtle-chia-elevated", fromId: "lemon-myrtle" },
  { ing: "hoja-santa", cell: "overnight-oats", template: "tenon-ajwain-overnight-oats-elevated", fromId: "ajwain" },
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
  out = out.replaceAll("Four thousand two hundred fifty builds.", "Four thousand three hundred builds.");
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
