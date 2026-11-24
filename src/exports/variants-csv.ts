import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function cell(value: number | string | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "number") return String(Math.round(value * 1e6) / 1e6);
  return csvEscape(value);
}

export default function render(data: CompiledDataset): string {
  const header = [
    "build_id",
    "build_code",
    "build_name",
    "vertical",
    "variant_key",
    "format",
    "is_default",
    "mass_g",
    "energy_kcal",
    "protein_g",
    "fat_g",
    "carbohydrate_g",
    "fibre_g",
    "sodium_mg",
    "allergens",
    "plant_based",
    "vegetarian",
    "placeholder",
    "json",
  ];

  const rows = data.builds.flatMap((build) =>
    build.variants.map((v) => {
      const t = v.composition.totals;
      return [
        build.id,
        build.code,
        build.name,
        build.vertical,
        v.key,
        v.format,
        v.is_default ? "true" : "false",
        cell(v.composition.mass_g),
        cell(t.energy_kcal?.value ?? null),
        cell(t.protein_g?.value ?? null),
        cell(t.fat_g?.value ?? null),
        cell(t.carbohydrate_g?.value ?? null),
        cell(t.fibre_g?.value ?? null),
        cell(t.sodium_mg?.value ?? null),
        v.composition.allergens.join("|"),
        v.composition.diet.plant_based ? "true" : "false",
        v.composition.diet.vegetarian ? "true" : "false",
        v.composition.placeholder ? "true" : "false",
        `/api/v1/builds/${build.id}.json`,
      ]
        .map((c) => cell(c))
        .join(",");
    }),
  );

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
