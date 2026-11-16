#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5501;
const baseBuilds = 5500;

const INGREDIENTS = [
  {
    id: "jack-bean",
    code: "ING-448",
    name: "Jack Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 174270 · Soybeans, mature seeds, raw (SR Legacy) as jack bean proxy pending dedicated FDC row. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried jack beans (Canavalia ensiformis). Nutrition uses soybean proxy until a dedicated FDC row or café CoA lands. Use only food-grade processed SKUs. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 446,
      protein_g: 36.5,
      fat_g: 19.9,
      saturated_fat_g: 2.9,
      carbohydrate_g: 30.2,
      sugars_g: 7.3,
      fibre_g: 9.3,
      sodium_mg: 2,
      calcium_mg: 277,
      iron_mg: 15.7,
      magnesium_mg: 280,
      potassium_mg: 1797,
      zinc_mg: 4.9,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 47.0,
      vitamin_b12_ug: 0,
      folate_ug: 375,
      caffeine_mg: 0,
    },
  },
  {
    id: "velvet-bean",
    code: "ING-449",
    name: "Velvet Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 174270 · Soybeans, mature seeds, raw (SR Legacy) as velvet bean / Mucuna proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried velvet beans (Mucuna pruriens). Nutrition uses soybean proxy until a dedicated FDC row or café CoA lands. Use only food-grade processed SKUs. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 446,
      protein_g: 36.5,
      fat_g: 19.9,
      saturated_fat_g: 2.9,
      carbohydrate_g: 30.2,
      sugars_g: 7.3,
      fibre_g: 9.3,
      sodium_mg: 2,
      calcium_mg: 277,
      iron_mg: 15.7,
      magnesium_mg: 280,
      potassium_mg: 1797,
      zinc_mg: 4.9,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 47.0,
      vitamin_b12_ug: 0,
      folate_ug: 375,
      caffeine_mg: 0,
    },
  },
  {
    id: "sword-bean",
    code: "ING-450",
    name: "Sword Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 174270 · Soybeans, mature seeds, raw (SR Legacy) as sword bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried sword beans (Canavalia gladiata). Nutrition uses soybean proxy until a dedicated FDC row or café CoA lands. Use only food-grade processed SKUs. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 446,
      protein_g: 36.5,
      fat_g: 19.9,
      saturated_fat_g: 2.9,
      carbohydrate_g: 30.2,
      sugars_g: 7.3,
      fibre_g: 9.3,
      sodium_mg: 2,
      calcium_mg: 277,
      iron_mg: 15.7,
      magnesium_mg: 280,
      potassium_mg: 1797,
      zinc_mg: 4.9,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 47.0,
      vitamin_b12_ug: 0,
      folate_ug: 375,
      caffeine_mg: 0,
    },
  },
  {
    id: "eye-of-goat",
    code: "ING-451",
    name: "Eye Of Goat",
    category: "other",
    density: 0.75,
    fdc: "FDC 175186 · Beans, black, mature seeds, raw (SR Legacy) as ojo de cabra / eye of goat bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried ojo de cabra (eye of goat) beans. Nutrition uses black-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 341,
      protein_g: 21.6,
      fat_g: 1.4,
      saturated_fat_g: 0.4,
      carbohydrate_g: 62.4,
      sugars_g: 2.1,
      fibre_g: 15.5,
      sodium_mg: 5,
      calcium_mg: 123,
      iron_mg: 5.0,
      magnesium_mg: 171,
      potassium_mg: 1483,
      zinc_mg: 3.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6.0,
      vitamin_b12_ug: 0,
      folate_ug: 444,
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
  { ing: "jack-bean", cell: "chia", template: "tenon-moth-bean-chia-elevated", fromId: "moth-bean" },
  { ing: "eye-of-goat", cell: "overnight-oats", template: "tenon-hyacinth-bean-overnight-oats-elevated", fromId: "hyacinth-bean" },
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
  out = out.replaceAll("Five thousand five hundred builds.", "Five thousand five hundred fifty builds.");
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
