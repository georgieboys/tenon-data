#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 5901;
const baseBuilds = 5900;

const INGREDIENTS = [
  {
    id: "pine-nut",
    code: "ING-480",
    name: "Pine Nut",
    category: "nut_seed",
    density: 0.6,
    fdc: "FDC 170591 · Nuts, pine nuts, dried (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Dried pine nuts. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 673,
      protein_g: 13.7,
      fat_g: 68.4,
      saturated_fat_g: 4.9,
      carbohydrate_g: 13.1,
      sugars_g: 3.6,
      fibre_g: 3.7,
      sodium_mg: 2,
      calcium_mg: 16,
      iron_mg: 5.5,
      magnesium_mg: 251,
      potassium_mg: 597,
      zinc_mg: 6.5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 0.8,
      vitamin_d_ug: 0,
      vitamin_k_ug: 53.9,
      vitamin_b12_ug: 0,
      folate_ug: 34,
      caffeine_mg: 0,
    },
  },
  {
    id: "hazelnut-butter",
    code: "ING-481",
    name: "Hazelnut Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170581 · Nuts, hazelnuts or filberts (SR Legacy) as hazelnut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Plain hazelnut butter. Nutrition uses whole hazelnut proxy until a dedicated butter FDC row or café CoA lands. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 628,
      protein_g: 15.0,
      fat_g: 60.8,
      saturated_fat_g: 4.5,
      carbohydrate_g: 16.7,
      sugars_g: 4.3,
      fibre_g: 9.7,
      sodium_mg: 0,
      calcium_mg: 114,
      iron_mg: 4.7,
      magnesium_mg: 163,
      potassium_mg: 680,
      zinc_mg: 2.5,
      vitamin_a_ug: 1,
      vitamin_c_mg: 6.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 14.2,
      vitamin_b12_ug: 0,
      folate_ug: 113,
      caffeine_mg: 0,
    },
  },
  {
    id: "walnut-butter",
    code: "ING-482",
    name: "Walnut Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170187 · Nuts, walnuts, english (SR Legacy) as walnut butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Plain walnut butter. Nutrition uses english walnut proxy until a dedicated butter FDC row or café CoA lands. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 654,
      protein_g: 15.2,
      fat_g: 65.2,
      saturated_fat_g: 6.1,
      carbohydrate_g: 13.7,
      sugars_g: 2.6,
      fibre_g: 6.7,
      sodium_mg: 2,
      calcium_mg: 98,
      iron_mg: 2.9,
      magnesium_mg: 158,
      potassium_mg: 441,
      zinc_mg: 3.1,
      vitamin_a_ug: 1,
      vitamin_c_mg: 1.3,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2.7,
      vitamin_b12_ug: 0,
      folate_ug: 98,
      caffeine_mg: 0,
    },
  },
  {
    id: "pistachio-butter",
    code: "ING-483",
    name: "Pistachio Butter",
    category: "nut_seed",
    density: 1.04,
    fdc: "FDC 170184 · Nuts, pistachio nuts, raw (SR Legacy) as pistachio butter proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Plain pistachio butter. Nutrition uses raw pistachio proxy until a dedicated butter FDC row or café CoA lands. Tree nut allergen. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 560,
      protein_g: 20.2,
      fat_g: 45.3,
      saturated_fat_g: 5.6,
      carbohydrate_g: 27.2,
      sugars_g: 7.7,
      fibre_g: 10.6,
      sodium_mg: 1,
      calcium_mg: 105,
      iron_mg: 3.9,
      magnesium_mg: 121,
      potassium_mg: 1025,
      zinc_mg: 2.2,
      vitamin_a_ug: 26,
      vitamin_c_mg: 5.6,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 51,
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
  { ing: "pine-nut", cell: "chia", template: "tenon-vialone-nano-chia-elevated", fromId: "vialone-nano" },
  { ing: "pistachio-butter", cell: "overnight-oats", template: "tenon-jasmine-brown-rice-overnight-oats-elevated", fromId: "jasmine-brown-rice" },
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
  out = out.replaceAll("Five thousand nine hundred builds.", "Five thousand nine hundred fifty builds.");
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
