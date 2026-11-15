#!/usr/bin/env node
/**
 * Clone the raspberry 12-chassis remake matrix for new ingredients.
 * Usage: node scripts/gen-remake-wave.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 751; // BLD / MNU

const INGREDIENTS = [
  {
    id: "pear",
    code: "ING-059",
    name: "Pear",
    category: "fruit",
    density: 0.6,
    fdc: "FDC 169118 · Pears, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw pear. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 57,
      protein_g: 0.36,
      fat_g: 0.14,
      saturated_fat_g: 0.02,
      carbohydrate_g: 15.23,
      sugars_g: 9.75,
      fibre_g: 3.1,
      sodium_mg: 1,
      calcium_mg: 9,
      iron_mg: 0.18,
      magnesium_mg: 7,
      potassium_mg: 116,
      zinc_mg: 0.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 4.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.5,
      vitamin_b12_ug: 0,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "blackberry",
    code: "ING-060",
    name: "Blackberry",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 173946 · Blackberries, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw blackberries. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 43,
      protein_g: 1.39,
      fat_g: 0.49,
      saturated_fat_g: 0.01,
      carbohydrate_g: 9.61,
      sugars_g: 4.88,
      fibre_g: 5.3,
      sodium_mg: 1,
      calcium_mg: 29,
      iron_mg: 0.62,
      magnesium_mg: 20,
      potassium_mg: 162,
      zinc_mg: 0.53,
      vitamin_a_ug: 11,
      vitamin_c_mg: 21,
      vitamin_d_ug: 0,
      vitamin_k_ug: 19.8,
      vitamin_b12_ug: 0,
      folate_ug: 25,
      caffeine_mg: 0,
    },
  },
  {
    id: "mango",
    code: "ING-061",
    name: "Mango",
    category: "fruit",
    density: 0.65,
    fdc: "FDC 169910 · Mangos, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw mango. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 60,
      protein_g: 0.82,
      fat_g: 0.38,
      saturated_fat_g: 0.09,
      carbohydrate_g: 14.98,
      sugars_g: 13.66,
      fibre_g: 1.6,
      sodium_mg: 1,
      calcium_mg: 11,
      iron_mg: 0.16,
      magnesium_mg: 10,
      potassium_mg: 168,
      zinc_mg: 0.09,
      vitamin_a_ug: 54,
      vitamin_c_mg: 36.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 4.2,
      vitamin_b12_ug: 0,
      folate_ug: 43,
      caffeine_mg: 0,
    },
  },
  {
    id: "carrot",
    code: "ING-062",
    name: "Carrot",
    category: "other",
    density: 0.64,
    fdc: "FDC 170393 · Carrots, raw (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw carrot. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 41,
      protein_g: 0.93,
      fat_g: 0.24,
      saturated_fat_g: 0.04,
      carbohydrate_g: 9.58,
      sugars_g: 4.74,
      fibre_g: 2.8,
      sodium_mg: 69,
      calcium_mg: 33,
      iron_mg: 0.3,
      magnesium_mg: 12,
      potassium_mg: 320,
      zinc_mg: 0.24,
      vitamin_a_ug: 835,
      vitamin_c_mg: 5.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 13.2,
      vitamin_b12_ug: 0,
      folate_ug: 19,
      caffeine_mg: 0,
    },
  },
];

// Chassis slug suffixes cloned from raspberry matrix (order → sequential codes)
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
  { ing: "blackberry", cell: "chia", parentSlug: "tenon-raspberry-chia-elevated" },
  { ing: "mango", cell: "overnight-oats", parentSlug: "tenon-hemp-seed-overnight-oats-elevated" },
];

function titleCase(id) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ingredientMd(ing) {
  const n = ing.nutrition;
  const lines = Object.entries(n)
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
  let out = src;
  out = out.replaceAll("tenon-raspberry-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("raspberry", ingId === "raspberry" ? "raspberry" : ingId);
  // Fix display phrases that used raw id instead of name for multi-word... single ids OK
  out = out.replaceAll(`ingredient/${ingId}`, `ingredient/${ingId}`);
  if (kind === "build") {
    out = out.replace(/code: BLD-\d+/, `code: BLD-${String(codeNum).padStart(3, "0")}`);
  } else {
    out = out.replace(/code: MNU-\d+/, `code: MNU-${String(codeNum).padStart(3, "0")}`);
  }
  // Humanise action lines that still say "raspberry" via id (already replaced with id)
  // Prefer readable name in prose for carrot/pear etc.
  const prose = displayName.toLowerCase();
  if (ingId !== prose.replaceAll(" ", "-")) {
    /* ids are single tokens */
  }
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

