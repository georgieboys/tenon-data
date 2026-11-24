import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(data: CompiledDataset): string {
  const header = [
    "ingredient_id",
    "code",
    "name",
    "source_key",
    "source_type",
    "source_ref",
    "json",
    "blueprint",
  ];

  const rows: string[] = [];
  for (const ing of data.ingredients) {
    const sources = ing.sources ?? {};
    const keys = Object.keys(sources);
    if (keys.length === 0) {
      rows.push(
        [
          ing.id,
          ing.code,
          csvEscape(ing.name),
          "",
          "",
          "",
          `/api/v1/ingredients/${ing.id}.json`,
          `/blueprints/ingredients/${ing.id}`,
        ].join(","),
      );
      continue;
    }
    for (const key of keys.sort()) {
      const src = sources[key] as { type?: string; ref?: string };
      rows.push(
        [
          ing.id,
          ing.code,
          csvEscape(ing.name),
          key,
          src?.type ?? "",
          csvEscape(src?.ref ?? ""),
          `/api/v1/ingredients/${ing.id}.json`,
          `/blueprints/ingredients/${ing.id}`,
        ].join(","),
      );
    }
  }

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
