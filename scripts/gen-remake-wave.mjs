#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 10891;
const baseBuilds = 10890;
const proseCount = "Ten thousand nine hundred forty builds.";

const INGREDIENTS = [
  {
    id: "cacao-husk",
    code: "ING-882",
    name: "Cacao Husk",
    category: "cocoa",
    density: 0.3,
    fdc: "FDC 169593 · Cocoa, dry powder, unsweetened (SR Legacy) as cacao husk / shell tea proxy (lower fat). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Cacao husk (shell) for infusions. Nutrition uses unsweetened cocoa powder as a loose proxy with honest note until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 150,
      protein_g: 8,
      fat_g: 3,
      saturated_fat_g: 1.5,
      carbohydrate_g: 50,
      sugars_g: 1,
      fibre_g: 40,
      sodium_mg: 20,
      calcium_mg: 100,
      iron_mg: 8,
      magnesium_mg: 200,
      potassium_mg: 800,
      zinc_mg: 3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 2,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 50,
    },
  },
  {
    id: "roasted-chickpeas",
    code: "ING-883",
    name: "Roasted Chickpeas",
    category: "other",
    density: 0.55,
    fdc: "FDC 173799 · Chickpeas (garbanzo beans, bengal gram), mature seeds, roasted (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Dry-roasted chickpeas. Nutrition uses USDA roasted chickpeas until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 464,
      protein_g: 21.3,
      fat_g: 9.0,
      saturated_fat_g: 1.0,
      carbohydrate_g: 60.0,
      sugars_g: 3.0,
      fibre_g: 17.0,
      sodium_mg: 20,
      calcium_mg: 80,
      iron_mg: 4.5,
      magnesium_mg: 100,
      potassium_mg: 800,
      zinc_mg: 2.5,
      vitamin_a_ug: 3,
      vitamin_c_mg: 2,
      vitamin_d_ug: 0,
      vitamin_k_ug: 9,
      vitamin_b12_ug: 0,
      folate_ug: 150,
      caffeine_mg: 0,
    },
  },
  {
    id: "xanthan-gum",
    code: "ING-884",
    name: "Xanthan Gum",
    category: "other",
    density: 0.7,
    fdc: "Branded xanthan gum label macros (no dedicated SR Legacy row). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Xanthan gum. Nutrition uses typical dry xanthan label macros until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 300,
      protein_g: 1,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 80,
      sugars_g: 0,
      fibre_g: 80,
      sodium_mg: 500,
      calcium_mg: 0,
      iron_mg: 0,
      magnesium_mg: 0,
      potassium_mg: 0,
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
    id: "guar-gum",
    code: "ING-885",
    name: "Guar Gum",
    category: "other",
    density: 0.6,
    fdc: "Branded guar gum label macros (no dedicated SR Legacy row). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Guar gum. Nutrition uses typical dry guar label macros until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 250,
      protein_g: 4,
      fat_g: 0.5,
      saturated_fat_g: 0,
      carbohydrate_g: 80,
      sugars_g: 0,
      fibre_g: 80,
      sodium_mg: 20,
      calcium_mg: 100,
      iron_mg: 2,
      magnesium_mg: 50,
      potassium_mg: 100,
      zinc_mg: 0.5,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
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
  { ing: "cacao-husk", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "roasted-chickpeas", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
