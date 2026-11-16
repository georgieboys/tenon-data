#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 7665;
const baseBuilds = 7664;

const INGREDIENTS = [
  {
    id: "chipotle-powder",
    code: "ING-622",
    name: "Chipotle Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170932 · Spices, pepper, red or cayenne (SR Legacy) as chipotle powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Chipotle powder. Nutrition uses cayenne proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 318,
      protein_g: 12.0,
      fat_g: 17.3,
      saturated_fat_g: 3.3,
      carbohydrate_g: 56.6,
      sugars_g: 10.3,
      fibre_g: 27.2,
      sodium_mg: 30,
      calcium_mg: 148,
      iron_mg: 7.8,
      magnesium_mg: 152,
      potassium_mg: 2010,
      zinc_mg: 2.5,
      vitamin_a_ug: 2081,
      vitamin_c_mg: 76.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.4,
      vitamin_b12_ug: 0,
      folate_ug: 106,
      caffeine_mg: 0,
    },
  },
  {
    id: "ancho-powder",
    code: "ING-623",
    name: "Ancho Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 171328 · Spices, paprika (SR Legacy) as ancho powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Ancho chile powder. Nutrition uses paprika proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 282,
      protein_g: 14.1,
      fat_g: 12.9,
      saturated_fat_g: 2.1,
      carbohydrate_g: 53.9,
      sugars_g: 10.3,
      fibre_g: 34.9,
      sodium_mg: 68,
      calcium_mg: 229,
      iron_mg: 21.1,
      magnesium_mg: 178,
      potassium_mg: 2280,
      zinc_mg: 4.3,
      vitamin_a_ug: 2463,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "guajillo-powder",
    code: "ING-624",
    name: "Guajillo Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 171328 · Spices, paprika (SR Legacy) as guajillo powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Guajillo chile powder. Nutrition uses paprika proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 282,
      protein_g: 14.1,
      fat_g: 12.9,
      saturated_fat_g: 2.1,
      carbohydrate_g: 53.9,
      sugars_g: 10.3,
      fibre_g: 34.9,
      sodium_mg: 68,
      calcium_mg: 229,
      iron_mg: 21.1,
      magnesium_mg: 178,
      potassium_mg: 2280,
      zinc_mg: 4.3,
      vitamin_a_ug: 2463,
      vitamin_c_mg: 0.9,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.3,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "urfa-biber",
    code: "ING-625",
    name: "Urfa Biber",
    category: "spice",
    density: 0.45,
    fdc: "FDC 170932 · Spices, pepper, red or cayenne (SR Legacy) as urfa biber proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Urfa biber (isot) chile flakes. Nutrition uses cayenne proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 318,
      protein_g: 12.0,
      fat_g: 17.3,
      saturated_fat_g: 3.3,
      carbohydrate_g: 56.6,
      sugars_g: 10.3,
      fibre_g: 27.2,
      sodium_mg: 30,
      calcium_mg: 148,
      iron_mg: 7.8,
      magnesium_mg: 152,
      potassium_mg: 2010,
      zinc_mg: 2.5,
      vitamin_a_ug: 2081,
      vitamin_c_mg: 76.4,
      vitamin_d_ug: 0,
      vitamin_k_ug: 80.4,
      vitamin_b12_ug: 0,
      folate_ug: 106,
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
  { ing: "chipotle-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "urfa-biber", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  const diet = ing.diet || { plant_based: true, vegetarian: true };
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
  plant_based: ${diet.plant_based}
  vegetarian: ${diet.vegetarian}
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Seven thousand seven hundred fourteen builds.");
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
