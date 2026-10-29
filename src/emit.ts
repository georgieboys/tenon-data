import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { CompiledDataset } from "./compile.ts";
import { KIND_DIRS } from "./load.ts";
import { renderBuild, renderIngredient, renderMenuProduct, renderPrep } from "./markdown.ts";

const roundNumbers = (_key: string, value: unknown) =>
  typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value;

async function write(path: string, contents: string) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents);
}

const writeJson = (path: string, data: unknown) => write(path, `${JSON.stringify(data, roundNumbers, 2)}\n`);

/**
 * Writes the static API (dist/api/v1) and Markdown exports (dist/markdown).
 * The output directory is replaced on every run.
 */
export async function emit(data: CompiledDataset, outDir: string): Promise<string[]> {
  await rm(outDir, { recursive: true, force: true });
  const api = join(outDir, "api", "v1");
  const md = join(outDir, "markdown");
  const written: string[] = [];
  const track = async (path: string, task: Promise<void>) => {
    await task;
    written.push(path);
  };

  const groups = [
    { kind: "ingredient", records: data.ingredients, render: renderIngredient },
    { kind: "prep", records: data.preps, render: renderPrep },
    { kind: "build", records: data.builds, render: renderBuild },
    { kind: "menu", records: data.menu, render: renderMenuProduct },
  ] as const;

  const index: Record<string, unknown> = {
    schema_version: data.schema_version,
    data_version: data.data_version,
    licence: { code: "MIT", data: "CC-BY-SA-4.0" },
    nutrients: "nutrients.json",
    all: "all.json",
  };

  for (const { kind, records, render } of groups) {
    const dir = KIND_DIRS[kind];
    index[dir] = records.map((r) => ({
      ref: r.ref,
      code: r.code,
      name: r.name,
      version: r.version,
      json: `${dir}/${r.id}.json`,
    }));
    for (const record of records) {
      const jsonPath = join(api, dir, `${record.id}.json`);
      const mdPath = join(md, dir, `${record.id}.md`);
      await track(jsonPath, writeJson(jsonPath, record));
      await track(mdPath, write(mdPath, (render as (d: CompiledDataset, r: typeof record) => string)(data, record)));
    }
  }

  await track(join(api, "index.json"), writeJson(join(api, "index.json"), index));
  await track(join(api, "nutrients.json"), writeJson(join(api, "nutrients.json"), data.nutrients));
  await track(join(api, "all.json"), writeJson(join(api, "all.json"), data));
  return written;
}
