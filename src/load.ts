import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parse as parseYaml } from "yaml";
import { formatSchemaErrors, loadSchemaValidators } from "./schema.ts";
import { DataError, KINDS } from "./types.ts";
import type { Dataset, Issue, Kind, NutrientCatalog } from "./types.ts";

export const KIND_DIRS: Record<Kind, string> = {
  ingredient: "ingredients",
  prep: "preps",
  build: "builds",
  menu: "menu",
};

export const NUTRIENTS_FILE = "reference/nutrients.yaml";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;

export function splitFrontmatter(source: string): { data: unknown; body: string } {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error("missing YAML frontmatter delimited by --- lines");
  return { data: parseYaml(match[1] ?? ""), body: (match[2] ?? "").trim() };
}

/**
 * Reads every record from disk and checks it against its JSON Schema.
 * Cross-record checks (references, cycles, units) live in validate.ts.
 */
export async function loadDataset(root: string): Promise<Dataset> {
  const validators = await loadSchemaValidators(root);
  const issues: Issue[] = [];

  const nutrients = parseYaml(await readFile(join(root, NUTRIENTS_FILE), "utf8")) as NutrientCatalog;
  if (!validators.nutrients(nutrients)) {
    for (const message of formatSchemaErrors(validators.nutrients)) {
      issues.push({ file: NUTRIENTS_FILE, message });
    }
  }

  const dataset: Dataset = { nutrients, ingredient: {}, prep: {}, build: {}, menu: {} };

  for (const kind of KINDS) {
    const dir = KIND_DIRS[kind];
    let files: string[];
    try {
      files = (await readdir(join(root, dir))).filter((f) => f.endsWith(".md")).sort();
    } catch {
      continue;
    }
    for (const name of files) {
      const file = `${dir}/${name}`;
      let parsed: { data: unknown; body: string };
      try {
        parsed = splitFrontmatter(await readFile(join(root, file), "utf8"));
      } catch (err) {
        issues.push({ file, message: (err as Error).message });
        continue;
      }
      const validate = validators[kind];
      if (!validate(parsed.data)) {
        for (const message of formatSchemaErrors(validate)) issues.push({ file, message });
        continue;
      }
      const record = { ...(parsed.data as { id: string }), kind, file, body: parsed.body };
      const expectedId = basename(name, ".md");
      if (record.id !== expectedId) {
        issues.push({ file, message: `id '${record.id}' must match the file name '${expectedId}'` });
        continue;
      }
      (dataset[kind] as Record<string, unknown>)[record.id] = record;
    }
  }

  if (issues.length > 0) throw new DataError(issues);
  return dataset;
}
