import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function parentRef(derived: string): string {
  const match = /^(prep|build)\/([a-z0-9-]+)@/.exec(derived);
  return match ? `${match[1]}/${match[2]}` : derived;
}

export default function render(data: CompiledDataset): string {
  const header = [
    "child_id",
    "child_code",
    "child_name",
    "child_vertical",
    "derived_from",
    "parent_ref",
    "parent_code",
    "parent_name",
    "json",
    "blueprint",
  ];

  const rows = data.builds
    .filter((b) => b.derived_from)
    .map((b) => {
      const parentKey = parentRef(b.derived_from!);
      const parent =
        data.builds.find((p) => p.ref === parentKey) ?? data.preps.find((p) => p.ref === parentKey);
      return [
        b.id,
        b.code,
        csvEscape(b.name),
        b.vertical,
        b.derived_from ?? "",
        parentKey,
        parent?.code ?? "",
        parent ? csvEscape(parent.name) : "",
        `/api/v1/builds/${b.id}.json`,
        `/blueprints/builds/${b.id}`,
      ].join(",");
    })
    .sort((a, b) => a.localeCompare(b));

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
