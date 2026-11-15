import { describe, expect, it } from "vitest";
import { build, compileDataset, menuItem, prep, repoDataset, variant } from "./helpers.ts";

// Hand calculations use values in ingredients/*.md:
// UniSoy 2.6 g protein per 100 ml at 1.03 g/ml (manufacturer label), whey 78.13 g per 100 g (USDA),
// soy isolate 88.32 g per 100 g (USDA), matcha 29.6 g per 100 g (literature).

const UNISOY_BATCH_PROTEIN = 2.6 * 10; // 1000 ml
const WHEY_BATCH_PROTEIN = UNISOY_BATCH_PROTEIN + 40 * 0.7813;
const SPI_BATCH_PROTEIN = UNISOY_BATCH_PROTEIN + 0.8832 * 35;
const MATCHA_PROTEIN = 4 * 0.296;

describe("ingredient normalisation", () => {
  it("converts per-100 ml label values to per 100 g using density", async () => {
    const data = compileDataset(await repoDataset());
    const unisoy = data.ingredients.find((i) => i.id === "unisoy")!;
    expect(unisoy.composition.per_100g.protein_g!.value).toBeCloseTo(2.6 / 1.03, 6);
    expect(unisoy.declared_nutrition.protein_g).toEqual({ value: 2.6, source: "manufacturer_label" });
  });
});

describe("prep calculation", () => {
  it("sums inputs by mass and divides by yield", async () => {
    const data = compileDataset(await repoDataset());
    const milk = prep(data, "soy-whey-milk");
    // 1000 ml UniSoy = 1030 g; plus 40 g whey; yield = sum = 1070 g.
    expect(milk.yield.mass_g).toBeCloseTo(1070, 6);
    expect(milk.composition.totals.protein_g!.value).toBeCloseTo(WHEY_BATCH_PROTEIN, 6);
    expect(milk.composition.per_100g.protein_g!.value).toBeCloseTo((WHEY_BATCH_PROTEIN / 1070) * 100, 6);
  });

  it("concentrates per-100 g values when measured yield is below input mass", async () => {
    const data = compileDataset(await repoDataset());
    const milk = prep(data, "soy-protein-milk");
    // 1030 g UniSoy + 35 g isolate = 1065 g in, 1060 g measured out.
    expect(milk.yield.input_mass_g).toBeCloseTo(1065, 6);
    expect(milk.composition.totals.protein_g!.value).toBeCloseTo(SPI_BATCH_PROTEIN, 6);
    expect(milk.composition.per_100g.protein_g!.value).toBeCloseTo((SPI_BATCH_PROTEIN / 1060) * 100, 6);
  });

  it("applies retention factors to totals", async () => {
    const ds = await repoDataset();
    ds.prep["soy-whey-milk"]!.retention = { protein_g: 0.5 };
    const milk = prep(compileDataset(ds), "soy-whey-milk");
    expect(milk.composition.totals.protein_g!.value).toBeCloseTo(WHEY_BATCH_PROTEIN / 2, 6);
  });
});

describe("build variants", () => {
  it("calculates every format and milk base combination", async () => {
    const data = compileDataset(await repoDataset());
    const keys = build(data, "tenon-matcha").variants.map((v) => v.key).sort();
    expect(keys).toEqual([
      "hot.dairy-whey-milk",
      "hot.soy-protein-milk",
      "hot.soy-whey-milk",
      "iced.dairy-whey-milk",
      "iced.soy-protein-milk",
      "iced.soy-whey-milk",
    ]);
  });

  it("calculates per-serving nutrition through the prep", async () => {
    const data = compileDataset(await repoDataset());
    const hot = variant(data, "tenon-matcha", "hot.soy-whey-milk");
    expect(hot.composition.mass_g).toBe(264);
    expect(hot.composition.totals.protein_g!.value).toBeCloseTo(MATCHA_PROTEIN + (200 * WHEY_BATCH_PROTEIN) / 1070, 6);
    expect(hot.percent_ri.us_fda.protein_g).toBeCloseTo(
      ((MATCHA_PROTEIN + (200 * WHEY_BATCH_PROTEIN) / 1070) / 50) * 100,
      6,
    );
    expect(hot.percent_ri.sg_hpb.protein_g).toBeCloseTo(
      ((MATCHA_PROTEIN + (200 * WHEY_BATCH_PROTEIN) / 1070) / 62) * 100,
      6,
    );
  });

  it("counts ice in the serving mass but not in the nutrients", async () => {
    const data = compileDataset(await repoDataset());
    const iced = variant(data, "tenon-matcha", "iced.soy-whey-milk");
    expect(iced.composition.mass_g).toBe(4 + 40 + 180 + 120);
    expect(iced.composition.totals.protein_g!.value).toBeCloseTo(MATCHA_PROTEIN + (180 * WHEY_BATCH_PROTEIN) / 1070, 6);
  });

  it("menu product exposes the same numbers as the build", async () => {
    const data = compileDataset(await repoDataset());
    const item = menuItem(data, "tenon-matcha");
    expect(item.default_variant).toBe("hot.soy-whey-milk");
    expect(item.variants).toEqual(build(data, "tenon-matcha").variants);
  });

  it("menu options can restrict the offered milk bases", async () => {
    const ds = await repoDataset();
    ds.menu["tenon-matcha"]!.options = { base: ["prep/soy-protein-milk"] };
    const item = menuItem(compileDataset(ds), "tenon-matcha");
    expect(item.variants.map((v) => v.key).sort()).toEqual(["hot.soy-protein-milk", "iced.soy-protein-milk"]);
    expect(item.default_variant).toBe("hot.soy-protein-milk");
  });

  it("compiles the cocoa build with three bases", async () => {
    const data = compileDataset(await repoDataset());
    const cocoa = build(data, "tenon-cocoa");
    expect(cocoa.variants).toHaveLength(6);
    expect(cocoa.vertical).toBe("cocoa");
    expect(variant(data, "tenon-cocoa", "hot.soy-whey-milk").composition.placeholder).toBe(false);
  });
});

