import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(data: CompiledDataset): string {
  const header = [
    "menu_id",
    "menu_code",
    "name",
    "status",
    "build_id",
    "formats",
    "default_variant",
    "mass_g",
    "energy_kcal",
    "protein_g",
    "fibre_g",
    "allergens",
    "json",
    "blueprint",
  ];

  const rows = data.menu.map((item) => {
    const def = item.variants.find((v) => v.is_default) ?? item.variants[0];
    const t = def?.composition.totals;
    return [
      item.id,
      item.code,
      csvEscape(item.name),
      item.status,
      item.build.replace(/^build\//, ""),
      item.formats.join("|"),
      def?.key ?? "",
      def ? String(Math.round(def.composition.mass_g * 1e6) / 1e6) : "",
      t?.energy_kcal?.value != null ? String(Math.round(t.energy_kcal.value * 1e6) / 1e6) : "",
      t?.protein_g?.value != null ? String(Math.round(t.protein_g.value * 1e6) / 1e6) : "",
      t?.fibre_g?.value != null ? String(Math.round(t.fibre_g.value * 1e6) / 1e6) : "",
      def?.composition.allergens.join("|") ?? "",
      `/api/v1/menu/${item.id}.json`,
      `/blueprints/builds/${item.build.replace(/^build\//, "")}`,
    ].join(",");
  });

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