let code = startCode;

for (const ing of INGREDIENTS) {
  writeFileSync(path.join(root, "ingredients", `${ing.id}.md`), ingredientMd(ing));
  console.log(`+ ingredient ${ing.id}`);

  for (const cell of CELLS) {
    const srcBuild = readFileSync(path.join(root, "builds", `tenon-raspberry-${cell}.md`), "utf8");
    const srcMenu = readFileSync(path.join(root, "menu", `tenon-raspberry-${cell}.md`), "utf8");
    const buildOut = rewriteFromRaspberry(srcBuild, ing.id, ing.name, code, "build");
    const menuOut = rewriteFromRaspberry(srcMenu, ing.id, ing.name, code, "menu");
    writeFileSync(path.join(root, "builds", `tenon-${ing.id}-${cell}.md`), buildOut);
    writeFileSync(path.join(root, "menu", `tenon-${ing.id}-${cell}.md`), menuOut);
    code += 1;
  }
}

for (const elev of ELEVATED) {
  const srcBuild = readFileSync(path.join(root, "builds", `${elev.parentSlug}.md`), "utf8");
  const srcMenu = readFileSync(path.join(root, "menu", `${elev.parentSlug}.md`), "utf8");
  const cellSlug = `${elev.cell}-elevated`;
  const title = titleCase(elev.ing);
  let buildOut = srcBuild
    .replaceAll(elev.parentSlug.replace("tenon-", "tenon-"), `tenon-${elev.ing}-${cellSlug}`)
    .replace(/id: .*/, `id: tenon-${elev.ing}-${cellSlug}`)
    .replace(/code: BLD-\d+/, `code: BLD-${String(code).padStart(3, "0")}`)
    .replace(/name: .*/, `name: Tenon ${title} ${titleCase(elev.cell)} Elevated`);
  // More careful rewrite from elevated templates
  if (elev.parentSlug.includes("raspberry")) {
    buildOut = rewriteFromRaspberry(srcBuild, elev.ing, title, code, "build");
    buildOut = buildOut
      .replace(`tenon-${elev.ing}-chia-elevated`, `tenon-${elev.ing}-${cellSlug}`)
      .replace(`Tenon ${title} Chia Elevated`, `Tenon ${title} ${titleCase(elev.cell)} Elevated`)
      .replace(/Elevated raspberry cell/, `Elevated ${elev.ing} cell`)
      .replace(/elevated raspberry/, `elevated ${elev.ing}`)
      .replace(/with elevated raspberry/, `with elevated ${elev.ing}`);
  } else {
    // hemp elevated → mango oats elevated
    buildOut = srcBuild
      .replaceAll("hemp-seed", elev.ing)
      .replaceAll("Hemp Seed", title)
      .replace(/code: BLD-\d+/, `code: BLD-${String(code).padStart(3, "0")}`)
      .replace(/Elevated hemp seed cell/, `Elevated ${elev.ing} cell`)
      .replace(/elevated hemp seed/, `elevated ${elev.ing}`)
      .replace(/Seven hundred fifty builds\./, "Eight hundred builds.");
  }
  let menuOut;
  if (elev.parentSlug.includes("raspberry")) {
    menuOut = rewriteFromRaspberry(srcMenu, elev.ing, title, code, "menu");
  } else {
    menuOut = srcMenu
      .replaceAll("hemp-seed", elev.ing)
      .replaceAll("Hemp Seed", title)
      .replace(/code: MNU-\d+/, `code: MNU-${String(code).padStart(3, "0")}`);
  }
  writeFileSync(path.join(root, "builds", `tenon-${elev.ing}-${cellSlug}.md`), buildOut);
  writeFileSync(path.join(root, "menu", `tenon-${elev.ing}-${cellSlug}.md`), menuOut);
  console.log(`+ elevated ${elev.ing}-${cellSlug} BLD-${code}`);
  code += 1;
}

console.log(`done through BLD-${code - 1}; expected builds ${750 + INGREDIENTS.length * CELLS.length + ELEVATED.length}`);
