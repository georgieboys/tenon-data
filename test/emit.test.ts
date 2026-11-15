import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { emit } from "../src/emit.ts";
import { formatNutrient } from "../src/markdown.ts";
import { compileDataset, repoDataset } from "./helpers.ts";

describe("exports", () => {
  it("writes the static API and Markdown exports", async () => {
    const out = await mkdtemp(join(tmpdir(), "tenon-dist-"));
    try {
      await emit(compileDataset(await repoDataset(), { dataVersion: "9.9.9" }), out);

      const index = JSON.parse(await readFile(join(out, "api/v1/index.json"), "utf8"));
      expect(index.data_version).toBe("9.9.9");
      expect(index.builds).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ ref: "build/tenon-matcha", code: "BLD-001", name: "Tenon Matcha" }),
          expect.objectContaining({ ref: "build/tenon-cocoa", code: "BLD-002", name: "Tenon Cocoa" }),
          expect.objectContaining({ ref: "build/tenon-latte", code: "BLD-003", name: "Tenon Latte" }),
          expect.objectContaining({ ref: "build/tenon-tea", code: "BLD-004", name: "Tenon Tea" }),
          expect.objectContaining({ ref: "build/tenon-americano", code: "BLD-005", name: "Tenon Americano" }),
          expect.objectContaining({ ref: "build/tenon-masala-chai", code: "BLD-006", name: "Tenon Masala Chai" }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-pb-ice-cream",
            code: "BLD-007",
            name: "Tenon Cocoa–Peanut Butter Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-matcha-ice-cream",
            code: "BLD-008",
            name: "Tenon Pistachio–Matcha Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-teh-tarik-ice-cream",
            code: "BLD-009",
            name: "Tenon Spiced Teh Tarik Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-bulletproof-ice-cream",
            code: "BLD-010",
            name: "Tenon Bulletproof-Style Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-energy-fruitcake",
            code: "BLD-011",
            name: "Tenon Energy Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-cheesecake",
            code: "BLD-012",
            name: "Tenon Banana Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-protein-sandwich",
            code: "BLD-013",
            name: "Tenon Peanut Butter Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-egg-protein-sandwich",
            code: "BLD-014",
            name: "Tenon Egg Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-overnight-oats",
            code: "BLD-015",
            name: "Tenon Blueberry Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-oat-bar",
            code: "BLD-016",
            name: "Tenon Honey Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-chia-pudding",
            code: "BLD-017",
            name: "Tenon Chia Pudding",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-chia",
            code: "BLD-018",
            name: "Tenon Strawberry Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-overnight-oats",
            code: "BLD-019",
            name: "Tenon Strawberry Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-overnight-oats",
            code: "BLD-020",
            name: "Tenon Banana Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cottage-cheese-berry-bowl",
            code: "BLD-021",
            name: "Tenon Cottage Cheese Berry Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-cottage-bowl",
            code: "BLD-022",
            name: "Tenon Strawberry Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-pb-bites",
            code: "BLD-023",
            name: "Tenon Date Peanut Butter Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-chia",
            code: "BLD-024",
            name: "Tenon Cocoa Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-yogurt-honey-bowl",
            code: "BLD-025",
            name: "Tenon Yogurt Honey Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-yogurt-bowl",
            code: "BLD-026",
            name: "Tenon Strawberry Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-chia",
            code: "BLD-027",
            name: "Tenon Matcha Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-yogurt-bowl",
            code: "BLD-028",
            name: "Tenon Banana Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-overnight-oats",
            code: "BLD-029",
            name: "Tenon Cinnamon Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-cottage-bowl",
            code: "BLD-030",
            name: "Tenon Banana Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-overnight-oats",
            code: "BLD-031",
            name: "Tenon Espresso Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-banana-sandwich",
            code: "BLD-032",
            name: "Tenon Peanut Butter Banana Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-overnight-oats",
            code: "BLD-033",
            name: "Tenon Cocoa Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-egg-banana-sandwich",
            code: "BLD-034",
            name: "Tenon Egg Banana Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-overnight-oats",
            code: "BLD-035",
            name: "Tenon Matcha Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-date-bites",
            code: "BLD-036",
            name: "Tenon Honey Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-overnight-oats",
            code: "BLD-037",
            name: "Tenon Pistachio Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-yogurt-bowl",
            code: "BLD-038",
            name: "Tenon Cinnamon Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-chia",
            code: "BLD-039",
            name: "Tenon Tea Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-yogurt-bowl",
            code: "BLD-040",
            name: "Tenon Cocoa Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-overnight-oats",
            code: "BLD-041",
            name: "Tenon Masala Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-yogurt-bowl",
            code: "BLD-042",
            name: "Tenon Matcha Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-cottage-bowl",
            code: "BLD-043",
            name: "Tenon Cinnamon Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-date-cookies",
            code: "BLD-044",
            name: "Tenon Almond Date Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-yogurt-bowl",
            code: "BLD-045",
            name: "Tenon Espresso Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-yogurt-bowl",
            code: "BLD-046",
            name: "Tenon Tea Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-yogurt-bowl",
            code: "BLD-047",
            name: "Tenon Pistachio Yogurt Bowl",
          }),
        ]),
      );

      const buildJson = JSON.parse(await readFile(join(out, "api/v1/builds/tenon-matcha.json"), "utf8"));
      expect(buildJson.variants).toHaveLength(9);

      const md = await readFile(join(out, "markdown/builds/tenon-matcha.md"), "utf8");
      expect(md).toContain("# BLD-001 · Tenon Matcha");
      expect(md).not.toContain("**Placeholder data.**");
      expect(md).toContain("`hot.soy-whey-milk` (default)");
      expect(md).toContain("| Vitamin D (µg) | unknown | unknown | unknown | unknown |");
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });

  it("formats unknown and incomplete values honestly", () => {
    expect(formatNutrient({ value: null, complete: false })).toBe("unknown");
    expect(formatNutrient({ value: 0, complete: false })).toBe("unknown");
    expect(formatNutrient({ value: 116.2, complete: false })).toBe("≥ 116");
    expect(formatNutrient({ value: 0, complete: true })).toBe("0");
    expect(formatNutrient({ value: 13.76, complete: true })).toBe("13.8");
  });
});
