#!/usr/bin/env node
/**
 * Remake wave: 4 base ingredients → powder forms × 12 chassis + 2 elevated = +50 builds.
 * Pass ids via WAVE_IDS (comma-separated) or edit DEFAULT_IDS.
 * Env: WAVE_VERSION, WAVE_START_CODE, WAVE_BASE_BUILDS, WAVE_PROSE, WAVE_ING_START
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const DEFAULT_IDS = ["pigeon-pea", "mustard-seed", "nigella", "cumin"];
const ids = (process.env.WAVE_IDS || DEFAULT_IDS.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (ids.length !== 4) {
  console.error("Need exactly 4 ingredient ids");
  process.exit(1);
}

const startCode = Number(process.env.WAVE_START_CODE || 14141);
const baseBuilds = Number(process.env.WAVE_BASE_BUILDS || 14140);
const proseCount =
  process.env.WAVE_PROSE || "Fourteen thousand one hundred ninety builds.";
const ingStart = Number(process.env.WAVE_ING_START || 1142);

function parseIngredient(id) {
  const raw = readFileSync(path.join(root, "ingredients", `${id}.md`), "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`no frontmatter for ${id}`);
  const body = fm[1];
  const get = (k) => {
    const m = body.match(new RegExp(`^${k}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : null;
  };
  const name = get("name");
  const category = get("category") || "spice";
  const density = Number(get("density_g_per_ml") || 0.5);
  const allergens = (body.match(/^allergens:\s*(\[[^\]]*\])/m) || [, "[]"])[1];
  const refMatch = body.match(/ref:\s*"([^"]+)"/);
  const fdc = refMatch
    ? `${refMatch[1].replace(/\.\s*Proxy.*/, "")} as ${id.replace(/-/g, " ")} powder proxy. Proxy until the café SKU is labelled.`
    : `Proxy as ${id} powder until the café SKU is labelled.`;
  const nutBlock = body.match(/nutrition:\n([\s\S]*?)(?=\nallergens:|\ndiet:)/);
  if (!nutBlock) throw new Error(`no nutrition for ${id}`);
  const nutrition = {};
  for (const line of nutBlock[1].split("\n")) {
    const m = line.match(/^\s+([a-z0-9_]+):\s*(.+)\s*$/);
    if (m) nutrition[m[1]] = Number(m[2]);
  }
  return { id, name, category, density, allergens, fdc, nutrition };
}

const bases = ids.map(parseIngredient);
const INGREDIENTS = bases.map((b, i) => ({
  id: `${b.id}-powder`,
  code: `ING-${ingStart + i}`,
  name: `${b.name} Powder`,
  category: b.category,
  density: Math.min(b.density, 0.7),
  fdc: b.fdc,
  allergens: b.allergens,
  note: `${b.name} powder (distinct from whole ${b.id}). Nutrition uses the parent SR Legacy / proxy row until a café CoA lands. Replace with the café SOP when locked.`,
  diet: { plant_based: true, vegetarian: true },
  nutrition: b.nutrition,
}));

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
  { ing: INGREDIENTS[0].id, cell: "chia", template: "tenon-ghee-chia-elevated", fromId: "ghee" },
  {
    ing: INGREDIENTS[1].id,
    cell: "overnight-oats",
    template: "tenon-duck-fat-overnight-oats-elevated",
    fromId: "duck-fat",
  },
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
  `done through BLD-${code - 1}; expected builds ${baseBuilds + (code - startCode)}; ings ${INGREDIENTS.map((i) => i.id).join(",")}`,
);
