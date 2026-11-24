import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function num(v: number | null | undefined): string {
  return v != null ? String(Math.round(v * 1e6) / 1e6) : "";
}

export default function render(data: CompiledDataset): string {
  const header = [
    "ingredient_id",
    "code",
    "name",
    "category",
    "basis",
    "sources",
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
    "blueprint",
  ];

  const rows = data.ingredients.map((ing) => {
    const n = ing.composition.per_100g;
    return [
      ing.id,
      ing.code,
      csvEscape(ing.name),
      ing.category ?? "",
      ing.basis ?? "",
      Object.keys(ing.sources ?? {}).join("|"),
      num(n.energy_kcal?.value),
      num(n.protein_g?.value),
      num(n.fat_g?.value),
      num(n.carbohydrate_g?.value),
      num(n.fibre_g?.value),
      num(n.sodium_mg?.value),
      ing.composition.allergens.join("|"),
      String(ing.composition.diet.plant_based),
      String(ing.composition.diet.vegetarian),
      String(Boolean(ing.composition.placeholder)),
      `/api/v1/ingredients/${ing.id}.json`,
      `/blueprints/ingredients/${ing.id}`,
    ].join(",");
  });

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
