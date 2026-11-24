import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { compileDataset, type CompiledDataset } from "./compile.ts";
import { loadDatabase } from "./db.ts";
import { emit } from "./emit.ts";
import { EXPORTS } from "./exports/index.ts";
import { loadDataset } from "./load.ts";
import { DataError } from "./types.ts";
import { validateDataset } from "./validate.ts";

const root = resolve(import.meta.dirname, "..");
const command = process.argv[2] ?? "validate";

const COMMANDS = ["validate", "build", "export", "load-db"];
if (!COMMANDS.includes(command)) {
  console.error("Usage: node src/cli.ts <validate|build|export [dir]|load-db>");
  console.error("  export   write bulk downloads (CSV, NDJSON, JSON, llms-full.txt) to dir (default: exports/)");
  console.error("  load-db  load the site database; needs TURSO_DATABASE_URL (libsql://… or file:…) and TURSO_AUTH_TOKEN");
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

  // Exports, the site database and the site have always worked from the
  // emitted JSON, where numbers are rounded to 6 decimals. Keep that exactly.
  const roundNumbers = (_key: string, value: unknown) =>
    typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value;
  const published = (): CompiledDataset => JSON.parse(JSON.stringify(data, roundNumbers)) as CompiledDataset;

  if (command === "export") {
    const rounded = published();
    const outDir = resolve(process.argv[3] ?? join(root, "exports"));
    await mkdir(outDir, { recursive: true });
    for (const [name, render] of Object.entries(EXPORTS)) {
      const body = render(rounded);
      await writeFile(join(outDir, name), body);
      console.log(`  · ${name} (${(Buffer.byteLength(body) / 1e6).toFixed(1)} MB)`);
    }
    console.log(`✓ wrote ${Object.keys(EXPORTS).length} exports to ${relative(process.cwd(), outDir) || "."}`);
  }

  if (command === "load-db") {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) throw new Error("TURSO_DATABASE_URL is not set");
    await loadDatabase(published(), { url, authToken: process.env.TURSO_AUTH_TOKEN });
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
