#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 13941;
const baseBuilds = 13940;
const proseCount = "Thirteen thousand nine hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "almond-powder",
    code: "ING-1126",
    name: "Almond Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170567 · Nuts, almonds, blanched (SR Legacy) as almond powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Almond powder (distinct from almond flour). Contains tree nut. Nutrition uses SR Legacy blanched almond until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 590,
      protein_g: 21.4,
      fat_g: 52.5,
      saturated_fat_g: 4,
      carbohydrate_g: 18.7,
      sugars_g: 4.6,
      fibre_g: 9.9,
      sodium_mg: 19,
      calcium_mg: 236,
      iron_mg: 3.3,
      magnesium_mg: 268,
      potassium_mg: 659,
      zinc_mg: 3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 49,
      caffeine_mg: 0,
    },
  },
  {
    id: "macadamia-powder",
    code: "ING-1127",
    name: "Macadamia Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170178 · Nuts, macadamia nuts, raw (SR Legacy) as macadamia powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Macadamia powder (distinct from whole macadamia). Contains tree nut. Nutrition uses SR Legacy macadamia until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 718,
      protein_g: 7.9,
      fat_g: 75.8,
      saturated_fat_g: 12.1,
      carbohydrate_g: 13.8,
      sugars_g: 4.6,
      fibre_g: 8.6,
      sodium_mg: 5,
      calcium_mg: 85,
      iron_mg: 3.7,
      magnesium_mg: 130,
      potassium_mg: 368,
      zinc_mg: 1.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 1.2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 11,
      caffeine_mg: 0,
    },
  },
  {
    id: "pistachio-powder",
    code: "ING-1128",
    name: "Pistachio Powder",
    category: "nut_seed",
    density: 0.5,
    fdc: "FDC 170184 · Nuts, pistachio nuts, raw (SR Legacy) as pistachio powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Pistachio powder (distinct from whole pistachio). Contains tree nut. Nutrition uses SR Legacy pistachio until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 560,
      protein_g: 20.2,
      fat_g: 45.3,
      saturated_fat_g: 5.9,
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
  {
    id: "pine-nut-powder",
    code: "ING-1129",
    name: "Pine Nut Powder",
    category: "nut_seed",
    density: 0.55,
    fdc: "FDC 170591 · Nuts, pine nuts, dried (SR Legacy) as pine nut powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[tree_nut]",
    note: "Pine nut powder (distinct from whole pine nut). Contains tree nut. Nutrition uses SR Legacy dried pine nut until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
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
  { ing: "almond-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "pistachio-powder", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  let out = src.replaceAll("raspberry", "__ING__");
  out = out.replaceAll("tenon-__ING__-", `tenon-${ingId}-`);
  out = out.replaceAll("Tenon __ING__ ", `Tenon ${title} `);
  out = out.replaceAll("Tenon Raspberry ", `Tenon ${title} `);
  out = out.replaceAll("__ING__", ingId);
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", proseCount);
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
