import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function num(v: number | null | undefined): string {
  return v != null ? String(Math.round(v * 1e6) / 1e6) : "";
}

export default function render(data: CompiledDataset): string {
  const header = [
    "build_id",
    "code",
    "name",
    "vertical",
    "version",
    "derived_from",
    "formats",
    "default_variant",
    "mass_g",
    "energy_kcal",
    "protein_g",
    "fibre_g",
    "allergens",
    "menu_ids",
    "json",
    "blueprint",
  ];

  const rows = data.builds.map((build) => {
    const def = build.variants.find((v) => v.is_default) ?? build.variants[0];
    const t = def?.composition.totals;
    const menus = data.menu.filter((m) => m.build === build.ref).map((m) => m.id);
    return [
      build.id,
      build.code,
      csvEscape(build.name),
      build.vertical,
      build.version,
      build.derived_from ?? "",
      build.formats.join("|"),
      def?.key ?? "",
      def ? num(def.composition.mass_g) : "",
      num(t?.energy_kcal?.value),
      num(t?.protein_g?.value),
      num(t?.fibre_g?.value),
      def?.composition.allergens.join("|") ?? "",
      menus.join("|"),
      `/api/v1/builds/${build.id}.json`,
      `/blueprints/builds/${build.id}`,
    ].join(",");
  });

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
