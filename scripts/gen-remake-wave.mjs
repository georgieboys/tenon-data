#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4401;
const baseBuilds = 4400;

const INGREDIENTS = [
  {
    id: "sansho",
    code: "ING-357",
    name: "Sansho",
    category: "spice",
    density: 0.4,
    fdc: "FDC 170931 · Spices, pepper, black (SR Legacy) as sansho / Japanese pepper proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried sansho (Japanese pepper) berry. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 255,
      protein_g: 10.0,
      fat_g: 3.3,
      saturated_fat_g: 1.0,
      carbohydrate_g: 64.0,
      sugars_g: 0.6,
      fibre_g: 25.0,
      sodium_mg: 20,
      calcium_mg: 440,
      iron_mg: 9.7,
      magnesium_mg: 170,
      potassium_mg: 1300,
      zinc_mg: 1.2,
      vitamin_a_ug: 15,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 160.0,
      vitamin_b12_ug: 0,
      folate_ug: 17,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-cardamom",
    code: "ING-358",
    name: "Black Cardamom",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170920 · Spices, cardamom (SR Legacy) as black cardamom / Amomum proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried black cardamom pods. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 311,
      protein_g: 11.0,
      fat_g: 6.7,
      saturated_fat_g: 0.7,
      carbohydrate_g: 68.0,
      sugars_g: 0,
      fibre_g: 28.0,
      sodium_mg: 18,
      calcium_mg: 383,
      iron_mg: 14.0,
      magnesium_mg: 229,
      potassium_mg: 1119,
      zinc_mg: 7.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 21.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "amchur",
    code: "ING-359",
    name: "Amchur",
    category: "spice",
    density: 0.55,
    fdc: "FDC 169910 · Mangos, raw (SR Legacy) as amchur / dried green mango powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried green mango powder (amchur). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 280,
      protein_g: 2.0,
      fat_g: 1.0,
      saturated_fat_g: 0.2,
      carbohydrate_g: 70.0,
      sugars_g: 40.0,
      fibre_g: 10.0,
      sodium_mg: 20,
      calcium_mg: 100,
      iron_mg: 3.0,
      magnesium_mg: 40,
      potassium_mg: 600,
      zinc_mg: 0.5,
      vitamin_a_ug: 50,
      vitamin_c_mg: 30.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "kokum",
    code: "ING-360",
    name: "Kokum",
    category: "spice",
    density: 0.5,
    fdc: "FDC 168462 · Cranberries, raw (SR Legacy) as kokum / Garcinia indica tart proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried kokum (Garcinia indica) rind. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 60,
      protein_g: 0.5,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 14.0,
      sugars_g: 5.0,
      fibre_g: 5.0,
      sodium_mg: 5,
      calcium_mg: 50,
      iron_mg: 1.0,
      magnesium_mg: 20,
      potassium_mg: 150,
      zinc_mg: 0.2,
      vitamin_a_ug: 10,
      vitamin_c_mg: 15.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5.0,
      vitamin_b12_ug: 0,
      folate_ug: 5,
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
  { ing: "sansho", cell: "chia", template: "tenon-chamomile-chia-elevated", fromId: "chamomile" },
  { ing: "kokum", cell: "overnight-oats", template: "tenon-green-peppercorn-overnight-oats-elevated", fromId: "green-peppercorn" },
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
  out = out.replaceAll("Four thousand four hundred builds.", "Four thousand four hundred fifty builds.");
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
