#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6201;
const baseBuilds = 6200;

const INGREDIENTS = [
  {
    id: "blackstrap-molasses",
    code: "ING-504",
    name: "Blackstrap Molasses",
    category: "sweetener",
    density: 1.4,
    fdc: "FDC 168820 · Molasses (SR Legacy) as blackstrap molasses grade. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Blackstrap molasses. Distinct catalogue cell from molasses for SKU grading. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 290,
      protein_g: 0,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 74.7,
      sugars_g: 74.7,
      fibre_g: 0,
      sodium_mg: 37,
      calcium_mg: 205,
      iron_mg: 4.7,
      magnesium_mg: 242,
      potassium_mg: 1464,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.1,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "cane-syrup",
    code: "ING-505",
    name: "Cane Syrup",
    category: "sweetener",
    density: 1.4,
    fdc: "FDC 168820 · Molasses (SR Legacy) as cane syrup proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cane syrup. Nutrition uses molasses proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 290,
      protein_g: 0,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 74.7,
      sugars_g: 74.7,
      fibre_g: 0,
      sodium_mg: 37,
      calcium_mg: 205,
      iron_mg: 4.7,
      magnesium_mg: 242,
      potassium_mg: 1464,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0.1,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "golden-syrup",
    code: "ING-506",
    name: "Golden Syrup",
    category: "sweetener",
    density: 1.4,
    fdc: "FDC 169661 · Syrups, maple (SR Legacy) as golden syrup proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Golden syrup. Nutrition uses maple syrup proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 260,
      protein_g: 0.04,
      fat_g: 0.06,
      saturated_fat_g: 0.01,
      carbohydrate_g: 67.0,
      sugars_g: 60.5,
      fibre_g: 0,
      sodium_mg: 12,
      calcium_mg: 102,
      iron_mg: 0.1,
      magnesium_mg: 21,
      potassium_mg: 212,
      zinc_mg: 0.7,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "corn-syrup",
    code: "ING-507",
    name: "Corn Syrup",
    category: "sweetener",
    density: 1.4,
    fdc: "FDC 168875 · Sweetener, syrup, brown rice (SR Legacy) as corn syrup proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Corn syrup. Nutrition uses brown-rice-syrup proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 319,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 79.5,
      sugars_g: 37.0,
      fibre_g: 0,
      sodium_mg: 58,
      calcium_mg: 6,
      iron_mg: 0.1,
      magnesium_mg: 0,
      potassium_mg: 0,
      zinc_mg: 0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
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
  { ing: "blackstrap-molasses", cell: "chia", template: "tenon-rice-syrup-chia-elevated", fromId: "rice-syrup" },
  { ing: "corn-syrup", cell: "overnight-oats", template: "tenon-sorghum-syrup-overnight-oats-elevated", fromId: "sorghum-syrup" },
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
  out = out.replaceAll("Six thousand two hundred builds.", "Six thousand two hundred fifty builds.");
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
