#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 4101;
const baseBuilds = 4100;

const INGREDIENTS = [
  {
    id: "holy-basil",
    code: "ING-333",
    name: "Holy Basil",
    category: "spice",
    density: 0.35,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as holy basil / tulsi proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh holy basil (tulsi). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 23,
      protein_g: 3.2,
      fat_g: 0.6,
      saturated_fat_g: 0.04,
      carbohydrate_g: 2.7,
      sugars_g: 0.3,
      fibre_g: 1.6,
      sodium_mg: 4,
      calcium_mg: 180,
      iron_mg: 3.2,
      magnesium_mg: 64,
      potassium_mg: 300,
      zinc_mg: 0.8,
      vitamin_a_ug: 260,
      vitamin_c_mg: 18.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 400.0,
      vitamin_b12_ug: 0,
      folate_ug: 70,
      caffeine_mg: 0,
    },
  },
  {
    id: "vietnamese-coriander",
    code: "ING-334",
    name: "Vietnamese Coriander",
    category: "spice",
    density: 0.35,
    fdc: "FDC 172158 · Basil/herb leafy green proxy via fresh basil (SR Legacy) for rau răm. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh Vietnamese coriander (rau răm / laksa leaf). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 2.5,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 4.0,
      sugars_g: 0.4,
      fibre_g: 2.0,
      sodium_mg: 10,
      calcium_mg: 100,
      iron_mg: 2.0,
      magnesium_mg: 40,
      potassium_mg: 250,
      zinc_mg: 0.4,
      vitamin_a_ug: 150,
      vitamin_c_mg: 25.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200.0,
      vitamin_b12_ug: 0,
      folate_ug: 50,
      caffeine_mg: 0,
    },
  },
  {
    id: "lesser-galangal",
    code: "ING-335",
    name: "Lesser Galangal",
    category: "spice",
    density: 0.9,
    fdc: "FDC 169231 · Ginger root, raw (SR Legacy) as lesser galangal / kencur proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Raw lesser galangal (kencur). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 75,
      protein_g: 1.4,
      fat_g: 0.7,
      saturated_fat_g: 0.2,
      carbohydrate_g: 16.0,
      sugars_g: 1.3,
      fibre_g: 2.0,
      sodium_mg: 13,
      calcium_mg: 20,
      iron_mg: 0.5,
      magnesium_mg: 35,
      potassium_mg: 360,
      zinc_mg: 0.3,
      vitamin_a_ug: 0,
      vitamin_c_mg: 5.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0.1,
      vitamin_b12_ug: 0,
      folate_ug: 10,
      caffeine_mg: 0,
    },
  },
  {
    id: "laksa-leaf",
    code: "ING-336",
    name: "Laksa Leaf",
    category: "spice",
    density: 0.35,
    fdc: "FDC 172158 · Basil, fresh (SR Legacy) as laksa leaf / daun kesum proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Fresh laksa leaf (daun kesum). Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 25,
      protein_g: 2.5,
      fat_g: 0.4,
      saturated_fat_g: 0.05,
      carbohydrate_g: 4.0,
      sugars_g: 0.4,
      fibre_g: 2.0,
      sodium_mg: 10,
      calcium_mg: 100,
      iron_mg: 2.0,
      magnesium_mg: 40,
      potassium_mg: 250,
      zinc_mg: 0.4,
      vitamin_a_ug: 150,
      vitamin_c_mg: 25.0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 200.0,
      vitamin_b12_ug: 0,
      folate_ug: 50,
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
  { ing: "holy-basil", cell: "chia", template: "tenon-pandan-leaf-chia-elevated", fromId: "pandan-leaf" },
  { ing: "laksa-leaf", cell: "overnight-oats", template: "tenon-thai-basil-overnight-oats-elevated", fromId: "thai-basil" },
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
  out = out.replaceAll("Four thousand one hundred builds.", "Four thousand one hundred fifty builds.");
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
