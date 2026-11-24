import type { CompiledDataset } from "../compile.ts";
import { placeholderRecords } from "./util.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(data: CompiledDataset): string {
  const header = [
    "kind",
    "id",
    "code",
    "name",
    "placeholder",
    "used_by_count",
    "json",
    "blueprint",
  ];

  const rows = placeholderRecords(data).map((r) => {
    const kind = r.ref.startsWith("prep/") ? "prep" : "ingredient";
    const collection = kind === "prep" ? "preps" : "ingredients";
    return [
      kind,
      r.id,
      r.code,
      csvEscape(r.name),
      "true",
      String(r.used_by?.length ?? 0),
      `/api/v1/${collection}/${r.id}.json`,
      `/blueprints/${collection}/${r.id}`,
    ].join(",");
  });

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
