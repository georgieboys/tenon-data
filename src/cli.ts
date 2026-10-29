import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { compileDataset } from "./compile.ts";
import { emit } from "./emit.ts";
import { loadDataset } from "./load.ts";
import { DataError } from "./types.ts";
import { validateDataset } from "./validate.ts";

const root = resolve(import.meta.dirname, "..");
const command = process.argv[2] ?? "validate";

if (command !== "validate" && command !== "build") {
  console.error("Usage: node src/cli.ts <validate|build>");
  process.exit(2);
}

try {
  const dataset = await loadDataset(root);
  const issues = validateDataset(dataset);
  if (issues.length > 0) throw new DataError(issues);

  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8")) as { version: string };
  const data = compileDataset(dataset, { dataVersion: pkg.version });

  const count = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const records = [...data.ingredients, ...data.preps];
  const variants = data.builds.flatMap((b) => b.variants);
  console.log(
    `✓ ${count(data.ingredients.length, "ingredient")}, ${count(data.preps.length, "prep")}, ` +
      `${count(data.builds.length, "build")} (${count(variants.length, "variant")}), ` +
      `${count(data.menu.length, "menu product")}`,
  );

  const placeholders = records.filter((r) => r.composition.placeholder).length;
  if (placeholders > 0) {
    console.warn(`! ${placeholders} of ${records.length} ingredients and preps rely on placeholder values`);
  }

  if (command === "build") {
    const outDir = join(root, "dist");
    const written = await emit(data, outDir);
    console.log(`✓ wrote ${written.length} files to ${relative(process.cwd(), outDir) || "."}`);
  }
} catch (err) {
  if (err instanceof DataError) {
    for (const issue of err.issues) console.error(`✗ ${issue.file}: ${issue.message}`);
    console.error(`\n${err.issues.length} issue(s) found.`);
    process.exit(1);
  }
  throw err;
}
