import { describe, expect, it } from "vitest";
import { factorForMass, scaleRecipe } from "../src/scale.ts";
import { compileDataset, prep, repoDataset, variant } from "./helpers.ts";

describe("batch scaling", () => {
  it("doubles quantities, yield and totals while per-100 g stays the same", async () => {
    const milk = prep(compileDataset(await repoDataset()), "soy-whey-milk");
    const double = scaleRecipe(milk, 2);

    expect(double.inputs.map((i) => i.qty)).toEqual([2000, 80]);
    expect(double.inputs[0]!.grams).toBeCloseTo(2060, 6);
    expect(double.inputs[1]!.grams).toBeCloseTo(80, 6);
    expect(double.yield.mass_g).toBeCloseTo(2140, 6);
    expect(double.composition.mass_g).toBeCloseTo(2140, 6);
    expect(double.composition.totals.protein_g!.value).toBeCloseTo(134.4, 6);
    expect(double.composition.per_100g).toEqual(milk.composition.per_100g);
  });

  it("scales to a target output mass", async () => {
    const milk = prep(compileDataset(await repoDataset()), "soy-whey-milk");
    const factor = factorForMass(milk, 535);
    expect(factor).toBeCloseTo(0.5, 6);
    const [soy, whey] = scaleRecipe(milk, factor).inputs;
    expect(soy!.qty).toBeCloseTo(500, 6);
    expect(whey!.qty).toBeCloseTo(20, 6);
  });

  it("scales a build serving into a batch of drinks", async () => {
    const hot = variant(compileDataset(await repoDataset()), "tenon-matcha", "hot.soy-whey-milk");
    const four = scaleRecipe(hot, 4);
    expect(four.composition.mass_g).toBe(264 * 4);
    expect(four.inputs.find((i) => i.ref === "ingredient/matcha")!.qty).toBe(16);
  });

  it("does not mutate the original", async () => {
    const milk = prep(compileDataset(await repoDataset()), "soy-whey-milk");
    const snapshot = structuredClone(milk);
    scaleRecipe(milk, 3);
    expect(milk).toEqual(snapshot);
  });

  it("rejects zero, negative and non-finite factors", async () => {
    const milk = prep(compileDataset(await repoDataset()), "soy-whey-milk");
    for (const bad of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => scaleRecipe(milk, bad)).toThrow(RangeError);
    }
  });
});
