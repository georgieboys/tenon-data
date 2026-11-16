#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10515;
const baseBuilds = 10514;

const INGREDIENTS = [
  {
    id: "pickles-dill",
    code: "ING-850",
    name: "Pickles Dill",
    category: "other",
    density: 0.95,
    fdc: "FDC 168416 · Pickles, cucumber, dill, low sodium (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dill pickles. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 12,
      protein_g: 0.5,
      fat_g: 0.3,
      saturated_fat_g: 0.1,
      carbohydrate_g: 2.3,
      sugars_g: 1.1,
      fibre_g: 1.0,
      sodium_mg: 405,
      calcium_mg: 30,
      iron_mg: 0.3,
      magnesium_mg: 7,
      potassium_mg: 100,
      zinc_mg: 0.1,
      vitamin_a_ug: 10,
      vitamin_c_mg: 2.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 20,
      vitamin_b12_ug: 0,
      folate_ug: 5,
      caffeine_mg: 0,
    },
  },
  {
    id: "mirin-hon",
    code: "ING-851",
    name: "Mirin Hon",
    category: "other",
    density: 1.1,
    fdc: "FDC 168820 · Sugars, brown (SR Legacy) as hon mirin proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hon mirin (true mirin). Nutrition uses sweet rice-wine proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 230,
      protein_g: 0.3,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 45.0,
      sugars_g: 40.0,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 5,
      potassium_mg: 20,
      zinc_mg: 0.1,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "rice-vinegar-seasoned",
    code: "ING-852",
    name: "Rice Vinegar Seasoned",
    category: "other",
    density: 1.05,
    fdc: "FDC 172241 · Vinegar, distilled (SR Legacy) as seasoned rice vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Seasoned rice vinegar. Nutrition uses distilled vinegar proxy with sugar adjustment until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 50,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 12.0,
      sugars_g: 10.0,
      fibre_g: 0,
      sodium_mg: 800,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 3,
      potassium_mg: 10,
      zinc_mg: 0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "umeboshi-paste",
    code: "ING-853",
    name: "Umeboshi Paste",
    category: "fruit",
    density: 1.1,
    fdc: "FDC 168167 · Plums, dried (prunes), uncooked (SR Legacy) as umeboshi paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Umeboshi paste. Nutrition uses dried plum proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 80,
      protein_g: 1.0,
      fat_g: 0.5,
      saturated_fat_g: 0,
      carbohydrate_g: 18.0,
      sugars_g: 10.0,
      fibre_g: 3.0,
      sodium_mg: 4500,
      calcium_mg: 40,
      iron_mg: 1.0,
      magnesium_mg: 20,
      potassium_mg: 300,
      zinc_mg: 0.3,
      vitamin_a_ug: 20,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
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
  { ing: "pickles-dill", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "umeboshi-paste", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand five hundred sixty-four builds.");
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
