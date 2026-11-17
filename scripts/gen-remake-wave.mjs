#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 12441;
const baseBuilds = 12440;
const proseCount = "Twelve thousand four hundred ninety builds.";

const INGREDIENTS = [
  {
    id: "matcha-culinary",
    code: "ING-1006",
    name: "Matcha Culinary",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as culinary matcha proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Culinary-grade matcha. Nutrition uses matcha powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 324,
      protein_g: 30,
      fat_g: 5,
      saturated_fat_g: 0.7,
      carbohydrate_g: 39,
      sugars_g: 0,
      fibre_g: 38,
      sodium_mg: 6,
      calcium_mg: 429,
      iron_mg: 17,
      magnesium_mg: 230,
      potassium_mg: 2700,
      zinc_mg: 3,
      vitamin_a_ug: 2950,
      vitamin_c_mg: 60,
      vitamin_d_ug: 0,
      vitamin_k_ug: 1400,
      vitamin_b12_ug: 0,
      folate_ug: 100,
      caffeine_mg: 2200,
    },
  },
  {
    id: "hojicha-powder",
    code: "ING-1007",
    name: "Hojicha Powder",
    category: "spice",
    density: 0.4,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as roasted hojicha powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hojicha powder (roasted green tea). Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 25,
      fat_g: 4,
      saturated_fat_g: 0.5,
      carbohydrate_g: 40,
      sugars_g: 0,
      fibre_g: 35,
      sodium_mg: 10,
      calcium_mg: 350,
      iron_mg: 12,
      magnesium_mg: 180,
      potassium_mg: 2000,
      zinc_mg: 2.5,
      vitamin_a_ug: 500,
      vitamin_c_mg: 10,
      vitamin_d_ug: 0,
      vitamin_k_ug: 800,
      vitamin_b12_ug: 0,
      folate_ug: 60,
      caffeine_mg: 400,
    },
  },
  {
    id: "genmaicha-powder",
    code: "ING-1008",
    name: "Genmaicha Powder",
    category: "spice",
    density: 0.45,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) blended with brown rice as genmaicha powder proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Genmaicha powder (green tea + roasted rice). Nutrition uses matcha powder as closest SR Legacy tea-powder proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 310,
      protein_g: 20,
      fat_g: 3,
      saturated_fat_g: 0.5,
      carbohydrate_g: 50,
      sugars_g: 0.5,
      fibre_g: 30,
      sodium_mg: 8,
      calcium_mg: 300,
      iron_mg: 10,
      magnesium_mg: 150,
      potassium_mg: 1800,
      zinc_mg: 2,
      vitamin_a_ug: 800,
      vitamin_c_mg: 20,
      vitamin_d_ug: 0,
      vitamin_k_ug: 600,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 800,
    },
  },
  {
    id: "jasmine-pearls",
    code: "ING-1009",
    name: "Jasmine Pearls",
    category: "spice",
    density: 0.35,
    fdc: "FDC 174873 · Tea, green, matcha, powder (SR Legacy) as jasmine pearl tea proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Jasmine pearl tea (scented green tea). Nutrition uses matcha powder as closest SR Legacy tea proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 280,
      protein_g: 18,
      fat_g: 2,
      saturated_fat_g: 0.3,
      carbohydrate_g: 45,
      sugars_g: 0,
      fibre_g: 30,
      sodium_mg: 5,
      calcium_mg: 250,
      iron_mg: 8,
      magnesium_mg: 120,
      potassium_mg: 1500,
      zinc_mg: 1.5,
      vitamin_a_ug: 600,
      vitamin_c_mg: 15,
      vitamin_d_ug: 0,
      vitamin_k_ug: 400,
      vitamin_b12_ug: 0,
      folate_ug: 40,
      caffeine_mg: 1500,
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
  { ing: "hojicha-powder", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "matcha-culinary", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
