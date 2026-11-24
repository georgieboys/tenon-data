import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function num(v: number | null | undefined): string {
  return v != null ? String(Math.round(v * 1e6) / 1e6) : "";
}

export default function render(data: CompiledDataset): string {
  const header = [
    "prep_id",
    "code",
    "name",
    "yield_method",
    "yield_mass_g",
    "input_mass_g",
    "density_g_per_ml",
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
    "used_by_count",
    "json",
    "blueprint",
  ];

  const rows = data.preps.map((prep) => {
    const n = prep.composition.per_100g;
    return [
      prep.id,
      prep.code,
      csvEscape(prep.name),
      prep.yield?.method ?? "",
      num(prep.yield?.mass_g),
      num(prep.yield?.input_mass_g),
      num(prep.density_g_per_ml),
      num(n.energy_kcal?.value),
      num(n.protein_g?.value),
      num(n.fat_g?.value),
      num(n.carbohydrate_g?.value),
      num(n.fibre_g?.value),
      num(n.sodium_mg?.value),
      prep.composition.allergens.join("|"),
      String(prep.composition.diet.plant_based),
      String(prep.composition.diet.vegetarian),
      String(Boolean(prep.composition.placeholder)),
      String(prep.used_by.length),
      `/api/v1/preps/${prep.id}.json`,
      `/blueprints/preps/${prep.id}`,
    ].join(",");
  });

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
