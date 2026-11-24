import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(data: CompiledDataset): string {
  const header = ["allergen", "kind", "id", "code", "name", "json", "blueprint"];
  const rows: string[] = [];

  const push = (
    allergen: string,
    kind: "ingredient" | "prep" | "build",
    id: string,
    code: string,
    name: string,
  ) => {
    rows.push(
      [
        allergen,
        kind,
        id,
        code,
        csvEscape(name),
        `/api/v1/${kind === "ingredient" ? "ingredients" : kind === "prep" ? "preps" : "builds"}/${id}.json`,
        `/blueprints/${kind === "ingredient" ? "ingredients" : kind === "prep" ? "preps" : "builds"}/${id}`,
      ].join(","),
    );
  };

  for (const ing of data.ingredients) {
    for (const a of ing.composition.allergens) {
      push(a, "ingredient", ing.id, ing.code, ing.name);
    }
  }
  for (const prep of data.preps) {
    for (const a of prep.composition.allergens) {
      push(a, "prep", prep.id, prep.code, prep.name);
    }
  }
  for (const build of data.builds) {
    const allergens = Array.from(new Set(build.variants.flatMap((v) => v.composition.allergens)));
    for (const a of allergens) {
      push(a, "build", build.id, build.code, build.name);
    }
  }

  rows.sort((a, b) => a.localeCompare(b));
  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
