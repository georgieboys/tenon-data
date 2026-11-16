#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const startCode = 6601;
const baseBuilds = 6600;

const INGREDIENTS = [
  {
    id: "white-miso",
    code: "ING-536",
    name: "White Miso",
    category: "other",
    density: 1.2,
    fdc: "FDC 172442 · Miso (SR Legacy) as white miso proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "White (shiro) miso. Contains soy. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 198,
      protein_g: 12.79,
      fat_g: 6.01,
      saturated_fat_g: 1.03,
      carbohydrate_g: 26.47,
      sugars_g: 6.2,
      fibre_g: 5.4,
      sodium_mg: 3728,
      calcium_mg: 57,
      iron_mg: 2.49,
      magnesium_mg: 48,
      potassium_mg: 210,
      zinc_mg: 2.56,
      vitamin_a_ug: 4,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 29.3,
      vitamin_b12_ug: 0.08,
      folate_ug: 19,
      caffeine_mg: 0,
    },
  },
  {
    id: "red-miso",
    code: "ING-537",
    name: "Red Miso",
    category: "other",
    density: 1.2,
    fdc: "FDC 172442 · Miso (SR Legacy) as red miso proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Red (aka) miso. Contains soy. Distinct catalogue cell from white miso for fermentation grade. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 198,
      protein_g: 12.79,
      fat_g: 6.01,
      saturated_fat_g: 1.03,
      carbohydrate_g: 26.47,
      sugars_g: 6.2,
      fibre_g: 5.4,
      sodium_mg: 3728,
      calcium_mg: 57,
      iron_mg: 2.49,
      magnesium_mg: 48,
      potassium_mg: 210,
      zinc_mg: 2.56,
      vitamin_a_ug: 4,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 29.3,
      vitamin_b12_ug: 0.08,
      folate_ug: 19,
      caffeine_mg: 0,
    },
  },
  {
    id: "doubanjiang",
    code: "ING-538",
    name: "Doubanjiang",
    category: "other",
    density: 1.15,
    fdc: "FDC 172442 · Miso (SR Legacy) as doubanjiang proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Doubanjiang (broad bean chili paste). Contains soy. Nutrition uses miso proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 180,
      protein_g: 10.0,
      fat_g: 5.0,
      saturated_fat_g: 0.8,
      carbohydrate_g: 22.0,
      sugars_g: 5.0,
      fibre_g: 4.0,
      sodium_mg: 4500,
      calcium_mg: 50,
      iron_mg: 2.5,
      magnesium_mg: 40,
      potassium_mg: 250,
      zinc_mg: 1.5,
      vitamin_a_ug: 50,
      vitamin_c_mg: 5,
      vitamin_d_ug: 0,
      vitamin_k_ug: 10,
      vitamin_b12_ug: 0,
      folate_ug: 20,
      caffeine_mg: 0,
    },
  },
  {
    id: "black-bean-sauce",
    code: "ING-539",
    name: "Black Bean Sauce",
    category: "other",
    density: 1.15,
    fdc: "FDC 172442 · Miso (SR Legacy) as black bean sauce proxy. Proxy until the café SKU is labelled.",
    allergens: "[soy]",
    note: "Fermented black bean sauce. Contains soy. Nutrition uses miso proxy until a dedicated FDC row or café CoA lands. Replace with the café SOP when locked.",
    nutrition: {
      energy_kcal: 160,
      protein_g: 9.0,
      fat_g: 4.0,
      saturated_fat_g: 0.6,
      carbohydrate_g: 20.0,
      sugars_g: 4.0,
      fibre_g: 4.0,
      sodium_mg: 4000,
      calcium_mg: 60,
      iron_mg: 3.0,
      magnesium_mg: 50,
      potassium_mg: 300,
      zinc_mg: 1.2,
      vitamin_a_ug: 0,
      vitamin_c_mg: 0,
      vitamin_d_ug: 0,
      vitamin_k_ug: 5,
      vitamin_b12_ug: 0,
      folate_ug: 30,
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
  { ing: "white-miso", cell: "chia", template: "tenon-chili-crisp-chia-elevated", fromId: "chili-crisp" },
  { ing: "black-bean-sauce", cell: "overnight-oats", template: "tenon-oyster-sauce-overnight-oats-elevated", fromId: "oyster-sauce" },
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
  out = out.replaceAll("Six thousand six hundred builds.", "Six thousand six hundred fifty builds.");
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
