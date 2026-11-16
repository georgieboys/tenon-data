#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1801;
const baseBuilds = 1800;

const INGREDIENTS = [
  {
    id: "chickpea-flour",
    code: "ING-144",
    name: "Chickpea Flour",
    category: "grain",
    density: 0.6,
    fdc: "FDC 174288 · Chickpea flour (besan) (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Chickpea flour (besan). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 387,
      protein_g: 22.39,
      fat_g: 6.69,
      saturated_fat_g: 0.69,
      carbohydrate_g: 57.82,
      sugars_g: 10.85,
      fibre_g: 10.8,
      sodium_mg: 64,
      calcium_mg: 45,
      iron_mg: 4.86,
      magnesium_mg: 166,
      potassium_mg: 846,
      zinc_mg: 2.81,
      vitamin_a_ug: 2,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 9.1,
      vitamin_b12_ug: 0,
      folate_ug: 437,
      caffeine_mg: 0,
    },
  },
  {
    id: "oat-flour",
    code: "ING-145",
    name: "Oat Flour",
    category: "grain",
    density: 0.55,
    fdc: "FDC 173904 · Oat flour, partially debranned (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Oat flour. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 404,
      protein_g: 14.66,
      fat_g: 9.12,
      saturated_fat_g: 1.61,
      carbohydrate_g: 65.7,
      sugars_g: 0.8,
      fibre_g: 6.5,
      sodium_mg: 19,
      calcium_mg: 54,
      iron_mg: 4,
      magnesium_mg: 144,
      potassium_mg: 371,
      zinc_mg: 3.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 3.2,
      vitamin_b12_ug: 0,
      folate_ug: 32,
      caffeine_mg: 0,
    },
  },
  {
    id: "almond-flour",
    code: "ING-146",
    name: "Almond Flour",
    category: "nut_seed",
    density: 0.45,
    fdc: "FDC 170567 · Nuts, almonds (SR Legacy) used as almond flour proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Almond flour (whole almond proxy). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 579,
      protein_g: 21.15,
      fat_g: 49.93,
      saturated_fat_g: 3.8,
      carbohydrate_g: 21.55,
      sugars_g: 4.35,
      fibre_g: 12.5,
      sodium_mg: 1,
      calcium_mg: 269,
      iron_mg: 3.71,
      magnesium_mg: 270,
      potassium_mg: 733,
      zinc_mg: 3.12,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 44,
      caffeine_mg: 0,
    },
  },
  {
    id: "coconut-flour",
    code: "ING-147",
    name: "Coconut Flour",
    category: "nut_seed",
    density: 0.45,
    fdc: "FDC 170169 · Nuts, coconut meat, dried (desiccated), not sweetened (SR Legacy) used as coconut flour proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Coconut flour (desiccated coconut proxy). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 660,
      protein_g: 6.88,
      fat_g: 64.53,
      saturated_fat_g: 57.22,
      carbohydrate_g: 23.65,
      sugars_g: 7.35,
      fibre_g: 16.3,
      sodium_mg: 37,
      calcium_mg: 26,
      iron_mg: 3.32,
      magnesium_mg: 90,
      potassium_mg: 543,
      zinc_mg: 2.01,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 9,
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
  { ing: "chickpea-flour", cell: "chia", template: "tenon-freekeh-chia-elevated", fromId: "freekeh" },
  { ing: "coconut-flour", cell: "overnight-oats", template: "tenon-polenta-overnight-oats-elevated", fromId: "polenta" },
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
  out = out.replaceAll("One thousand eight hundred builds.", "One thousand eight hundred fifty builds.");
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
