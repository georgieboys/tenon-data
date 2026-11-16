#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10465;
const baseBuilds = 10464;

const INGREDIENTS = [
  {
    id: "fermented-black-bean-paste",
    code: "ING-846",
    name: "Fermented Black Bean Paste",
    category: "other",
    density: 1.15,
    fdc: "FDC 172442 · Miso (SR Legacy) as fermented black bean paste proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Fermented black bean paste (douchi paste). Contains soy. Nutrition uses miso proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 180,
      protein_g: 12.0,
      fat_g: 5.0,
      saturated_fat_g: 0.8,
      carbohydrate_g: 20.0,
      sugars_g: 3.0,
      fibre_g: 5.0,
      sodium_mg: 4500,
      calcium_mg: 80,
      iron_mg: 3.0,
      magnesium_mg: 50,
      potassium_mg: 300,
      zinc_mg: 2.0,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 30,
      caffeine_mg: 0,
    },
  },
  {
    id: "gochujang-mild",
    code: "ING-847",
    name: "Gochujang Mild",
    category: "other",
    density: 1.2,
    fdc: "FDC 172442 · Miso (SR Legacy) as mild gochujang proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy, gluten]",
    note: "Mild gochujang. Contains soy and wheat (gluten). Nutrition uses miso proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 220,
      protein_g: 5.0,
      fat_g: 2.0,
      saturated_fat_g: 0.3,
      carbohydrate_g: 45.0,
      sugars_g: 25.0,
      fibre_g: 3.0,
      sodium_mg: 2500,
      calcium_mg: 30,
      iron_mg: 1.5,
      magnesium_mg: 30,
      potassium_mg: 200,
      zinc_mg: 0.5,
      vitamin_a_ug: 200,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 15,
      caffeine_mg: 0,
    },
  },
  {
    id: "kimchi-napa",
    code: "ING-848",
    name: "Kimchi Napa",
    category: "other",
    density: 0.9,
    fdc: "FDC 169238 · Cabbage, kimchi (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Napa cabbage kimchi. May contain fish sauce in some recipes; open lab cell uses vegetable-only proxy until café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 15,
      protein_g: 1.1,
      fat_g: 0.5,
      saturated_fat_g: 0.1,
      carbohydrate_g: 2.4,
      sugars_g: 1.1,
      fibre_g: 1.6,
      sodium_mg: 498,
      calcium_mg: 33,
      iron_mg: 0.9,
      magnesium_mg: 14,
      potassium_mg: 151,
      zinc_mg: 0.2,
      vitamin_a_ug: 48,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 43.7,
      vitamin_b12_ug: 0,
      folate_ug: 52,
      caffeine_mg: 0,
    },
  },
  {
    id: "sauerkraut-raw",
    code: "ING-849",
    name: "Sauerkraut Raw",
    category: "other",
    density: 0.9,
    fdc: "FDC 169279 · Sauerkraut, canned, solids and liquids (SR Legacy) as raw sauerkraut proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw sauerkraut. Nutrition uses canned sauerkraut proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 19,
      protein_g: 0.9,
      fat_g: 0.1,
      saturated_fat_g: 0,
      carbohydrate_g: 4.3,
      sugars_g: 1.8,
      fibre_g: 2.9,
      sodium_mg: 661,
      calcium_mg: 30,
      iron_mg: 1.5,
      magnesium_mg: 13,
      potassium_mg: 170,
      zinc_mg: 0.2,
      vitamin_a_ug: 1,
      vitamin_c_mg: 14.7,
      vitamin_d_ug: 0,
      vitamin_k_ug: 13.0,
      vitamin_b12_ug: 0,
      folate_ug: 24,
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
  { ing: "fermented-black-bean-paste", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "sauerkraut-raw", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
  out = out.replaceAll("Seven thousand three hundred fifty builds.", "Ten thousand five hundred fourteen builds.");
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