describe("nutritional inheritance", () => {
  it("propagates an ingredient change through prep, build and menu", async () => {
    const ds = await repoDataset();
    const before = compileDataset(ds);
    ds.ingredient["whey-concentrate"]!.nutrition.protein_g = 80;
    const after = compileDataset(ds);

    expect(prep(after, "soy-whey-milk").composition.totals.protein_g!.value).toBeCloseTo(UNISOY_BATCH_PROTEIN + 32, 6);
    expect(prep(after, "dairy-whey-milk").composition.totals.protein_g!.value).toBeGreaterThan(
      prep(before, "dairy-whey-milk").composition.totals.protein_g!.value!,
    );
    // Whey is not in the soy-protein base, so that variant must not move.
    expect(variant(after, "tenon-matcha", "hot.soy-protein-milk").composition.totals).toEqual(
      variant(before, "tenon-matcha", "hot.soy-protein-milk").composition.totals,
    );

    const expected = MATCHA_PROTEIN + (200 * (UNISOY_BATCH_PROTEIN + 32)) / 1070;
    expect(variant(after, "tenon-matcha", "hot.soy-whey-milk").composition.totals.protein_g!.value).toBeCloseTo(
      expected,
      6,
    );
    const menuDefault = menuItem(after, "tenon-matcha").variants.find((v) => v.key === "hot.soy-whey-milk")!;
    expect(menuDefault.composition.totals.protein_g!.value).toBeCloseTo(expected, 6);
  });

  it("propagates a recipe quantity change", async () => {
    const ds = await repoDataset();
    ds.prep["soy-whey-milk"]!.inputs[1]!.qty = 60;
    const milk = prep(compileDataset(ds), "soy-whey-milk");
    expect(milk.yield.mass_g).toBeCloseTo(1090, 6);
    expect(milk.composition.totals.protein_g!.value).toBeCloseTo(UNISOY_BATCH_PROTEIN + 0.7813 * 60, 6);
  });
});

describe("missing data", () => {
  it("reports a lower bound, not zero, when some inputs lack a value", async () => {
    const data = compileDataset(await repoDataset());
    const hot = variant(data, "tenon-matcha", "hot.soy-whey-milk");
    // Matcha has vitamin K; UniSoy is unknown, so the total is incomplete.
    expect(hot.composition.totals.vitamin_k_ug).toEqual({ value: expect.closeTo(116, 6), complete: false });
  });

  it("keeps a nutrient null when no input has data", async () => {
    const ds = await repoDataset();
    const milk = prep(compileDataset(ds), "soy-protein-milk");
    // Neither UniSoy nor soy isolate declares vitamin A.
    expect(milk.composition.totals.vitamin_a_ug).toEqual({ value: null, complete: false });
  });

  it("treats undeclared nutrients as unknown unless the ingredient says zero", async () => {
    const ds = await repoDataset();
    delete ds.ingredient.matcha!.nutrition.caffeine_mg;
    const data = compileDataset(ds);
    const matcha = data.ingredients.find((i) => i.id === "matcha")!;
    expect(matcha.composition.per_100g.caffeine_mg).toEqual({ value: null, complete: false });
    const water = data.ingredients.find((i) => i.id === "water")!;
    expect(water.composition.per_100g.caffeine_mg).toEqual({ value: 0, complete: true });
  });
});

describe("allergens, diet and provenance", () => {
  it("derives allergens and diet flags from every input", async () => {
    const data = compileDataset(await repoDataset());
    const soy = variant(data, "tenon-matcha", "hot.soy-protein-milk").composition;
    const soyWhey = variant(data, "tenon-matcha", "hot.soy-whey-milk").composition;
    const dairy = variant(data, "tenon-matcha", "hot.dairy-whey-milk").composition;

    expect(soy.allergens).toEqual(["soy"]);
    expect(soy.diet).toEqual({ plant_based: true, vegetarian: true });
    expect(soyWhey.allergens).toEqual(["milk", "soy"]);
    expect(soyWhey.diet.plant_based).toBe(false);
    expect(dairy.allergens).toEqual(["milk"]);
    expect(dairy.diet).toEqual({ plant_based: false, vegetarian: true });
  });

  it("is not placeholder when every source in the chain is attributable", async () => {
    const data = compileDataset(await repoDataset());
    expect(variant(data, "tenon-matcha", "hot.soy-whey-milk").composition.placeholder).toBe(false);
    expect(variant(data, "tenon-cocoa", "hot.dairy-whey-milk").composition.placeholder).toBe(false);
  });

  it("flags placeholder when a source in the chain is illustrative", async () => {
    const ds = await repoDataset();
    ds.ingredient["unisoy"]!.sources.manufacturer_label!.type = "placeholder";
    expect(variant(compileDataset(ds), "tenon-matcha", "hot.soy-whey-milk").composition.placeholder).toBe(true);
  });

  it("records which records use each component", async () => {
    const data = compileDataset(await repoDataset());
    const whey = data.ingredients.find((i) => i.id === "whey-concentrate")!;
    expect(whey.used_by).toEqual(["prep/dairy-whey-milk", "prep/soy-whey-milk"]);
    expect(prep(data, "soy-whey-milk").used_by).toEqual(["build/tenon-cocoa", "build/tenon-matcha"]);
    expect(build(data, "tenon-matcha").used_by).toEqual(["menu/tenon-matcha"]);
    expect(build(data, "tenon-cocoa").used_by).toEqual(["menu/tenon-cocoa"]);
  });
});
