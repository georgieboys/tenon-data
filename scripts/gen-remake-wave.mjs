#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4501;
const baseBuilds = 4500;

const INGREDIENTS = [
  {
    id: "chinese-celery",
    code: "ING-365",
    name: "Chinese Celery",
    category: "spice",
    density: 0.4,
    fdc: "FDC 169988 · Celery, raw (SR Legacy) as Chinese celery / leaf celery proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh Chinese celery (leaf celery). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 16,
      protein_g: 0.7,
      fat_g: 0.2,
      saturated_fat_g: 0.04,
      carbohydrate_g: 3.0,
      sugars_g: 1.3,
      fibre_g: 1.6,
      sodium_mg: 80,
      calcium_mg: 40,
      iron_mg: 0.2,
      magnesium_mg: 11,
      potassium_mg: 260,
      zinc_mg: 0.1,
      vitamin_a_ug: 22,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 29.0,
      vitamin_b12_ug: 0,
      folate_ug: 36,
      caffeine_mg: 0,
    },
  },
  {
    id: "guava-leaf",
    code: "ING-366",
    name: "Guava Leaf",
    category: "spice",
    density: 0.3,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as guava leaf tea herb proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh or dried guava leaf. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 35,
      protein_g: 2.5,
      fat_g: 0.5,
      saturated_fat_g: 0.05,
      carbohydrate_g: 6.0,
      sugars_g: 0.5,
      fibre_g: 3.5,
      sodium_mg: 5,
      calcium_mg: 150,
      iron_mg: 2.0,
      magnesium_mg: 40,
      potassium_mg: 300,
      zinc_mg: 0.4,
      vitamin_a_ug: 80,
      vitamin_c_mg: 40.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 100.0,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 0,
    },
  },
  {
    id: "banana-blossom",
    code: "ING-367",
    name: "Banana Blossom",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 173944 · Artichokes, (globe or french), raw (SR Legacy) as banana blossom / heart proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh banana blossom (banana flower). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 50,
      protein_g: 2.0,
      fat_g: 0.3,
      saturated_fat_g: 0.05,
      carbohydrate_g: 11.0,
      sugars_g: 2.0,
      fibre_g: 5.0,
      sodium_mg: 40,
      calcium_mg: 50,
      iron_mg: 1.0,
      magnesium_mg: 40,
      potassium_mg: 350,
      zinc_mg: 0.4,
      vitamin_a_ug: 15,
      vitamin_c_mg: 10.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 15.0,
      vitamin_b12_ug: 0,
      folate_ug: 60,
      caffeine_mg: 0,
    },
  },
  {
    id: "young-coconut",
    code: "ING-368",
    name: "Young Coconut",
    category: "fruit",
    density: 1.0,
    fdc: "FDC 170174 · Nuts, coconut meat, raw (SR Legacy) as young coconut meat proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh young coconut meat. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 80,
      protein_g: 1.5,
      fat_g: 5.0,
      saturated_fat_g: 4.5,
      carbohydrate_g: 8.0,
      sugars_g: 4.0,
      fibre_g: 2.5,
      sodium_mg: 20,
      calcium_mg: 20,
      iron_mg: 0.8,
      magnesium_mg: 30,
      potassium_mg: 250,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 3.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.2,
      vitamin_b12_ug: 0,
      folate_ug: 20,
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
  { ing: "chinese-celery", cell: "chia", template: "tenon-calamansi-chia-elevated", fromId: "calamansi" },
  { ing: "young-coconut", cell: "overnight-oats", template: "tenon-garlic-chive-overnight-oats-elevated", fromId: "garlic-chive" },
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
  out = out.replaceAll("Four thousand five hundred builds.", "Four thousand five hundred fifty builds.");
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
