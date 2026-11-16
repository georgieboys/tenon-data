#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 3951;
const baseBuilds = 3950;

const INGREDIENTS = [
  {
    id: "sumac",
    code: "ING-321",
    name: "Sumac",
    category: "spice",
    density: 0.5,
    fdc: "FDC 171328 · Spices, paprika (SR Legacy) as sumac tart-spice proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground sumac. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 280,
      protein_g: 5.0,
      fat_g: 10.0,
      saturated_fat_g: 1.5,
      carbohydrate_g: 50.0,
      sugars_g: 5.0,
      fibre_g: 20.0,
      sodium_mg: 50,
      calcium_mg: 150,
      iron_mg: 10.0,
      magnesium_mg: 80,
      potassium_mg: 500,
      zinc_mg: 1.5,
      vitamin_a_ug: 50,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20.0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "curry-leaf",
    code: "ING-322",
    name: "Curry Leaf",
    category: "spice",
    density: 0.35,
    fdc: "FDC 11457 · Spinach, raw (SR Legacy) as curry leaf aromatic green proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh curry leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 108,
      protein_g: 6.1,
      fat_g: 1.0,
      saturated_fat_g: 0.2,
      carbohydrate_g: 18.7,
      sugars_g: 0.5,
      fibre_g: 6.4,
      sodium_mg: 20,
      calcium_mg: 830,
      iron_mg: 0.9,
      magnesium_mg: 50,
      potassium_mg: 400,
      zinc_mg: 0.2,
      vitamin_a_ug: 756,
      vitamin_c_mg: 4.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 90,
      caffeine_mg: 0,
    },
  },
  {
    id: "makrut-lime-leaf",
    code: "ING-323",
    name: "Makrut Lime Leaf",
    category: "spice",
    density: 0.35,
    fdc: "FDC 167746 · Makrut / kaffir lime leaf proxy via citrus leaf / lemon zest values (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh makrut lime leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 40,
      protein_g: 1.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 8.0,
      sugars_g: 0.5,
      fibre_g: 3.0,
      sodium_mg: 5,
      calcium_mg: 40,
      iron_mg: 0.5,
      magnesium_mg: 15,
      potassium_mg: 150,
      zinc_mg: 0.1,
      vitamin_a_ug: 20,
      vitamin_c_mg: 30.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 10.0,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "galangal",
    code: "ING-324",
    name: "Galangal",
    category: "spice",
    density: 0.9,
    fdc: "FDC 169231 · Ginger root, raw (SR Legacy) as galangal rhizome proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw galangal rhizome. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 80,
      protein_g: 1.5,
      fat_g: 0.8,
      saturated_fat_g: 0.2,
      carbohydrate_g: 17.0,
      sugars_g: 1.5,
      fibre_g: 2.0,
      sodium_mg: 13,
      calcium_mg: 20,
      iron_mg: 0.6,
      magnesium_mg: 40,
      potassium_mg: 400,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
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
  { ing: "sumac", cell: "chia", template: "tenon-ugli-chia-elevated", fromId: "ugli" },
  { ing: "galangal", cell: "overnight-oats", template: "tenon-glasswort-overnight-oats-elevated", fromId: "glasswort" },
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
  out = out.replaceAll("Three thousand nine hundred fifty builds.", "Four thousand builds.");
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
