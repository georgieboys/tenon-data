import type { Unit } from "./types.ts";

export function isVolume(unit: Unit): boolean {
  return unit === "ml" || unit === "l";
}

export function massInGrams(qty: number, unit: Unit, density_g_per_ml?: number): number {
  switch (unit) {
    case "g":
      return qty;
    case "kg":
      return qty * 1000;
    case "ml":
    case "l": {
      if (density_g_per_ml === undefined) {
        throw new Error(`cannot convert ${qty} ${unit} to grams without a density`);
      }
      return (unit === "l" ? qty * 1000 : qty) * density_g_per_ml;
    }
  }
}
