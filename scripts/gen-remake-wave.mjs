#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5451;
const baseBuilds = 5450;

const INGREDIENTS = [
  {
    id: "moth-bean",
    code: "ING-444",
    name: "Moth Bean",
    category: "other",
    density: 0.8,
    fdc: "FDC 174256 · Mung beans, mature seeds, raw (SR Legacy) as moth bean (Vigna aconitifolia) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried moth beans. Nutrition uses mung-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 347,
      protein_g: 23.9,
      fat_g: 1.2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 62.6,
      sugars_g: 6.6,
      fibre_g: 16.3,
      sodium_mg: 15,
      calcium_mg: 132,
      iron_mg: 6.7,
      magnesium_mg: 189,
      potassium_mg: 1246,
      zinc_mg: 2.7,
      vitamin_a_ug: 6,
      vitamin_c_mg: 4.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 9.0,
      vitamin_b12_ug: 0,
      folate_ug: 625,
      caffeine_mg: 0,
    },
  },
  {
    id: "bambara",
    code: "ING-445",
    name: "Bambara",
    category: "other",
    density: 0.75,
    fdc: "FDC 174270 · Soybeans, mature seeds, raw (SR Legacy) as bambara groundnut proxy pending dedicated FDC row. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried bambara groundnuts (Vigna subterranea). Nutrition uses soybean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
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
    id: "winged-bean",
    code: "ING-446",
    name: "Winged Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 174270 · Soybeans, mature seeds, raw (SR Legacy) as winged bean seed proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried winged bean seeds (Psophocarpus tetragonolobus). Nutrition uses soybean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
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
    id: "hyacinth-bean",
    code: "ING-447",
    name: "Hyacinth Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 173735 · Beans, kidney, all types, mature seeds, raw (SR Legacy) as hyacinth / lablab bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried hyacinth beans (lablab). Nutrition uses kidney-bean proxy until a dedicated FDC row or café CoA lands. Only use edible processed SKUs; raw ornamental seeds can be toxic. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 333,
      protein_g: 23.6,
      fat_g: 0.8,
      saturated_fat_g: 0.1,
      carbohydrate_g: 60.0,
      sugars_g: 2.2,
      fibre_g: 24.9,
      sodium_mg: 24,
      calcium_mg: 143,
      iron_mg: 8.2,
      magnesium_mg: 140,
      potassium_mg: 1406,
      zinc_mg: 2.8,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 19.0,
      vitamin_b12_ug: 0,
      folate_ug: 394,
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
  { ing: "moth-bean", cell: "chia", template: "tenon-tiger-eye-bean-chia-elevated", fromId: "tiger-eye-bean" },
  { ing: "hyacinth-bean", cell: "overnight-oats", template: "tenon-horse-gram-overnight-oats-elevated", fromId: "horse-gram" },
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
  out = out.replaceAll("Five thousand four hundred fifty builds.", "Five thousand five hundred builds.");
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
