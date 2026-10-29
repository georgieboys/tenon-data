import { resolve } from "node:path";
import { compileDataset } from "../src/compile.ts";
import type { CompiledDataset } from "../src/compile.ts";
import { loadDataset } from "../src/load.ts";
import type { Dataset } from "../src/types.ts";

export const ROOT = resolve(import.meta.dirname, "..");

let cached: Dataset | undefined;

/** A fresh, mutable copy of the repository data for each test. */
export async function repoDataset(): Promise<Dataset> {
  cached ??= await loadDataset(ROOT);
  return structuredClone(cached);
}

export const prep = (data: CompiledDataset, id: string) => data.preps.find((p) => p.id === id)!;
export const build = (data: CompiledDataset, id: string) => data.builds.find((b) => b.id === id)!;
export const menuItem = (data: CompiledDataset, id: string) => data.menu.find((m) => m.id === id)!;
export const variant = (data: CompiledDataset, buildId: string, key: string) =>
  build(data, buildId).variants.find((v) => v.key === key)!;

export { compileDataset };
