#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 1151;
const baseBuilds = 1150;

const INGREDIENTS = [
  {
    id: "mustard",
    code: "ING-091",
    name: "Mustard",
    category: "spice",
    density: 1.05,
    fdc: "FDC 172234 · Mustard, prepared, yellow (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Prepared yellow mustard. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 60,
      protein_g: 3.74,
      fat_g: 3.34,
      saturated_fat_g: 0.21,
      carbohydrate_g: 5.83,
      sugars_g: 0.92,
      fibre_g: 3.3,
      sodium_mg: 1105,
      calcium_mg: 63,
      iron_mg: 1.61,
      magnesium_mg: 48,
      potassium_mg: 138,
      zinc_mg: 0.64,
      vitamin_a_ug: 5,
      vitamin_c_mg: 0.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1.4,
      vitamin_b12_ug: 0,
      folate_ug: 7,
      caffeine_mg: 0,
    },
  },
  {
    id: "basil",
    code: "ING-092",
    name: "Basil",
    category: "spice",
    density: 0.2,
    fdc: "FDC 172232 · Basil, fresh (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh basil. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 3.15,
      fat_g: 0.64,
      saturated_fat_g: 0.04,
      carbohydrate_g: 2.65,
      sugars_g: 0.3,
      fibre_g: 1.6,
      sodium_mg: 4,
      calcium_mg: 177,
      iron_mg: 3.17,
      magnesium_mg: 64,
      potassium_mg: 295,
      zinc_mg: 0.81,
      vitamin_a_ug: 264,
      vitamin_c_mg: 18,
      vitamin_d_ug: 0,
      vitamin_k_ug: 414.8,
      vitamin_b12_ug: 0,
      folate_ug: 68,
      caffeine_mg: 0,
    },
  },
  {
    id: "oregano",
    code: "ING-093",
    name: "Oregano",
    category: "spice",
    density: 0.3,
    fdc: "FDC 171328 · Spices, oregano, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dried oregano. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 265,
      protein_g: 9,
      fat_g: 4.28,
      saturated_fat_g: 1.55,
      carbohydrate_g: 68.92,
      sugars_g: 4.09,
      fibre_g: 42.5,
      sodium_mg: 25,
      calcium_mg: 1597,
      iron_mg: 36.8,
      magnesium_mg: 270,
      potassium_mg: 1260,
      zinc_mg: 2.69,
      vitamin_a_ug: 85,
      vitamin_c_mg: 2.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 621.7,
      vitamin_b12_ug: 0,
      folate_ug: 237,
      caffeine_mg: 0,
    },
  },
  {
    id: "paprika",
    code: "ING-094",
    name: "Paprika",
    category: "spice",
    density: 0.5,
    fdc: "FDC 171329 · Spices, paprika (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ground paprika. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 282,
      protein_g: 14.14,
      fat_g: 12.89,
      saturated_fat_g: 2.14,
      carbohydrate_g: 53.99,
      sugars_g: 10.34,
      fibre_g: 34.9,
      sodium_mg: 68,
      calcium_mg: 229,
      iron_mg: 21.14,
      magnesium_mg: 178,
      potassium_mg: 2280,
      zinc_mg: 4.33,
      vitamin_a_ug: 2463,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 49,
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
  { ing: "basil", cell: "chia", template: "tenon-corn-chia-elevated", fromId: "corn" },
  { ing: "paprika", cell: "overnight-oats", template: "tenon-black-bean-overnight-oats-elevated", fromId: "black-bean" },
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
  out = out.replaceAll(`One thousand one hundred fifty builds.`, "One thousand two hundred builds.");
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
