import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(data: CompiledDataset): string {
  const header = [
    "kind",
    "id",
    "code",
    "name",
    "plant_based",
    "vegetarian",
    "allergens",
    "json",
    "blueprint",
  ];

  const rows: string[] = [];

  for (const r of data.ingredients) {
    rows.push(
      [
        "ingredient",
        r.id,
        r.code,
        csvEscape(r.name),
        String(Boolean(r.composition.diet.plant_based)),
        String(Boolean(r.composition.diet.vegetarian)),
        r.composition.allergens.join("|"),
        `/api/v1/ingredients/${r.id}.json`,
        `/blueprints/ingredients/${r.id}`,
      ].join(","),
    );
  }

  for (const r of data.preps) {
    rows.push(
      [
        "prep",
        r.id,
        r.code,
        csvEscape(r.name),
        String(Boolean(r.composition.diet.plant_based)),
        String(Boolean(r.composition.diet.vegetarian)),
        r.composition.allergens.join("|"),
        `/api/v1/preps/${r.id}.json`,
        `/blueprints/preps/${r.id}`,
      ].join(","),
    );
  }

  for (const r of data.builds) {
    const variant = r.variants.find((v) => v.is_default) ?? r.variants[0];
    const comp = variant?.composition;
    rows.push(
      [
        "build",
        r.id,
        r.code,
        csvEscape(r.name),
        String(Boolean(comp?.diet.plant_based)),
        String(Boolean(comp?.diet.vegetarian)),
        (comp?.allergens ?? []).join("|"),
        `/api/v1/builds/${r.id}.json`,
        `/blueprints/builds/${r.id}`,
      ].join(","),
    );
  }

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
