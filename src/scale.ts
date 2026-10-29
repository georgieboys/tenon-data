import { scaleVector } from "./nutrition.ts";
import type { Composition } from "./nutrition.ts";
import type { ResolvedInput } from "./compile.ts";

export interface Scalable {
  inputs: ResolvedInput[];
  composition: Composition;
  yield?: { method: string; mass_g: number; input_mass_g: number };
}

function assertFactor(factor: number) {
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new RangeError(`scale factor must be a positive number, got ${factor}`);
  }
}

/**
 * Linear scaling: every quantity, the output mass and the nutrient totals are
 * multiplied by factor; per-100 g values are unchanged. Real batches may need
 * manual adjustment for things that do not scale linearly (leavening, spice
 * intensity, evaporation in wider pans).
 */
export function scaleRecipe<T extends Scalable>(recipe: T, factor: number): T {
  assertFactor(factor);
  const scaled: T = {
    ...recipe,
    inputs: recipe.inputs.map((i) => ({ ...i, qty: i.qty * factor, grams: i.grams * factor })),
    composition: {
      ...recipe.composition,
      mass_g: recipe.composition.mass_g * factor,
      totals: scaleVector(recipe.composition.totals, factor),
    },
  };
  if (recipe.yield) {
    scaled.yield = {
      ...recipe.yield,
      mass_g: recipe.yield.mass_g * factor,
      input_mass_g: recipe.yield.input_mass_g * factor,
    };
  }
  return scaled;
}

/** The factor that makes the recipe produce target_g of output. */
export function factorForMass(recipe: Scalable, target_g: number): number {
  const factor = target_g / recipe.composition.mass_g;
  assertFactor(factor);
  return factor;
}
