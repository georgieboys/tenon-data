#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5401;
const baseBuilds = 5400;

const INGREDIENTS = [
  {
    id: "tiger-eye-bean",
    code: "ING-440",
    name: "Tiger Eye Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 175199 · Beans, pinto, mature seeds, raw (SR Legacy) as tiger eye bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried tiger eye beans. Nutrition uses pinto-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 347,
      protein_g: 21.4,
      fat_g: 1.2,
      saturated_fat_g: 0.2,
      carbohydrate_g: 62.6,
      sugars_g: 2.1,
      fibre_g: 15.5,
      sodium_mg: 12,
      calcium_mg: 113,
      iron_mg: 5.1,
      magnesium_mg: 176,
      potassium_mg: 1393,
      zinc_mg: 2.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 6.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.6,
      vitamin_b12_ug: 0,
      folate_ug: 525,
      caffeine_mg: 0,
    },
  },
  {
    id: "dragon-tongue-bean",
    code: "ING-441",
    name: "Dragon Tongue Bean",
    category: "other",
    density: 0.75,
    fdc: "FDC 173738 · Beans, french, mature seeds, raw (SR Legacy) as dragon tongue bean proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried dragon tongue beans. Nutrition uses French-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 343,
      protein_g: 18.8,
      fat_g: 2.0,
      saturated_fat_g: 0.2,
      carbohydrate_g: 64.1,
      sugars_g: 0,
      fibre_g: 25.2,
      sodium_mg: 18,
      calcium_mg: 186,
      iron_mg: 5.5,
      magnesium_mg: 188,
      potassium_mg: 1316,
      zinc_mg: 1.9,
      vitamin_a_ug: 0,
      vitamin_c_mg: 4.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 399,
      caffeine_mg: 0,
    },
  },
  {
    id: "rice-bean",
    code: "ING-442",
    name: "Rice Bean",
    category: "other",
    density: 0.8,
    fdc: "FDC 174256 · Mung beans, mature seeds, raw (SR Legacy) as rice bean (Vigna umbellata) proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried rice beans (Vigna umbellata). Nutrition uses mung-bean proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
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
    id: "horse-gram",
    code: "ING-443",
    name: "Horse Gram",
    category: "other",
    density: 0.8,
    fdc: "FDC 172424 · Pigeon peas (red gram), mature seeds, raw (SR Legacy) as horse gram proxy pending dedicated FDC row. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried horse gram (Macrotyloma uniflorum). Nutrition uses pigeon-pea proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 343,
      protein_g: 21.7,
      fat_g: 1.5,
      saturated_fat_g: 0.3,
      carbohydrate_g: 62.8,
      sugars_g: 0,
      fibre_g: 15.0,
      sodium_mg: 17,
      calcium_mg: 130,
      iron_mg: 5.2,
      magnesium_mg: 183,
      potassium_mg: 1392,
      zinc_mg: 2.8,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 456,
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
  { ing: "tiger-eye-bean", cell: "chia", template: "tenon-christmas-lima-chia-elevated", fromId: "christmas-lima" },
  { ing: "horse-gram", cell: "overnight-oats", template: "tenon-trout-bean-overnight-oats-elevated", fromId: "trout-bean" },
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
  out = out.replaceAll("Five thousand four hundred builds.", "Five thousand four hundred fifty builds.");
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
