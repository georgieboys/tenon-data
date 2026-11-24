import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function parentRef(derived: string): string {
  const match = /^(prep|build)\/([a-z0-9-]+)@/.exec(derived);
  return match ? `${match[1]}/${match[2]}` : derived;
}

export default function render(data: CompiledDataset): string {
  const remixed = data.builds.filter((b) => b.derived_from);
  const byParent = new Map<string, typeof remixed>();

  for (const build of remixed) {
    const key = parentRef(build.derived_from!);
    const list = byParent.get(key) ?? [];
    list.push(build);
    byParent.set(key, list);
  }

  const header = [
    "parent_ref",
    "parent_code",
    "parent_name",
    "parent_kind",
    "remake_count",
    "child_ids",
    "blueprint",
  ];

  const rows = [...byParent.entries()]
    .map(([key, children]) => {
      const parent = data.builds.find((p) => p.ref === key) ?? data.preps.find((p) => p.ref === key);
      const kind = key.startsWith("prep/") ? "prep" : "build";
      const blueprintPath = parent
        ? kind === "prep"
          ? `/blueprints/preps/${parent.id}`
          : `/blueprints/builds/${parent.id}`
        : "";
      return {
        sortKey: `${String(children.length).padStart(4, "0")}-${key}`,
        line: [
          key,
          parent?.code ?? "",
          parent ? csvEscape(parent.name) : "",
          kind,
          String(children.length),
          csvEscape(children.map((c) => c.id).sort().join("|")),
          blueprintPath,
        ].join(","),
      };
    })
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
    .map((r) => r.line);

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
