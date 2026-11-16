#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6251;
const baseBuilds = 6250;

const INGREDIENTS = [
  {
    id: "balsamic-vinegar",
    code: "ING-508",
    name: "Balsamic Vinegar",
    category: "other",
    density: 1.08,
    fdc: "FDC 172238 · Vinegar, balsamic (SR Legacy). Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Balsamic vinegar. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 88,
      protein_g: 0.49,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 17.03,
      sugars_g: 14.95,
      fibre_g: 0,
      sodium_mg: 23,
      calcium_mg: 27,
      iron_mg: 0.72,
      magnesium_mg: 12,
      potassium_mg: 112,
      zinc_mg: 0.08,
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
    id: "white-wine-vinegar",
    code: "ING-509",
    name: "White Wine Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as white wine vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "White wine vinegar. Nutrition uses distilled vinegar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 18,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.04,
      sugars_g: 0.04,
      fibre_g: 0,
      sodium_mg: 2,
      calcium_mg: 6,
      iron_mg: 0.03,
      magnesium_mg: 1,
      potassium_mg: 2,
      zinc_mg: 0.01,
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
    id: "red-wine-vinegar",
    code: "ING-510",
    name: "Red Wine Vinegar",
    category: "other",
    density: 1.01,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as red wine vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Red wine vinegar. Nutrition uses distilled vinegar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 19,
      protein_g: 0.04,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.27,
      sugars_g: 0.27,
      fibre_g: 0,
      sodium_mg: 8,
      calcium_mg: 6,
      iron_mg: 0.45,
      magnesium_mg: 4,
      potassium_mg: 39,
      zinc_mg: 0.03,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0.5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 0,
      vitamin_b12_ug: 0,
      folate_ug: 0,
      caffeine_mg: 0,
    },
  },
  {
    id: "sherry-vinegar",
    code: "ING-511",
    name: "Sherry Vinegar",
    category: "other",
    density: 1.02,
    fdc: "FDC 172237 · Vinegar, distilled (SR Legacy) as sherry vinegar proxy. Proxy until the café SKU is labelled.",
    allergens: "[]",
    note: "Sherry vinegar. Nutrition uses distilled vinegar proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 20,
      protein_g: 0.1,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrate_g: 0.8,
      sugars_g: 0.6,
      fibre_g: 0,
      sodium_mg: 5,
      calcium_mg: 8,
      iron_mg: 0.2,
      magnesium_mg: 3,
      potassium_mg: 20,
      zinc_mg: 0.02,
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
  { ing: "balsamic-vinegar", cell: "chia", template: "tenon-blackstrap-molasses-chia-elevated", fromId: "blackstrap-molasses" },
  { ing: "sherry-vinegar", cell: "overnight-oats", template: "tenon-corn-syrup-overnight-oats-elevated", fromId: "corn-syrup" },
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
  out = out.replaceAll("Six thousand two hundred fifty builds.", "Six thousand three hundred builds.");
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
