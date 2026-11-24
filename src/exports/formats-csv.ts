import type { CompiledDataset } from "../compile.ts";

export default function render(data: CompiledDataset): string {
  const rows = [["format", "build_id", "build_code", "build_name", "vertical"]];
  for (const build of data.builds) {
    for (const format of build.formats) {
      rows.push([format, build.id, build.code, build.name, build.vertical]);
    }
  }
  const body = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
  return body;
}
