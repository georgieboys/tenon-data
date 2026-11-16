#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 2651;
const baseBuilds = 2650;

const INGREDIENTS = [
  {
    id: "cannellini",
    code: "ING-214",
    name: "Cannellini Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 175185 · Beans, white, mature seeds, cooked, boiled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked cannellini beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 139,
      protein_g: 9.73,
      fat_g: 0.35,
      saturated_fat_g: 0.09,
      carbohydrate_g: 25.09,
      sugars_g: 0.34,
      fibre_g: 6.3,
      sodium_mg: 6,
      calcium_mg: 90,
      iron_mg: 3.7,
      magnesium_mg: 63,
      potassium_mg: 561,
      zinc_mg: 1.38,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.5,
      vitamin_b12_ug: 0,
      folate_ug: 81,
      caffeine_mg: 0,
    },
  },
  {
    id: "mung-bean",
    code: "ING-215",
    name: "Mung Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 174256 · Mung beans, mature seeds, cooked, boiled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked mung beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 105,
      protein_g: 7.02,
      fat_g: 0.38,
      saturated_fat_g: 0.12,
      carbohydrate_g: 19.15,
      sugars_g: 2.0,
      fibre_g: 7.6,
      sodium_mg: 2,
      calcium_mg: 27,
      iron_mg: 1.4,
      magnesium_mg: 48,
      potassium_mg: 266,
      zinc_mg: 0.84,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0,
      folate_ug: 159,
      caffeine_mg: 0,
    },
  },
  {
    id: "adzuki",
    code: "ING-216",
    name: "Adzuki Bean",
    category: "other",
    density: 0.85,
    fdc: "FDC 173727 · Beans, adzuki, mature seeds, cooked, boiled (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cooked adzuki beans. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 128,
      protein_g: 7.52,
      fat_g: 0.1,
      saturated_fat_g: 0.04,
      carbohydrate_g: 24.77,
      sugars_g: 0,
      fibre_g: 7.3,
      sodium_mg: 8,
      calcium_mg: 28,
      iron_mg: 2.0,
      magnesium_mg: 52,
      potassium_mg: 532,
      zinc_mg: 1.77,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 121,
      caffeine_mg: 0,
    },
  },
  {
    id: "tofu",
    code: "ING-217",
    name: "Tofu",
    category: "other",
    density: 1.0,
    fdc: "FDC 172476 · Tofu, firm, prepared with calcium sulfate (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Firm tofu. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 144,
      protein_g: 17.27,
      fat_g: 8.72,
      saturated_fat_g: 1.26,
      carbohydrate_g: 2.78,
      sugars_g: 0.6,
      fibre_g: 2.3,
      sodium_mg: 14,
      calcium_mg: 683,
      iron_mg: 2.66,
      magnesium_mg: 58,
      potassium_mg: 237,
      zinc_mg: 1.57,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.4,
      vitamin_b12_ug: 0,
      folate_ug: 29,
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
  { ing: "cannellini", cell: "chia", template: "tenon-edamame-chia-elevated", fromId: "edamame" },
  { ing: "tofu", cell: "overnight-oats", template: "tenon-navy-bean-overnight-oats-elevated", fromId: "navy-bean" },
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
  out = out.replaceAll("Two thousand six hundred fifty builds.", "Two thousand seven hundred builds.");
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
