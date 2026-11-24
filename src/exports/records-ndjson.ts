import type { CompiledDataset } from "../compile.ts";

/** One JSON object per line for streaming agents and bulk loaders. */
export default function render(data: CompiledDataset): string {
  const lines: string[] = [];

  for (const ing of data.ingredients) {
    lines.push(
      JSON.stringify({
        kind: "ingredient",
        ref: ing.ref,
        code: ing.code,
        name: ing.name,
        version: ing.version,
        category: ing.category,
        allergens: ing.composition.allergens,
        protein_g_per_100g: ing.composition.per_100g.protein_g?.value ?? null,
        fibre_g_per_100g: ing.composition.per_100g.fibre_g?.value ?? null,
        placeholder: ing.composition.placeholder,
        json: `/api/v1/ingredients/${ing.id}.json`,
      }),
    );
  }

  for (const prep of data.preps) {
    lines.push(
      JSON.stringify({
        kind: "prep",
        ref: prep.ref,
        code: prep.code,
        name: prep.name,
        version: prep.version,
        yield_method: prep.yield.method,
        mass_g: prep.yield.mass_g,
        allergens: prep.composition.allergens,
        protein_g_per_100g: prep.composition.per_100g.protein_g?.value ?? null,
        placeholder: prep.composition.placeholder,
        json: `/api/v1/preps/${prep.id}.json`,
      }),
    );
  }

  for (const build of data.builds) {
    const def = build.variants.find((v) => v.is_default) ?? build.variants[0];
    lines.push(
      JSON.stringify({
        kind: "build",
        ref: build.ref,
        code: build.code,
        name: build.name,
        version: build.version,
        vertical: build.vertical,
        formats: build.formats,
        variant_count: build.variants.length,
        default_variant: def?.key ?? null,
        protein_g: def?.composition.totals.protein_g?.value ?? null,
        allergens: def?.composition.allergens ?? [],
        derived_from: build.derived_from,
        json: `/api/v1/builds/${build.id}.json`,
      }),
    );
  }

  for (const item of data.menu) {
    lines.push(
      JSON.stringify({
        kind: "menu",
        ref: item.ref,
        code: item.code,
        name: item.name,
        version: item.version,
        status: item.status,
        build: item.build,
        formats: item.formats,
        json: `/api/v1/menu/${item.id}.json`,
      }),
    );
  }

  return `${lines.join("\n")}\n`;
}
