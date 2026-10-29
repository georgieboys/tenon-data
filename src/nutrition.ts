import { REFERENCE_STANDARDS } from "./types.ts";
import type { Diet, Ingredient, NutrientDef, ReferenceStandard } from "./types.ts";

/**
 * value is the sum of all known contributions. complete is false when any
 * contributing input had no data for this nutrient, in which case value is a
 * lower bound. value is null only when nothing at all is known.
 */
export interface NutrientValue {
  value: number | null;
  complete: boolean;
}

export type NutrientVector = Record<string, NutrientValue>;

export interface Composition {
  /** Mass the totals describe: 100 for an ingredient, the yield for a prep, the serving for a build. */
  mass_g: number;
  totals: NutrientVector;
  per_100g: NutrientVector;
  allergens: string[];
  diet: Diet;
  /** True if any value in the chain comes from a placeholder source. */
  placeholder: boolean;
}

export interface DeclaredValue {
  value: number | null;
  source: string | null;
}

export function scaleVector(vector: NutrientVector, factor: number): NutrientVector {
  const out: NutrientVector = {};
  for (const [key, n] of Object.entries(vector)) {
    out[key] = { value: n.value === null ? null : n.value * factor, complete: n.complete };
  }
  return out;
}

export function ingredientComposition(
  ing: Ingredient,
  keys: string[],
): { composition: Composition; declared: Record<string, DeclaredValue> } {
  const toPer100g = ing.basis === "per_100ml" ? 1 / ing.density_g_per_ml! : 1;
  const per_100g: NutrientVector = {};
  const declared: Record<string, DeclaredValue> = {};
  const usedSources = new Set<string>();

  for (const key of keys) {
    const entry = ing.nutrition[key];
    let value: number | null;
    let source: string | null;
    if (entry === undefined) {
      const zero = ing.unlisted_nutrients === "zero";
      value = zero ? 0 : null;
      source = zero ? ing.default_source : null;
    } else if (entry === null) {
      value = null;
      source = null;
    } else if (typeof entry === "number") {
      value = entry;
      source = ing.default_source;
    } else {
      value = entry.value;
      source = entry.source;
    }
    if (source) usedSources.add(source);
    declared[key] = { value, source };
    per_100g[key] = { value: value === null ? null : value * toPer100g, complete: value !== null };
  }

  return {
    declared,
    composition: {
      mass_g: 100,
      totals: per_100g,
      per_100g,
      allergens: [...ing.allergens].sort(),
      diet: { ...ing.diet },
      placeholder: [...usedSources].some((s) => ing.sources[s]?.type === "placeholder"),
    },
  };
}

/**
 * Combines weighed parts into one composition. Nutrients are summed by mass,
 * optionally reduced by retention factors, then expressed per 100 g of the
 * output mass, which may be lower than the input mass (evaporation, losses).
 */
export function combine(
  keys: string[],
  parts: { composition: Composition; grams: number }[],
  outputMass: number,
  retention: Record<string, number> = {},
): Composition {
  const totals: NutrientVector = {};
  for (const key of keys) {
    let value: number | null = null;
    let complete = true;
    for (const { composition, grams } of parts) {
      const n = composition.per_100g[key]!;
      if (!n.complete) complete = false;
      if (n.value !== null) value = (value ?? 0) + (n.value * grams) / 100;
    }
    const factor = retention[key] ?? 1;
    totals[key] = { value: value === null ? null : value * factor, complete };
  }

  return {
    mass_g: outputMass,
    totals,
    per_100g: scaleVector(totals, 100 / outputMass),
    allergens: [...new Set(parts.flatMap((p) => p.composition.allergens))].sort(),
    diet: {
      plant_based: parts.every((p) => p.composition.diet.plant_based),
      vegetarian: parts.every((p) => p.composition.diet.vegetarian),
    },
    placeholder: parts.some((p) => p.composition.placeholder),
  };
}

export type PercentOfReference = Record<ReferenceStandard, Record<string, number | null>>;

export function percentOfReference(totals: NutrientVector, nutrients: NutrientDef[]): PercentOfReference {
  const out = {} as PercentOfReference;
  for (const standard of REFERENCE_STANDARDS) {
    out[standard] = {};
    for (const n of nutrients) {
      const reference = n.reference_intakes[standard];
      const value = totals[n.key]?.value ?? null;
      out[standard][n.key] = reference === null || value === null ? null : (value / reference) * 100;
    }
  }
  return out;
}
