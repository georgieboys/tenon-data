import type { CompiledDataset } from "../compile.ts";
import { json } from "./util.ts";

export function apiStats(data: CompiledDataset) {
  const variants = data.builds.reduce((n, b) => n + b.variants.length, 0);
  const remixes = data.builds.filter((b) => Boolean(b.derived_from)).length;
  const formats = new Map<string, number>();
  const verticals = new Map<string, number>();
  for (const b of data.builds) {
    verticals.set(b.vertical, (verticals.get(b.vertical) ?? 0) + 1);
    for (const f of b.formats) formats.set(f, (formats.get(f) ?? 0) + 1);
  }
  const sorted = (m: Map<string, number>) => Object.fromEntries([...m.entries()].sort(([a], [b]) => a.localeCompare(b)));
  return {
    schema_version: data.schema_version,
    data_version: data.data_version,
    counts: {
      ingredients: data.ingredients.length,
      preps: data.preps.length,
      builds: data.builds.length,
      menu: data.menu.length,
      variants,
      remixes,
    },
    formats: sorted(formats),
    verticals: sorted(verticals),
  };
}

export default function render(data: CompiledDataset): string {
  return json(apiStats(data));
}
