import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";

const SCHEMA_BASE = "https://tenon.coffee/schema/";

export type SchemaName = "ingredient" | "prep" | "build" | "menu" | "nutrients";

export type SchemaValidators = Record<SchemaName, ValidateFunction>;

export async function loadSchemaValidators(root: string): Promise<SchemaValidators> {
  const dir = join(root, "schema");
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  for (const file of (await readdir(dir)).filter((f) => f.endsWith(".schema.json"))) {
    ajv.addSchema(JSON.parse(await readFile(join(dir, file), "utf8")));
  }
  const get = (name: SchemaName): ValidateFunction => {
    const fn = ajv.getSchema(`${SCHEMA_BASE}${name}.schema.json`);
    if (!fn) throw new Error(`Schema ${name}.schema.json not found in ${dir}`);
    return fn;
  };
  return {
    ingredient: get("ingredient"),
    prep: get("prep"),
    build: get("build"),
    menu: get("menu"),
    nutrients: get("nutrients"),
  };
}

export function formatSchemaErrors(fn: ValidateFunction): string[] {
  return (fn.errors ?? []).map((e) => {
    const where = e.instancePath || "(root)";
    const extra =
      e.keyword === "additionalProperties"
        ? ` '${(e.params as { additionalProperty: string }).additionalProperty}'`
        : e.keyword === "enum"
          ? ` (${(e.params as { allowedValues: unknown[] }).allowedValues.join(", ")})`
          : "";
    return `${where} ${e.message}${extra}`;
  });
}
