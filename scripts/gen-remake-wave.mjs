#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 901;
const baseBuilds = 900;

const INGREDIENTS = [
  {
    id: "plum",
    code: "ING-071",
    name: "Plum",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 169917 · Plums, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw plum. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 46,
      protein_g: 0.7,
      fat_g: 0.28,
      saturated_fat_g: 0.02,
      carbohydrate_g: 11.42,
      sugars_g: 9.92,
      fibre_g: 1.4,
      sodium_mg: 0,
      calcium_mg: 6,
      iron_mg: 0.17,
      magnesium_mg: 7,
      potassium_mg: 157,
      zinc_mg: 0.1,
      vitamin_a_ug: 17,
      vitamin_c_mg: 9.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 6.4,
      vitamin_b12_ug: 0,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "grape",
    code: "ING-072",
    name: "Grape",
    category: "fruit",
    density: 0.7,
    fdc: "FDC 174683 · Grapes, red or green, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw grapes. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 69,
      protein_g: 0.72,
      fat_g: 0.16,
      saturated_fat_g: 0.05,
      carbohydrate_g: 18.1,
      sugars_g: 15.48,
      fibre_g: 0.9,
      sodium_mg: 2,
      calcium_mg: 10,
      iron_mg: 0.36,
      magnesium_mg: 7,
      potassium_mg: 191,
      zinc_mg: 0.07,
      vitamin_a_ug: 3,
      vitamin_c_mg: 3.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 14.6,
      vitamin_b12_ug: 0,
      folate_ug: 2,
      caffeine_mg: 0,
    },
  },
  {
    id: "orange",
    code: "ING-073",
    name: "Orange",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 169097 · Oranges, raw, all commercial varieties (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw orange. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 47,
      protein_g: 0.94,
      fat_g: 0.12,
      saturated_fat_g: 0.02,
      carbohydrate_g: 11.75,
      sugars_g: 9.35,
      fibre_g: 2.4,
      sodium_mg: 0,
      calcium_mg: 40,
      iron_mg: 0.1,
      magnesium_mg: 10,
      potassium_mg: 181,
      zinc_mg: 0.07,
      vitamin_a_ug: 11,
      vitamin_c_mg: 53.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 0,
    },
  },
  {
    id: "cauliflower",
    code: "ING-074",
    name: "Cauliflower",
    category: "other",
    density: 0.4,
    fdc: "FDC 169986 · Cauliflower, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw cauliflower. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 1.92,
      fat_g: 0.28,
      saturated_fat_g: 0.06,
      carbohydrate_g: 4.97,
      sugars_g: 1.91,
      fibre_g: 2,
      sodium_mg: 30,
      calcium_mg: 22,
      iron_mg: 0.42,
      magnesium_mg: 15,
      potassium_mg: 299,
      zinc_mg: 0.27,
      vitamin_a_ug: 0,
      vitamin_c_mg: 48.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 15.5,
      vitamin_b12_ug: 0,
      folate_ug: 57,
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
  { ing: "plum", cell: "chia", template: "tenon-cherry-chia-elevated", fromId: "cherry" },
  { ing: "orange", cell: "overnight-oats", template: "tenon-fig-overnight-oats-elevated", fromId: "fig" },
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
    `code: ${kind === "build" ? "BLD" : "MNU"}-${String(codeNum).padStart(3, "0")}`,
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
    `code: ${kind === "build" ? "BLD" : "MNU"}-${String(codeNum).padStart(3, "0")}`,
  );
  out = out.replaceAll(`Elevated ${toId} cell`, `Elevated ${prose} cell`);
  out = out.replaceAll(`elevated ${toId}`, `elevated ${prose}`);
  out = out.replaceAll(`with elevated ${toId}`, `with elevated ${prose}`);
  out = out.replaceAll(`Nine hundred builds.`, "Nine hundred fifty builds.");
  return out;
}

let code = startCode;
for (const ing of INGREDIENTS) {
  writeFileSync(path.join(root, "ingredients", `${ing.id}.md`), ingredientMd(ing));
  console.log(`+ ingredient ${ing.id}`);
  for (const cell of CELLS) {
    const srcBuild = readFileSync(path.join(root, "builds", `tenon-raspberry-${cell}.md`), "utf8");
    const srcMenu = readFileSync(path.join(root, "menu", `tenon-raspberry-${cell}.md`), "utf8");
    writeFileSync(
      path.join(root, "builds", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcBuild, ing.id, ing.name, code, "build"),
    );
    writeFileSync(
      path.join(root, "menu", `tenon-${ing.id}-${cell}.md`),
      rewriteFromRaspberry(srcMenu, ing.id, ing.name, code, "menu"),
    );
    code += 1;
  }
}
for (const elev of ELEVATED) {
  const cellSlug = `${elev.cell}-elevated`;
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.template}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.template}.md`), "utf8");
  const meta = INGREDIENTS.find((i) => i.id === elev.ing);
  writeFileSync(
    path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcBuild, elev.fromId, elev.ing, meta.name, code, "build"),
  );
  writeFileSync(
    path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`),
    rewriteElevated(srcMenu, elev.fromId, elev.ing, meta.name, code, "menu"),
  );
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}
console.log(
  `done through BLD-${code - 1}; expected builds ${baseBuilds + INGREDIENTS.length * CELLS.length + ELEVATED.length}`,
);
