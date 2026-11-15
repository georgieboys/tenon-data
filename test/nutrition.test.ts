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
      "ice_blended.dairy-whey-milk",
      "ice_blended.soy-protein-milk",
      "ice_blended.soy-whey-milk",
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
    expect(item.variants.map((v) => v.key).sort()).toEqual([
      "hot.soy-protein-milk",
      "ice_blended.soy-protein-milk",
      "iced.soy-protein-milk",
    ]);
    expect(item.default_variant).toBe("hot.soy-protein-milk");
  });

  it("compiles cocoa, latte, tea, americano, masala chai and ice cream builds", async () => {
    const data = compileDataset(await repoDataset());
    expect(build(data, "tenon-cocoa").variants).toHaveLength(9);
    expect(build(data, "tenon-cocoa").vertical).toBe("cocoa");
    expect(build(data, "tenon-latte").variants).toHaveLength(9);
    expect(build(data, "tenon-latte").formats).toEqual(["hot", "iced", "ice_blended"]);
    expect(build(data, "tenon-latte").vertical).toBe("coffee");
    expect(build(data, "tenon-tea").variants).toHaveLength(9);
    expect(build(data, "tenon-tea").formats).toEqual(["hot", "iced", "ice_blended"]);
    expect(build(data, "tenon-tea").vertical).toBe("tea");
    expect(build(data, "tenon-americano").variants).toHaveLength(3);
    expect(build(data, "tenon-americano").variants.map((v) => v.key).sort()).toEqual([
      "hot",
      "ice_blended",
      "iced",
    ]);
    expect(build(data, "tenon-masala-chai").variants).toHaveLength(9);
    expect(build(data, "tenon-masala-chai").formats).toEqual(["hot", "iced", "ice_blended"]);
    expect(build(data, "tenon-masala-chai").derived_from).toBe("build/tenon-tea@0.1.0");
    expect(build(data, "tenon-cocoa-pb-ice-cream").variants).toHaveLength(3);
    expect(build(data, "tenon-cocoa-pb-ice-cream").formats).toEqual(["ice_cream"]);
    expect(build(data, "tenon-pistachio-matcha-ice-cream").variants).toHaveLength(3);
    expect(build(data, "tenon-pistachio-matcha-ice-cream").vertical).toBe("matcha");
    expect(build(data, "tenon-teh-tarik-ice-cream").variants).toHaveLength(3);
    expect(build(data, "tenon-teh-tarik-ice-cream").vertical).toBe("tea");
    expect(build(data, "tenon-teh-tarik-ice-cream").derived_from).toBe("build/tenon-masala-chai@0.1.0");
    expect(build(data, "tenon-bulletproof-ice-cream").variants).toHaveLength(3);
    expect(build(data, "tenon-bulletproof-ice-cream").vertical).toBe("coffee");
    expect(build(data, "tenon-energy-fruitcake").variants).toHaveLength(1);
    expect(build(data, "tenon-energy-fruitcake").vertical).toBe("food");
    expect(build(data, "tenon-energy-fruitcake").formats).toEqual(["baked"]);
    expect(variant(data, "tenon-energy-fruitcake", "baked").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "gluten", "milk"]),
    );
    expect(build(data, "tenon-banana-cheesecake").variants).toHaveLength(1);
    expect(build(data, "tenon-banana-cheesecake").vertical).toBe("food");
    expect(build(data, "tenon-banana-cheesecake").formats).toEqual(["baked"]);
    expect(variant(data, "tenon-banana-cheesecake", "baked").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "milk"]),
    );
    expect(variant(data, "tenon-banana-cheesecake", "baked").composition.allergens).not.toContain("gluten");
    expect(build(data, "tenon-pb-protein-sandwich").variants).toHaveLength(1);
    expect(build(data, "tenon-pb-protein-sandwich").formats).toEqual(["assembled"]);
    expect(variant(data, "tenon-pb-protein-sandwich", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "milk", "peanut", "tree_nut"]),
    );
    expect(build(data, "tenon-egg-protein-sandwich").formats).toEqual(["assembled"]);
    expect(variant(data, "tenon-egg-protein-sandwich", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "milk", "tree_nut"]),
    );
    expect(prep(data, "protein-bread").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "milk", "tree_nut"]),
    );
    expect(variant(data, "tenon-cocoa", "hot.soy-whey-milk").composition.placeholder).toBe(false);
    expect(variant(data, "tenon-latte", "hot.soy-whey-milk").composition.placeholder).toBe(false);
    expect(variant(data, "tenon-tea", "hot.soy-whey-milk").composition.placeholder).toBe(false);
    expect(variant(data, "tenon-americano", "hot").composition.placeholder).toBe(false);
    expect(variant(data, "tenon-masala-chai", "hot.soy-whey-milk").composition.placeholder).toBe(false);
    expect(variant(data, "tenon-cocoa-pb-ice-cream", "ice_cream.soy-whey-milk").composition.allergens).toEqual(
      expect.arrayContaining(["peanut", "milk", "soy"]),
    );
    expect(variant(data, "tenon-pistachio-matcha-ice-cream", "ice_cream.soy-whey-milk").composition.allergens).toEqual(
      expect.arrayContaining(["tree_nut", "milk", "soy"]),
    );
    expect(variant(data, "tenon-bulletproof-ice-cream", "ice_cream.soy-whey-milk").composition.allergens).toEqual(
      expect.arrayContaining(["tree_nut", "milk", "soy"]),
    );
    expect(variant(data, "tenon-bulletproof-ice-cream", "ice_cream.soy-protein-milk").composition.diet.plant_based).toBe(
      false,
    );
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
    expect(whey.used_by).toEqual([
      "build/tenon-almond-butter-cheesecake",
      "build/tenon-almond-butter-date-bites",
      "build/tenon-almond-butter-oat-bar",
      "build/tenon-almond-butter-overnight-oats",
      "build/tenon-almond-cheesecake",
      "build/tenon-almond-date-bites",
      "build/tenon-almond-flour-cheesecake",
      "build/tenon-almond-flour-date-bites",
      "build/tenon-almond-flour-oat-bar",
      "build/tenon-almond-flour-overnight-oats",
      "build/tenon-almond-oat-bar",
      "build/tenon-almond-overnight-oats",
      "build/tenon-apple-cheesecake",
      "build/tenon-apple-date-bites",
      "build/tenon-apple-oat-bar",
      "build/tenon-apple-overnight-oats",
      "build/tenon-avocado-cheesecake",
      "build/tenon-avocado-date-bites",
      "build/tenon-avocado-oat-bar",
      "build/tenon-avocado-overnight-oats",
      "build/tenon-baking-powder-cheesecake",
      "build/tenon-baking-powder-date-bites",
      "build/tenon-baking-powder-oat-bar",
      "build/tenon-baking-powder-overnight-oats",
      "build/tenon-banana-cheesecake",
      "build/tenon-banana-date-bites",
      "build/tenon-banana-oat-bar",
      "build/tenon-banana-overnight-oats",
      "build/tenon-blackberry-cheesecake",
      "build/tenon-blackberry-date-bites",
      "build/tenon-blackberry-oat-bar",
      "build/tenon-blackberry-overnight-oats",
      "build/tenon-blueberry-cheesecake",
      "build/tenon-blueberry-date-bites",
      "build/tenon-blueberry-oat-bar",
      "build/tenon-blueberry-overnight-oats",
      "build/tenon-butter-cheesecake",
      "build/tenon-butter-date-bites",
      "build/tenon-butter-oat-bar",
      "build/tenon-butter-overnight-oats",
      "build/tenon-cacao-nibs-cheesecake",
      "build/tenon-cacao-nibs-date-bites",
      "build/tenon-cacao-nibs-oat-bar",
      "build/tenon-cacao-nibs-overnight-oats",
      "build/tenon-cardamom-cheesecake",
      "build/tenon-cardamom-date-bites",
      "build/tenon-cardamom-oat-bar",
      "build/tenon-cardamom-overnight-oats",
      "build/tenon-carrot-cheesecake",
      "build/tenon-carrot-date-bites",
      "build/tenon-carrot-oat-bar",
      "build/tenon-carrot-overnight-oats",
      "build/tenon-cashew-cheesecake",
      "build/tenon-cashew-date-bites",
      "build/tenon-cashew-oat-bar",
      "build/tenon-cashew-overnight-oats",
      "build/tenon-chia-cheesecake",
      "build/tenon-chia-date-bites",
      "build/tenon-chia-oat-bar",
      "build/tenon-chia-overnight-oats",
      "build/tenon-chickpea-cheesecake",
      "build/tenon-chickpea-date-bites",
      "build/tenon-chickpea-oat-bar",
      "build/tenon-chickpea-overnight-oats",
      "build/tenon-cinnamon-cheesecake",
      "build/tenon-cinnamon-date-bites",
      "build/tenon-cinnamon-oat-bar",
      "build/tenon-cinnamon-overnight-oats",
      "build/tenon-cloves-cheesecake",
      "build/tenon-cloves-date-bites",
      "build/tenon-cloves-oat-bar",
      "build/tenon-cloves-overnight-oats",
      "build/tenon-cocoa-cheesecake",
      "build/tenon-cocoa-date-bites",
      "build/tenon-cocoa-oat-bar",
      "build/tenon-cocoa-overnight-oats",
      "build/tenon-coconut-cheesecake",
      "build/tenon-coconut-date-bites",
      "build/tenon-coconut-oat-bar",
      "build/tenon-coconut-oil-cheesecake",
      "build/tenon-coconut-oil-date-bites",
      "build/tenon-coconut-oil-oat-bar",
      "build/tenon-coconut-oil-overnight-oats",
      "build/tenon-coconut-overnight-oats",
      "build/tenon-cottage-cheesecake",
      "build/tenon-cottage-date-bites",
      "build/tenon-cottage-oat-bar",
      "build/tenon-cottage-overnight-oats",
      "build/tenon-cream-cheese-cheesecake",
      "build/tenon-cream-cheese-date-bites",
      "build/tenon-cream-cheese-oat-bar",
      "build/tenon-cream-cheese-overnight-oats",
      "build/tenon-date-cheesecake",
      "build/tenon-date-oat-bar",
      "build/tenon-date-overnight-oats",
      "build/tenon-date-pb-bites",
      "build/tenon-dates-cheesecake",
      "build/tenon-dates-date-bites",
      "build/tenon-dates-oat-bar",
      "build/tenon-dates-overnight-oats",
      "build/tenon-egg-cheesecake",
      "build/tenon-egg-date-bites",
      "build/tenon-egg-oat-bar",
      "build/tenon-egg-overnight-oats",
      "build/tenon-espresso-cheesecake",
      "build/tenon-espresso-date-bites",
      "build/tenon-espresso-oat-bar",
      "build/tenon-espresso-overnight-oats",
      "build/tenon-flaxseed-cheesecake",
      "build/tenon-flaxseed-date-bites",
      "build/tenon-flaxseed-oat-bar",
      "build/tenon-flaxseed-overnight-oats",
      "build/tenon-full-fat-milk-cheesecake",
      "build/tenon-full-fat-milk-date-bites",
      "build/tenon-full-fat-milk-oat-bar",
      "build/tenon-full-fat-milk-overnight-oats",
      "build/tenon-ginger-cheesecake",
      "build/tenon-ginger-date-bites",
      "build/tenon-ginger-oat-bar",
      "build/tenon-ginger-overnight-oats",
      "build/tenon-heavy-cream-cheesecake",
      "build/tenon-heavy-cream-date-bites",
      "build/tenon-heavy-cream-oat-bar",
      "build/tenon-heavy-cream-overnight-oats",
      "build/tenon-hemp-seed-cheesecake",
      "build/tenon-hemp-seed-date-bites",
      "build/tenon-hemp-seed-oat-bar",
      "build/tenon-hemp-seed-overnight-oats",
      "build/tenon-hemp-seed-overnight-oats-elevated",
      "build/tenon-honey-cheesecake",
      "build/tenon-honey-date-bites",
      "build/tenon-honey-oat-bar",
      "build/tenon-honey-overnight-oats",
      "build/tenon-ice-cheesecake",
      "build/tenon-ice-date-bites",
      "build/tenon-ice-oat-bar",
      "build/tenon-ice-overnight-oats",
      "build/tenon-lemon-cheesecake",
      "build/tenon-mango-cheesecake",
      "build/tenon-mango-date-bites",
      "build/tenon-mango-oat-bar",
      "build/tenon-mango-overnight-oats",
      "build/tenon-mango-overnight-oats-elevated",
      "build/tenon-maple-cheesecake",
      "build/tenon-maple-date-bites",
      "build/tenon-maple-oat-bar",
      "build/tenon-maple-overnight-oats",
      "build/tenon-masala-cheesecake",
      "build/tenon-masala-date-bites",
      "build/tenon-masala-oat-bar",
      "build/tenon-masala-overnight-oats",
      "build/tenon-matcha-cheesecake",
      "build/tenon-matcha-date-bites",
      "build/tenon-matcha-oat-bar",
      "build/tenon-matcha-overnight-oats",
      "build/tenon-molasses-cheesecake",
      "build/tenon-molasses-date-bites",
      "build/tenon-molasses-oat-bar",
      "build/tenon-molasses-overnight-oats",
      "build/tenon-molasses-overnight-oats-elevated",
      "build/tenon-oats-cheesecake",
      "build/tenon-oats-date-bites",
      "build/tenon-oats-oat-bar",
      "build/tenon-oats-overnight-oats",
      "build/tenon-olive-oil-cheesecake",
      "build/tenon-olive-oil-oat-bar",
      "build/tenon-pb-cheesecake",
      "build/tenon-pb-overnight-oats",
      "build/tenon-peanut-butter-cheesecake",
      "build/tenon-peanut-butter-date-bites",
      "build/tenon-peanut-butter-oat-bar",
      "build/tenon-peanut-butter-overnight-oats",
      "build/tenon-pear-cheesecake",
      "build/tenon-pear-date-bites",
      "build/tenon-pear-oat-bar",
      "build/tenon-pear-overnight-oats",
      "build/tenon-pistachio-cheesecake",
      "build/tenon-pistachio-date-bites",
      "build/tenon-pistachio-oat-bar",
      "build/tenon-pistachio-overnight-oats",
      "build/tenon-pumpkin-seed-cheesecake",
      "build/tenon-pumpkin-seed-date-bites",
      "build/tenon-pumpkin-seed-oat-bar",
      "build/tenon-pumpkin-seed-overnight-oats",
      "build/tenon-quinoa-cheesecake",
      "build/tenon-quinoa-date-bites",
      "build/tenon-quinoa-oat-bar",
      "build/tenon-quinoa-overnight-oats",
      "build/tenon-raspberry-cheesecake",
      "build/tenon-raspberry-date-bites",
      "build/tenon-raspberry-oat-bar",
      "build/tenon-raspberry-overnight-oats",
      "build/tenon-rice-flour-cheesecake",
      "build/tenon-rice-flour-date-bites",
      "build/tenon-rice-flour-oat-bar",
      "build/tenon-rice-flour-overnight-oats",
      "build/tenon-salt-cheesecake",
      "build/tenon-salt-date-bites",
      "build/tenon-salt-oat-bar",
      "build/tenon-salt-overnight-oats",
      "build/tenon-sesame-cheesecake",
      "build/tenon-sesame-date-bites",
      "build/tenon-sesame-oat-bar",
      "build/tenon-sesame-overnight-oats",
      "build/tenon-soy-isolate-cheesecake",
      "build/tenon-soy-isolate-date-bites",
      "build/tenon-soy-isolate-oat-bar",
      "build/tenon-soy-isolate-overnight-oats",
      "build/tenon-spinach-cheesecake",
      "build/tenon-spinach-date-bites",
      "build/tenon-spinach-oat-bar",
      "build/tenon-spinach-overnight-oats",
      "build/tenon-strawberry-cheesecake",
      "build/tenon-strawberry-date-bites",
      "build/tenon-strawberry-oat-bar",
      "build/tenon-strawberry-overnight-oats",
      "build/tenon-sunflower-seed-cheesecake",
      "build/tenon-sunflower-seed-date-bites",
      "build/tenon-sunflower-seed-oat-bar",
      "build/tenon-sunflower-seed-overnight-oats",
      "build/tenon-tahini-cheesecake",
      "build/tenon-tahini-date-bites",
      "build/tenon-tahini-oat-bar",
      "build/tenon-tahini-overnight-oats",
      "build/tenon-tea-cheesecake",
      "build/tenon-tea-date-bites",
      "build/tenon-tea-oat-bar",
      "build/tenon-tea-overnight-oats",
      "build/tenon-tomato-cheesecake",
      "build/tenon-tomato-date-bites",
      "build/tenon-tomato-oat-bar",
      "build/tenon-tomato-overnight-oats",
      "build/tenon-unisoy-cheesecake",
      "build/tenon-unisoy-date-bites",
      "build/tenon-unisoy-oat-bar",
      "build/tenon-unisoy-overnight-oats",
      "build/tenon-vanilla-cheesecake",
      "build/tenon-vanilla-date-bites",
      "build/tenon-vanilla-overnight-oats",
      "build/tenon-walnut-cheesecake",
      "build/tenon-walnut-date-bites",
      "build/tenon-walnut-oat-bar",
      "build/tenon-walnut-overnight-oats",
      "build/tenon-water-cheesecake",
      "build/tenon-water-date-bites",
      "build/tenon-water-ice-cream",
      "build/tenon-water-oat-bar",
      "build/tenon-water-overnight-oats",
      "build/tenon-whey-almond-cookies",
      "build/tenon-whey-cheesecake",
      "build/tenon-whey-chia",
      "build/tenon-whey-cottage-bowl",
      "build/tenon-whey-date-bites",
      "build/tenon-whey-egg-sandwich",
      "build/tenon-whey-fruitcake",
      "build/tenon-whey-ice-cream",
      "build/tenon-whey-oat-bar",
      "build/tenon-whey-overnight-oats",
      "build/tenon-whey-protein-sandwich",
      "build/tenon-whey-yogurt-bowl",
      "build/tenon-whole-wheat-cheesecake",
      "build/tenon-whole-wheat-date-bites",
      "build/tenon-whole-wheat-oat-bar",
      "build/tenon-whole-wheat-overnight-oats",
      "build/tenon-yogurt-cheesecake",
      "build/tenon-yogurt-date-bites",
      "build/tenon-yogurt-oat-bar",
      "build/tenon-yogurt-overnight-oats",
      "prep/dairy-whey-milk",
      "prep/protein-bread",
      "prep/soy-whey-milk",
    ]);
    expect(prep(data, "soy-whey-milk").used_by).toEqual([
      "build/tenon-almond-butter-chia",
      "build/tenon-almond-butter-ice-cream",
      "build/tenon-almond-butter-overnight-oats",
      "build/tenon-almond-chia",
      "build/tenon-almond-flour-chia",
      "build/tenon-almond-flour-ice-cream",
      "build/tenon-almond-flour-overnight-oats",
      "build/tenon-almond-ice-cream",
      "build/tenon-almond-overnight-oats",
      "build/tenon-apple-chia",
      "build/tenon-apple-ice-cream",
      "build/tenon-apple-overnight-oats",
      "build/tenon-avocado-chia",
      "build/tenon-avocado-ice-cream",
      "build/tenon-avocado-overnight-oats",
      "build/tenon-baking-powder-chia",
      "build/tenon-baking-powder-ice-cream",
      "build/tenon-baking-powder-overnight-oats",
      "build/tenon-banana-chia",
      "build/tenon-banana-ice-cream",
      "build/tenon-banana-overnight-oats",
      "build/tenon-blackberry-chia",
      "build/tenon-blackberry-chia-elevated",
      "build/tenon-blackberry-ice-cream",
      "build/tenon-blackberry-overnight-oats",
      "build/tenon-blueberry-chia",
      "build/tenon-blueberry-ice-cream",
      "build/tenon-blueberry-overnight-oats",
      "build/tenon-bulletproof-ice-cream",
      "build/tenon-butter-chia",
      "build/tenon-butter-ice-cream",
      "build/tenon-butter-overnight-oats",
      "build/tenon-cacao-nibs-chia",
      "build/tenon-cacao-nibs-ice-cream",
      "build/tenon-cacao-nibs-overnight-oats",
      "build/tenon-cardamom-chia",
      "build/tenon-cardamom-ice-cream",
      "build/tenon-cardamom-overnight-oats",
      "build/tenon-carrot-chia",
      "build/tenon-carrot-ice-cream",
      "build/tenon-carrot-overnight-oats",
      "build/tenon-cashew-chia",
      "build/tenon-cashew-ice-cream",
      "build/tenon-cashew-overnight-oats",
      "build/tenon-chia-chia",
      "build/tenon-chia-ice-cream",
      "build/tenon-chia-overnight-oats",
      "build/tenon-chia-pudding",
      "build/tenon-chickpea-chia",
      "build/tenon-chickpea-ice-cream",
      "build/tenon-chickpea-overnight-oats",
      "build/tenon-cinnamon-chia",
      "build/tenon-cinnamon-ice-cream",
      "build/tenon-cinnamon-overnight-oats",
      "build/tenon-cloves-chia",
      "build/tenon-cloves-ice-cream",
      "build/tenon-cloves-overnight-oats",
      "build/tenon-cocoa",
      "build/tenon-cocoa-chia",
      "build/tenon-cocoa-ice-cream",
      "build/tenon-cocoa-overnight-oats",
      "build/tenon-cocoa-pb-ice-cream",
      "build/tenon-coconut-chia",
      "build/tenon-coconut-ice-cream",
      "build/tenon-coconut-oil-chia",
      "build/tenon-coconut-oil-ice-cream",
      "build/tenon-coconut-oil-overnight-oats",
      "build/tenon-coconut-overnight-oats",
      "build/tenon-cottage-chia",
      "build/tenon-cottage-ice-cream",
      "build/tenon-cottage-overnight-oats",
      "build/tenon-cream-cheese-chia",
      "build/tenon-cream-cheese-ice-cream",
      "build/tenon-cream-cheese-overnight-oats",
      "build/tenon-cream-ice-cream",
      "build/tenon-date-chia",
      "build/tenon-date-ice-cream",
      "build/tenon-date-overnight-oats",
      "build/tenon-dates-chia",
      "build/tenon-dates-ice-cream",
      "build/tenon-dates-overnight-oats",
      "build/tenon-egg-chia",
      "build/tenon-egg-ice-cream",
      "build/tenon-egg-overnight-oats",
      "build/tenon-espresso-chia",
      "build/tenon-espresso-ice-cream",
      "build/tenon-espresso-overnight-oats",
      "build/tenon-flaxseed-chia",
      "build/tenon-flaxseed-ice-cream",
      "build/tenon-flaxseed-overnight-oats",
      "build/tenon-ginger-chia",
      "build/tenon-ginger-ice-cream",
      "build/tenon-ginger-overnight-oats",
      "build/tenon-heavy-cream-chia",
      "build/tenon-heavy-cream-ice-cream",
      "build/tenon-heavy-cream-overnight-oats",
      "build/tenon-hemp-seed-chia",
      "build/tenon-hemp-seed-ice-cream",
      "build/tenon-hemp-seed-overnight-oats",
      "build/tenon-hemp-seed-overnight-oats-elevated",
      "build/tenon-honey-chia",
      "build/tenon-honey-ice-cream",
      "build/tenon-honey-overnight-oats",
      "build/tenon-ice-chia",
      "build/tenon-ice-ice-cream",
      "build/tenon-ice-overnight-oats",
      "build/tenon-latte",
      "build/tenon-lemon-chia",
      "build/tenon-lemon-ice-cream",
      "build/tenon-mango-chia",
      "build/tenon-mango-ice-cream",
      "build/tenon-mango-overnight-oats",
      "build/tenon-mango-overnight-oats-elevated",
      "build/tenon-maple-chia",
      "build/tenon-maple-ice-cream",
      "build/tenon-maple-overnight-oats",
      "build/tenon-masala-chai",
      "build/tenon-masala-chia",
      "build/tenon-masala-ice-cream",
      "build/tenon-masala-overnight-oats",
      "build/tenon-matcha",
      "build/tenon-matcha-chia",
      "build/tenon-matcha-ice-cream",
      "build/tenon-matcha-overnight-oats",
      "build/tenon-molasses-chia",
      "build/tenon-molasses-ice-cream",
      "build/tenon-molasses-overnight-oats",
      "build/tenon-molasses-overnight-oats-elevated",
      "build/tenon-oats-chia",
      "build/tenon-oats-ice-cream",
      "build/tenon-oats-overnight-oats",
      "build/tenon-olive-oil-ice-cream",
      "build/tenon-pb-chia",
      "build/tenon-pb-ice-cream",
      "build/tenon-pb-overnight-oats",
      "build/tenon-peanut-butter-chia",
      "build/tenon-peanut-butter-ice-cream",
      "build/tenon-peanut-butter-overnight-oats",
      "build/tenon-pear-chia",
      "build/tenon-pear-ice-cream",
      "build/tenon-pear-overnight-oats",
      "build/tenon-pistachio-chia",
      "build/tenon-pistachio-ice-cream",
      "build/tenon-pistachio-matcha-ice-cream",
      "build/tenon-pistachio-overnight-oats",
      "build/tenon-pumpkin-seed-chia",
      "build/tenon-pumpkin-seed-ice-cream",
      "build/tenon-pumpkin-seed-overnight-oats",
      "build/tenon-quinoa-chia",
      "build/tenon-quinoa-chia-elevated",
      "build/tenon-quinoa-ice-cream",
      "build/tenon-quinoa-overnight-oats",
      "build/tenon-raspberry-chia",
      "build/tenon-raspberry-chia-elevated",
      "build/tenon-raspberry-ice-cream",
      "build/tenon-raspberry-overnight-oats",
      "build/tenon-rice-flour-chia",
      "build/tenon-rice-flour-ice-cream",
      "build/tenon-rice-flour-overnight-oats",
      "build/tenon-salt-chia",
      "build/tenon-salt-ice-cream",
      "build/tenon-salt-overnight-oats",
      "build/tenon-sesame-chia",
      "build/tenon-sesame-ice-cream",
      "build/tenon-sesame-overnight-oats",
      "build/tenon-soy-isolate-chia",
      "build/tenon-soy-isolate-ice-cream",
      "build/tenon-soy-isolate-overnight-oats",
      "build/tenon-spinach-chia",
      "build/tenon-spinach-ice-cream",
      "build/tenon-spinach-overnight-oats",
      "build/tenon-strawberry-chia",
      "build/tenon-strawberry-ice-cream",
      "build/tenon-strawberry-overnight-oats",
      "build/tenon-sunflower-seed-chia",
      "build/tenon-sunflower-seed-ice-cream",
      "build/tenon-sunflower-seed-overnight-oats",
      "build/tenon-tahini-chia",
      "build/tenon-tahini-ice-cream",
      "build/tenon-tahini-overnight-oats",
      "build/tenon-tea",
      "build/tenon-tea-chia",
      "build/tenon-tea-ice-cream",
      "build/tenon-tea-overnight-oats",
      "build/tenon-teh-tarik-ice-cream",
      "build/tenon-tomato-chia",
      "build/tenon-tomato-ice-cream",
      "build/tenon-tomato-overnight-oats",
      "build/tenon-vanilla-chia",
      "build/tenon-vanilla-ice-cream",
      "build/tenon-vanilla-overnight-oats",
      "build/tenon-walnut-chia",
      "build/tenon-walnut-ice-cream",
      "build/tenon-walnut-overnight-oats",
      "build/tenon-whey-chia",
      "build/tenon-whey-ice-cream",
      "build/tenon-whey-overnight-oats",
      "build/tenon-whole-wheat-chia",
      "build/tenon-whole-wheat-ice-cream",
      "build/tenon-whole-wheat-overnight-oats",
      "build/tenon-yogurt-chia",
      "build/tenon-yogurt-ice-cream",
      "build/tenon-yogurt-overnight-oats",
    ]);
    expect(prep(data, "masala-spice").used_by).toEqual([
      "build/tenon-masala-almond-cookies",
      "build/tenon-masala-chai",
      "build/tenon-masala-cheesecake",
      "build/tenon-masala-chia",
      "build/tenon-masala-cottage-bowl",
      "build/tenon-masala-date-bites",
      "build/tenon-masala-egg-sandwich",
      "build/tenon-masala-fruitcake",
      "build/tenon-masala-ice-cream",
      "build/tenon-masala-oat-bar",
      "build/tenon-masala-overnight-oats",
      "build/tenon-masala-protein-sandwich",
      "build/tenon-masala-yogurt-bowl",
      "build/tenon-teh-tarik-ice-cream",
    ]);
    expect(build(data, "tenon-matcha").used_by).toEqual(["menu/tenon-matcha"]);
    expect(build(data, "tenon-cocoa").used_by).toEqual(["menu/tenon-cocoa"]);
    expect(build(data, "tenon-latte").used_by).toEqual(["menu/tenon-latte"]);
    expect(build(data, "tenon-tea").used_by).toEqual(["menu/tenon-tea"]);
    expect(build(data, "tenon-americano").used_by).toEqual(["menu/tenon-americano"]);
    expect(build(data, "tenon-masala-chai").used_by).toEqual(["menu/tenon-masala-chai"]);
    expect(build(data, "tenon-cocoa-pb-ice-cream").used_by).toEqual(["menu/tenon-cocoa-pb-ice-cream"]);
    expect(build(data, "tenon-pistachio-matcha-ice-cream").used_by).toEqual([
      "menu/tenon-pistachio-matcha-ice-cream",
    ]);
    expect(build(data, "tenon-teh-tarik-ice-cream").used_by).toEqual(["menu/tenon-teh-tarik-ice-cream"]);
    expect(build(data, "tenon-bulletproof-ice-cream").used_by).toEqual(["menu/tenon-bulletproof-ice-cream"]);
    expect(build(data, "tenon-energy-fruitcake").used_by).toEqual(["menu/tenon-energy-fruitcake"]);
    expect(build(data, "tenon-banana-cheesecake").used_by).toEqual(["menu/tenon-banana-cheesecake"]);
    expect(prep(data, "protein-bread").used_by).toEqual([
      "build/tenon-almond-butter-egg-sandwich",
      "build/tenon-almond-butter-protein-sandwich",
      "build/tenon-almond-egg-sandwich",
      "build/tenon-almond-flour-egg-sandwich",
      "build/tenon-almond-flour-protein-sandwich",
      "build/tenon-almond-protein-sandwich",
      "build/tenon-apple-egg-sandwich",
      "build/tenon-apple-protein-sandwich",
      "build/tenon-avocado-egg-sandwich",
      "build/tenon-avocado-protein-sandwich",
      "build/tenon-baking-powder-egg-sandwich",
      "build/tenon-baking-powder-protein-sandwich",
      "build/tenon-banana-egg-sandwich",
      "build/tenon-banana-protein-sandwich",
      "build/tenon-blackberry-egg-sandwich",
      "build/tenon-blackberry-protein-sandwich",
      "build/tenon-blueberry-egg-sandwich",
      "build/tenon-blueberry-protein-sandwich",
      "build/tenon-butter-egg-sandwich",
      "build/tenon-butter-protein-sandwich",
      "build/tenon-cacao-nibs-egg-sandwich",
      "build/tenon-cacao-nibs-protein-sandwich",
      "build/tenon-cardamom-egg-sandwich",
      "build/tenon-cardamom-protein-sandwich",
      "build/tenon-carrot-egg-sandwich",
      "build/tenon-carrot-protein-sandwich",
      "build/tenon-cashew-egg-sandwich",
      "build/tenon-cashew-protein-sandwich",
      "build/tenon-chia-egg-sandwich",
      "build/tenon-chia-protein-sandwich",
      "build/tenon-chickpea-egg-sandwich",
      "build/tenon-chickpea-protein-sandwich",
      "build/tenon-cinnamon-egg-sandwich",
      "build/tenon-cinnamon-protein-sandwich",
      "build/tenon-cloves-egg-sandwich",
      "build/tenon-cloves-protein-sandwich",
      "build/tenon-cocoa-egg-sandwich",
      "build/tenon-cocoa-protein-sandwich",
      "build/tenon-coconut-egg-sandwich",
      "build/tenon-coconut-oil-egg-sandwich",
      "build/tenon-coconut-oil-protein-sandwich",
      "build/tenon-coconut-protein-sandwich",
      "build/tenon-cottage-egg-sandwich",
      "build/tenon-cottage-protein-sandwich",
      "build/tenon-cream-cheese-egg-sandwich",
      "build/tenon-cream-cheese-protein-sandwich",
      "build/tenon-date-egg-sandwich",
      "build/tenon-date-protein-sandwich",
      "build/tenon-dates-egg-sandwich",
      "build/tenon-dates-protein-sandwich",
      "build/tenon-egg-banana-sandwich",
      "build/tenon-egg-protein-sandwich",
      "build/tenon-espresso-egg-sandwich",
      "build/tenon-espresso-protein-sandwich",
      "build/tenon-flaxseed-egg-sandwich",
      "build/tenon-flaxseed-protein-sandwich",
      "build/tenon-full-fat-milk-egg-sandwich",
      "build/tenon-full-fat-milk-protein-sandwich",
      "build/tenon-ginger-egg-sandwich",
      "build/tenon-ginger-protein-sandwich",
      "build/tenon-heavy-cream-egg-sandwich",
      "build/tenon-heavy-cream-protein-sandwich",
      "build/tenon-hemp-seed-egg-sandwich",
      "build/tenon-hemp-seed-protein-sandwich",
      "build/tenon-honey-egg-sandwich",
      "build/tenon-honey-protein-sandwich",
      "build/tenon-ice-egg-sandwich",
      "build/tenon-ice-protein-sandwich",
      "build/tenon-lemon-egg-sandwich",
      "build/tenon-lemon-protein-sandwich",
      "build/tenon-mango-egg-sandwich",
      "build/tenon-mango-protein-sandwich",
      "build/tenon-maple-egg-sandwich",
      "build/tenon-maple-protein-sandwich",
      "build/tenon-masala-egg-sandwich",
      "build/tenon-masala-protein-sandwich",
      "build/tenon-matcha-egg-sandwich",
      "build/tenon-matcha-protein-sandwich",
      "build/tenon-molasses-egg-sandwich",
      "build/tenon-molasses-protein-sandwich",
      "build/tenon-oats-egg-sandwich",
      "build/tenon-oats-protein-sandwich",
      "build/tenon-olive-oil-egg-sandwich",
      "build/tenon-olive-oil-protein-sandwich",
      "build/tenon-pb-banana-sandwich",
      "build/tenon-pb-egg-sandwich",
      "build/tenon-pb-protein-sandwich",
      "build/tenon-peanut-butter-egg-sandwich",
      "build/tenon-peanut-butter-protein-sandwich",
      "build/tenon-pear-egg-sandwich",
      "build/tenon-pear-protein-sandwich",
      "build/tenon-pistachio-egg-sandwich",
      "build/tenon-pistachio-protein-sandwich",
      "build/tenon-pumpkin-seed-egg-sandwich",
      "build/tenon-pumpkin-seed-protein-sandwich",
      "build/tenon-quinoa-egg-sandwich",
      "build/tenon-quinoa-protein-sandwich",
      "build/tenon-raspberry-egg-sandwich",
      "build/tenon-raspberry-protein-sandwich",
      "build/tenon-rice-flour-egg-sandwich",
      "build/tenon-rice-flour-protein-sandwich",
      "build/tenon-salt-egg-sandwich",
      "build/tenon-salt-protein-sandwich",
      "build/tenon-sesame-egg-sandwich",
      "build/tenon-sesame-protein-sandwich",
      "build/tenon-soy-isolate-egg-sandwich",
      "build/tenon-soy-isolate-protein-sandwich",
      "build/tenon-spinach-egg-sandwich",
      "build/tenon-spinach-egg-sandwich-elevated",
      "build/tenon-spinach-protein-sandwich",
      "build/tenon-strawberry-egg-sandwich",
      "build/tenon-strawberry-protein-sandwich",
      "build/tenon-sunflower-seed-egg-sandwich",
      "build/tenon-sunflower-seed-protein-sandwich",
      "build/tenon-tahini-egg-sandwich",
      "build/tenon-tahini-protein-sandwich",
      "build/tenon-tea-egg-sandwich",
      "build/tenon-tea-protein-sandwich",
      "build/tenon-tomato-egg-sandwich",
      "build/tenon-tomato-protein-sandwich",
      "build/tenon-unisoy-egg-sandwich",
      "build/tenon-unisoy-protein-sandwich",
      "build/tenon-vanilla-egg-sandwich",
      "build/tenon-walnut-egg-sandwich",
      "build/tenon-walnut-protein-sandwich",
      "build/tenon-water-egg-sandwich",
      "build/tenon-water-protein-sandwich",
      "build/tenon-whey-egg-sandwich",
      "build/tenon-whey-protein-sandwich",
      "build/tenon-whole-wheat-egg-sandwich",
      "build/tenon-whole-wheat-protein-sandwich",
      "build/tenon-yogurt-egg-sandwich",
      "build/tenon-yogurt-protein-sandwich",
    ]);
    expect(build(data, "tenon-pb-protein-sandwich").used_by).toEqual(["menu/tenon-pb-protein-sandwich"]);
    expect(build(data, "tenon-egg-protein-sandwich").used_by).toEqual(["menu/tenon-egg-protein-sandwich"]);
    expect(build(data, "tenon-blueberry-overnight-oats").used_by).toEqual(["menu/tenon-blueberry-overnight-oats"]);
    expect(build(data, "tenon-honey-oat-bar").used_by).toEqual(["menu/tenon-honey-oat-bar"]);
    expect(variant(data, "tenon-blueberry-overnight-oats", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["gluten", "milk", "soy"]),
    );
    expect(variant(data, "tenon-honey-oat-bar", "baked").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "gluten", "milk", "peanut"]),
    );
    expect(build(data, "tenon-chia-pudding").used_by).toEqual(["menu/tenon-chia-pudding"]);
    expect(variant(data, "tenon-chia-pudding", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["milk", "soy"]),
    );
    expect(build(data, "tenon-strawberry-chia").derived_from).toBe("build/tenon-chia-pudding@0.1.0");
    expect(build(data, "tenon-strawberry-chia").used_by).toEqual(["menu/tenon-strawberry-chia"]);
    expect(build(data, "tenon-strawberry-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-strawberry-overnight-oats").used_by).toEqual([
      "menu/tenon-strawberry-overnight-oats",
    ]);
    expect(build(data, "tenon-banana-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-banana-overnight-oats").used_by).toEqual([
      "menu/tenon-banana-overnight-oats",
    ]);
    expect(build(data, "tenon-cottage-cheese-berry-bowl").used_by).toEqual([
      "menu/tenon-cottage-cheese-berry-bowl",
    ]);
    expect(variant(data, "tenon-cottage-cheese-berry-bowl", "assembled").composition.allergens).toEqual([
      "milk",
    ]);
    expect(build(data, "tenon-strawberry-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-strawberry-cottage-bowl").used_by).toEqual([
      "menu/tenon-strawberry-cottage-bowl",
    ]);
    expect(build(data, "tenon-date-pb-bites").used_by).toEqual(["menu/tenon-date-pb-bites"]);
    expect(variant(data, "tenon-date-pb-bites", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["gluten", "milk", "peanut"]),
    );
    expect(build(data, "tenon-cocoa-chia").derived_from).toBe("build/tenon-chia-pudding@0.1.0");
    expect(build(data, "tenon-cocoa-chia").used_by).toEqual(["menu/tenon-cocoa-chia"]);
    expect(build(data, "tenon-yogurt-honey-bowl").used_by).toEqual(["menu/tenon-yogurt-honey-bowl"]);
    expect(variant(data, "tenon-yogurt-honey-bowl", "assembled").composition.allergens).toEqual(["milk"]);
    expect(build(data, "tenon-strawberry-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-strawberry-yogurt-bowl").used_by).toEqual([
      "menu/tenon-strawberry-yogurt-bowl",
    ]);
    expect(build(data, "tenon-matcha-chia").derived_from).toBe("build/tenon-chia-pudding@0.1.0");
    expect(build(data, "tenon-matcha-chia").used_by).toEqual(["menu/tenon-matcha-chia"]);
    expect(build(data, "tenon-banana-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-banana-yogurt-bowl").used_by).toEqual(["menu/tenon-banana-yogurt-bowl"]);
    expect(build(data, "tenon-cinnamon-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-cinnamon-overnight-oats").used_by).toEqual([
      "menu/tenon-cinnamon-overnight-oats",
    ]);
    expect(build(data, "tenon-banana-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-banana-cottage-bowl").used_by).toEqual([
      "menu/tenon-banana-cottage-bowl",
    ]);
    expect(build(data, "tenon-espresso-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-espresso-overnight-oats").used_by).toEqual([
      "menu/tenon-espresso-overnight-oats",
    ]);
    expect(build(data, "tenon-pb-banana-sandwich").derived_from).toBe(
      "build/tenon-pb-protein-sandwich@0.1.0",
    );
    expect(build(data, "tenon-pb-banana-sandwich").used_by).toEqual(["menu/tenon-pb-banana-sandwich"]);
    expect(build(data, "tenon-cocoa-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-cocoa-overnight-oats").used_by).toEqual([
      "menu/tenon-cocoa-overnight-oats",
    ]);
    expect(build(data, "tenon-egg-banana-sandwich").derived_from).toBe(
      "build/tenon-egg-protein-sandwich@0.1.0",
    );
    expect(build(data, "tenon-egg-banana-sandwich").used_by).toEqual([
      "menu/tenon-egg-banana-sandwich",
    ]);
    expect(build(data, "tenon-matcha-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-matcha-overnight-oats").used_by).toEqual([
      "menu/tenon-matcha-overnight-oats",
    ]);
    expect(build(data, "tenon-honey-date-bites").derived_from).toBe(
      "build/tenon-date-pb-bites@0.1.0",
    );
    expect(build(data, "tenon-honey-date-bites").used_by).toEqual(["menu/tenon-honey-date-bites"]);
    expect(variant(data, "tenon-honey-date-bites", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["gluten", "milk"]),
    );
    expect(variant(data, "tenon-honey-date-bites", "assembled").composition.allergens).not.toContain(
      "peanut",
    );
    expect(build(data, "tenon-pistachio-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-pistachio-overnight-oats").used_by).toEqual([
      "menu/tenon-pistachio-overnight-oats",
    ]);
    expect(variant(data, "tenon-pistachio-overnight-oats", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["gluten", "milk", "soy", "tree_nut"]),
    );
    expect(build(data, "tenon-cinnamon-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-cinnamon-yogurt-bowl").used_by).toEqual([
      "menu/tenon-cinnamon-yogurt-bowl",
    ]);
    expect(build(data, "tenon-tea-chia").derived_from).toBe("build/tenon-chia-pudding@0.1.0");
    expect(build(data, "tenon-tea-chia").used_by).toEqual(["menu/tenon-tea-chia"]);
    expect(build(data, "tenon-cocoa-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-cocoa-yogurt-bowl").used_by).toEqual(["menu/tenon-cocoa-yogurt-bowl"]);
    expect(build(data, "tenon-masala-overnight-oats").derived_from).toBe(
      "build/tenon-blueberry-overnight-oats@0.1.0",
    );
    expect(build(data, "tenon-masala-overnight-oats").used_by).toEqual([
      "menu/tenon-masala-overnight-oats",
    ]);
    expect(build(data, "tenon-matcha-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-matcha-yogurt-bowl").used_by).toEqual([
      "menu/tenon-matcha-yogurt-bowl",
    ]);
    expect(build(data, "tenon-cinnamon-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-cinnamon-cottage-bowl").used_by).toEqual([
      "menu/tenon-cinnamon-cottage-bowl",
    ]);
    expect(build(data, "tenon-almond-date-cookies").used_by).toEqual([
      "menu/tenon-almond-date-cookies",
    ]);
    expect(variant(data, "tenon-almond-date-cookies", "baked").composition.allergens).toEqual(
      expect.arrayContaining(["egg", "tree_nut"]),
    );
    expect(variant(data, "tenon-almond-date-cookies", "baked").composition.allergens).not.toContain(
      "gluten",
    );
    expect(build(data, "tenon-espresso-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-espresso-yogurt-bowl").used_by).toEqual([
      "menu/tenon-espresso-yogurt-bowl",
    ]);
    expect(build(data, "tenon-tea-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-tea-yogurt-bowl").used_by).toEqual(["menu/tenon-tea-yogurt-bowl"]);
    expect(build(data, "tenon-pistachio-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-pistachio-yogurt-bowl").used_by).toEqual([
      "menu/tenon-pistachio-yogurt-bowl",
    ]);
    expect(variant(data, "tenon-pistachio-yogurt-bowl", "assembled").composition.allergens).toEqual(
      expect.arrayContaining(["milk", "tree_nut"]),
    );
    expect(build(data, "tenon-cocoa-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-cocoa-cottage-bowl").used_by).toEqual([
      "menu/tenon-cocoa-cottage-bowl",
    ]);
    expect(build(data, "tenon-masala-yogurt-bowl").derived_from).toBe(
      "build/tenon-yogurt-honey-bowl@0.1.0",
    );
    expect(build(data, "tenon-masala-yogurt-bowl").used_by).toEqual([
      "menu/tenon-masala-yogurt-bowl",
    ]);
    expect(build(data, "tenon-matcha-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-matcha-cottage-bowl").used_by).toEqual([
      "menu/tenon-matcha-cottage-bowl",
    ]);
    expect(build(data, "tenon-espresso-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-espresso-cottage-bowl").used_by).toEqual([
      "menu/tenon-espresso-cottage-bowl",
    ]);
    expect(build(data, "tenon-tea-cottage-bowl").derived_from).toBe(
      "build/tenon-cottage-cheese-berry-bowl@0.1.0",
    );
    expect(build(data, "tenon-tea-cottage-bowl").used_by).toEqual([
      "menu/tenon-tea-cottage-bowl",
    ]);
  });
});
