import type { CompiledDataset } from "../compile.ts";

export default function render(data: CompiledDataset): string {
  const rows = [["vertical", "build_id", "build_code", "build_name", "formats", "derived_from"]];
  for (const build of data.builds) {
    rows.push([
      build.vertical,
      build.id,
      build.code,
      build.name,
      build.formats.join("|"),
      build.derived_from ?? "",
    ]);
  }
  const body = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
  return body;
}
