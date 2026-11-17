#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 11991;
const baseBuilds = 11990;
const proseCount = "Twelve thousand forty builds.";

const INGREDIENTS = [
  {
    id: "carboxymethylcellulose",
    code: "ING-970",
    name: "Carboxymethylcellulose",
    category: "other",
    density: 0.5,
    fdc: "Branded carboxymethylcellulose / CMC (E466) (no dedicated SR Legacy row). Non-digestible cellulose-gum proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Carboxymethylcellulose (CMC). Nutrition is a branded cellulose-gum proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 0,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 95.0,
      sugars_g: 0,
      fibre_g: 95.0,
      sodium_mg: 200,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 2,
      potassium_mg: 5,
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
    id: "hydroxypropyl-methylcellulose",
    code: "ING-971",
    name: "Hydroxypropyl Methylcellulose",
    category: "other",
    density: 0.5,
    fdc: "Branded HPMC / hypromellose (E464) (no dedicated SR Legacy row). Non-digestible cellulose-gum proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Hydroxypropyl methylcellulose (HPMC). Nutrition is a branded cellulose-gum proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 0,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 95.0,
      sugars_g: 0,
      fibre_g: 95.0,
      sodium_mg: 15,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 2,
      potassium_mg: 5,
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
    id: "propylene-glycol-alginate",
    code: "ING-972",
    name: "Propylene Glycol Alginate",
    category: "other",
    density: 0.65,
    fdc: "FDC 168456 · Seaweed, kelp, raw (SR Legacy) as propylene glycol alginate proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Propylene glycol alginate (PGA). Nutrition uses kelp as closest SR Legacy seaweed proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 43,
      protein_g: 1.7,
      fat_g: 0.6,
      saturated_fat_g: 0.2,
      carbohydrate_g: 9.6,
      sugars_g: 0.6,
      fibre_g: 1.3,
      sodium_mg: 800,
      calcium_mg: 100,
      iron_mg: 2.0,
      magnesium_mg: 80,
      potassium_mg: 60,
      zinc_mg: 0.8,
      vitamin_a_ug: 4,
      vitamin_c_mg: 2.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 40,
      vitamin_b12_ug: 0,
      folate_ug: 100,
      caffeine_mg: 0,
    },
  },
  {
    id: "pullulan",
    code: "ING-973",
    name: "Pullulan",
    category: "other",
    density: 0.6,
    fdc: "Branded pullulan (Aureobasidium polysaccharide) (no dedicated SR Legacy row). Carbohydrate film-former proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Pullulan. Nutrition is a branded polysaccharide proxy until a café CoA lands. Replace with the café SOP when locked.",
    diet: { plant_based: true, vegetarian: true },
    nutrition: {
      energy_kcal: 360,
      protein_g: 0.1,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 90.0,
      sugars_g: 0.5,
      fibre_g: 0,
      sodium_mg: 10,
      calcium_mg: 5,
      iron_mg: 0.1,
      magnesium_mg: 2,
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
  { ing: "pullulan", cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  { ing: "carboxymethylcellulose", cell: "overnight-oats", template: "tenon-duck-fat-overnight-oats-elevated", fromId: "duck-fat" },
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
