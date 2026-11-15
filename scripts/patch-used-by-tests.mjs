#!/usr/bin/env node
/**
 * After compile, rewrite the large used_by expect([...]) blocks in nutrition.test.ts
 * from the compiled dataset so remake waves don't hand-edit hundreds of lines.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
execFileSync(process.execPath, ["src/cli.ts", "build"], { cwd: root, stdio: "inherit" });
const data = JSON.parse(readFileSync(path.join(root, "dist/api/v1/all.json"), "utf8"));

function findRecord(kind, id) {
  const list = data[kind];
  const r = list.find((x) => x.id === id);
  if (!r) throw new Error(`missing ${kind}/${id}`);
  return r;
}

function formatArray(arr) {
  return `[\n${arr.map((x) => `      "${x}",`).join("\n")}\n    ]`;
}

const testPath = path.join(root, "test/nutrition.test.ts");
let src = readFileSync(testPath, "utf8");

const patches = [
  { label: "whey.used_by", getter: () => findRecord("ingredients", "whey-concentrate").used_by },
  { label: 'prep(data, "soy-whey-milk").used_by', getter: () => findRecord("preps", "soy-whey-milk").used_by },
  { label: 'prep(data, "protein-bread").used_by', getter: () => findRecord("preps", "protein-bread").used_by },
];

for (const p of patches) {
  const used = p.getter();
  const re = new RegExp(
    `expect\\(${p.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)\\.toEqual\\(\\[[\\s\\S]*?\\]\\);`,
    "m",
  );
  if (!re.test(src)) {
    console.error("pattern not found for", p.label);
    process.exit(1);
  }
  src = src.replace(re, `expect(${p.label}).toEqual(${formatArray(used)});`);
  console.log(`patched ${p.label} (${used.length})`);
}

writeFileSync(testPath, src);
console.log("wrote", path.relative(root, testPath));
console.log("counts", {
  builds: data.builds.length,
  ingredients: data.ingredients.length,
  version: data.data_version,
});
