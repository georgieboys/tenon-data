#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1751;
const baseBuilds = 1750;

const INGREDIENTS = [
  {
    id: "freekeh",
    code: "ING-140",
    name: "Freekeh",
    category: "grain",
    density: 0.7,
    fdc: "FDC 169744 · Wheat, durum (SR Legacy) used as freekeh proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Freekeh (durum wheat proxy; fibre from whole-wheat SR). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 339,
      protein_g: 13.68,
      fat_g: 2.47,
      saturated_fat_g: 0.45,
      carbohydrate_g: 71.13,
      sugars_g: 0,
      fibre_g: 12.2,
      sodium_mg: 2,
      calcium_mg: 34,
      iron_mg: 3.52,
      magnesium_mg: 144,
      potassium_mg: 431,
      zinc_mg: 4.16,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 43,
      caffeine_mg: 0,
    },
  },
  {
    id: "bulgur",
    code: "ING-141",
    name: "Bulgur",
    category: "grain",
    density: 0.7,
    fdc: "FDC 170286 · Bulgur, dry (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dry bulgur. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 342,
      protein_g: 12.29,
      fat_g: 1.33,
      saturated_fat_g: 0.23,
      carbohydrate_g: 75.87,
      sugars_g: 0.41,
      fibre_g: 12.5,
      sodium_mg: 17,
      calcium_mg: 35,
      iron_mg: 2.46,
      magnesium_mg: 164,
      potassium_mg: 410,
      zinc_mg: 1.93,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.9,
      vitamin_b12_ug: 0,
      folate_ug: 27,
      caffeine_mg: 0,
    },
  },
  {
    id: "couscous",
    code: "ING-142",
    name: "Couscous",
    category: "grain",
    density: 0.65,
    fdc: "FDC 169700 · Couscous, dry (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dry couscous. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 376,
      protein_g: 12.76,
      fat_g: 0.64,
      saturated_fat_g: 0.09,
      carbohydrate_g: 77.43,
      sugars_g: 0,
      fibre_g: 5,
      sodium_mg: 10,
      calcium_mg: 24,
      iron_mg: 1.47,
      magnesium_mg: 44,
      potassium_mg: 166,
      zinc_mg: 0.83,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "polenta",
    code: "ING-143",
    name: "Polenta",
    category: "grain",
    density: 0.7,
    fdc: "FDC 168866 · Cornmeal, whole-grain, yellow (SR Legacy) used as polenta proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Polenta (yellow whole-grain cornmeal proxy). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 362,
      protein_g: 8.12,
      fat_g: 3.59,
      saturated_fat_g: 0.45,
      carbohydrate_g: 76.89,
      sugars_g: 0.64,
      fibre_g: 7.3,
      sodium_mg: 35,
      calcium_mg: 6,
      iron_mg: 3.45,
      magnesium_mg: 127,
      potassium_mg: 287,
      zinc_mg: 1.82,
      vitamin_a_ug: 11,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.3,
      vitamin_b12_ug: 0,
      folate_ug: 25,
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
  { ing: "freekeh", cell: "chia", template: "tenon-rye-chia-elevated", fromId: "rye" },
  { ing: "polenta", cell: "overnight-oats", template: "tenon-farro-overnight-oats-elevated", fromId: "farro" },
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
  out = out.replaceAll("One thousand seven hundred fifty builds.", "One thousand eight hundred builds.");
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
