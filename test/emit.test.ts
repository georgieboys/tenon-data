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
          expect.objectContaining({
            ref: "build/tenon-cocoa-cottage-bowl",
            code: "BLD-048",
            name: "Tenon Cocoa Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-yogurt-bowl",
            code: "BLD-049",
            name: "Tenon Masala Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-cottage-bowl",
            code: "BLD-050",
            name: "Tenon Matcha Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-cottage-bowl",
            code: "BLD-051",
            name: "Tenon Espresso Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-cottage-bowl",
            code: "BLD-052",
            name: "Tenon Tea Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-cottage-bowl",
            code: "BLD-053",
            name: "Tenon Pistachio Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-cottage-bowl",
            code: "BLD-054",
            name: "Tenon Masala Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-overnight-oats",
            code: "BLD-055",
            name: "Tenon Tea Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-chia",
            code: "BLD-056",
            name: "Tenon Banana Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-chia",
            code: "BLD-057",
            name: "Tenon Espresso Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-chia",
            code: "BLD-058",
            name: "Tenon Cinnamon Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-chia",
            code: "BLD-059",
            name: "Tenon Masala Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-chia",
            code: "BLD-060",
            name: "Tenon Pistachio Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-cottage-protein-sandwich",
            code: "BLD-061",
            name: "Tenon Cottage Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-oat-bar",
            code: "BLD-062",
            name: "Tenon Cocoa Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-oat-bar",
            code: "BLD-063",
            name: "Tenon Matcha Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-oat-bar",
            code: "BLD-064",
            name: "Tenon Cinnamon Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-oat-bar",
            code: "BLD-065",
            name: "Tenon Date Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-oat-bar",
            code: "BLD-066",
            name: "Tenon Masala Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-oat-bar",
            code: "BLD-067",
            name: "Tenon Pistachio Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-yogurt-protein-sandwich",
            code: "BLD-068",
            name: "Tenon Yogurt Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-oat-bar",
            code: "BLD-069",
            name: "Tenon Espresso Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-oat-bar",
            code: "BLD-070",
            name: "Tenon Banana Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-oat-bar",
            code: "BLD-071",
            name: "Tenon Strawberry Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-oat-bar",
            code: "BLD-072",
            name: "Tenon Tea Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-date-bites",
            code: "BLD-073",
            name: "Tenon Cocoa Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-date-bites",
            code: "BLD-074",
            name: "Tenon Matcha Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-date-bites",
            code: "BLD-075",
            name: "Tenon Pistachio Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-date-bites",
            code: "BLD-076",
            name: "Tenon Cinnamon Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-almond-cookies",
            code: "BLD-077",
            name: "Tenon Cocoa Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-almond-cookies",
            code: "BLD-078",
            name: "Tenon Matcha Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-almond-cookies",
            code: "BLD-079",
            name: "Tenon Cinnamon Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-almond-cookies",
            code: "BLD-080",
            name: "Tenon Espresso Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-protein-sandwich",
            code: "BLD-081",
            name: "Tenon Honey Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-protein-sandwich",
            code: "BLD-082",
            name: "Tenon Date Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-protein-sandwich",
            code: "BLD-083",
            name: "Tenon Pistachio Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-protein-sandwich",
            code: "BLD-084",
            name: "Tenon Blueberry Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-fruitcake",
            code: "BLD-085",
            name: "Tenon Cocoa Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-fruitcake",
            code: "BLD-086",
            name: "Tenon Cinnamon Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-fruitcake",
            code: "BLD-087",
            name: "Tenon Matcha Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-fruitcake",
            code: "BLD-088",
            name: "Tenon Espresso Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-cheesecake",
            code: "BLD-089",
            name: "Tenon Strawberry Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-cheesecake",
            code: "BLD-090",
            name: "Tenon Blueberry Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-cheesecake",
            code: "BLD-091",
            name: "Tenon Cocoa Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-cheesecake",
            code: "BLD-092",
            name: "Tenon Matcha Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-cheesecake",
            code: "BLD-093",
            name: "Tenon Espresso Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-cheesecake",
            code: "BLD-094",
            name: "Tenon Cinnamon Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-almond-cookies",
            code: "BLD-095",
            name: "Tenon Tea Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-almond-cookies",
            code: "BLD-096",
            name: "Tenon Masala Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-fruitcake",
            code: "BLD-097",
            name: "Tenon Tea Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-fruitcake",
            code: "BLD-098",
            name: "Tenon Masala Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-fruitcake",
            code: "BLD-099",
            name: "Tenon Pistachio Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-protein-sandwich",
            code: "BLD-100",
            name: "Tenon Strawberry Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-cheesecake",
            code: "BLD-101",
            name: "Tenon Pistachio Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-cheesecake",
            code: "BLD-102",
            name: "Tenon Tea Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-cheesecake",
            code: "BLD-103",
            name: "Tenon Masala Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-oat-bar",
            code: "BLD-104",
            name: "Tenon Blueberry Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-date-bites",
            code: "BLD-105",
            name: "Tenon Espresso Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-date-bites",
            code: "BLD-106",
            name: "Tenon Tea Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-date-bites",
            code: "BLD-107",
            name: "Tenon Masala Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-almond-cookies",
            code: "BLD-108",
            name: "Tenon Strawberry Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-almond-cookies",
            code: "BLD-109",
            name: "Tenon Blueberry Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-almond-cookies",
            code: "BLD-110",
            name: "Tenon Banana Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-protein-sandwich",
            code: "BLD-111",
            name: "Tenon Cinnamon Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-protein-sandwich",
            code: "BLD-112",
            name: "Tenon Matcha Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-protein-sandwich",
            code: "BLD-113",
            name: "Tenon Cocoa Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-protein-sandwich",
            code: "BLD-114",
            name: "Tenon Tea Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-protein-sandwich",
            code: "BLD-115",
            name: "Tenon Espresso Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-almond-cookies",
            code: "BLD-116",
            name: "Tenon Pistachio Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-protein-sandwich",
            code: "BLD-117",
            name: "Tenon Masala Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-date-bites",
            code: "BLD-118",
            name: "Tenon Banana Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-date-bites",
            code: "BLD-119",
            name: "Tenon Blueberry Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-date-bites",
            code: "BLD-120",
            name: "Tenon Strawberry Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-fruitcake",
            code: "BLD-121",
            name: "Tenon Blueberry Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-fruitcake",
            code: "BLD-122",
            name: "Tenon Strawberry Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-fruitcake",
            code: "BLD-123",
            name: "Tenon Banana Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-egg-sandwich",
            code: "BLD-124",
            name: "Tenon Cocoa Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-egg-sandwich",
            code: "BLD-125",
            name: "Tenon Matcha Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-egg-sandwich",
            code: "BLD-126",
            name: "Tenon Cinnamon Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-dates-cottage-bowl",
            code: "BLD-127",
            name: "Tenon Dates Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-egg-sandwich",
            code: "BLD-128",
            name: "Tenon Espresso Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-egg-sandwich",
            code: "BLD-129",
            name: "Tenon Tea Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-egg-sandwich",
            code: "BLD-130",
            name: "Tenon Pistachio Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-egg-sandwich",
            code: "BLD-131",
            name: "Tenon Masala Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-cottage-bowl",
            code: "BLD-132",
            name: "Tenon Honey Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-cottage-bowl",
            code: "BLD-133",
            name: "Tenon PB Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-egg-sandwich",
            code: "BLD-134",
            name: "Tenon Blueberry Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-egg-sandwich",
            code: "BLD-135",
            name: "Tenon Strawberry Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-egg-sandwich",
            code: "BLD-136",
            name: "Tenon Date Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-egg-sandwich",
            code: "BLD-137",
            name: "Tenon Honey Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-dates-yogurt-bowl",
            code: "BLD-138",
            name: "Tenon Dates Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-chia",
            code: "BLD-139",
            name: "Tenon Date Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-yogurt-bowl",
            code: "BLD-140",
            name: "Tenon PB Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-chia",
            code: "BLD-141",
            name: "Tenon PB Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-chia",
            code: "BLD-142",
            name: "Tenon Honey Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-yogurt-bowl",
            code: "BLD-143",
            name: "Tenon Honey Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-overnight-oats",
            code: "BLD-144",
            name: "Tenon Date Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-overnight-oats",
            code: "BLD-145",
            name: "Tenon PB Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-overnight-oats",
            code: "BLD-146",
            name: "Tenon Honey Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cottage-egg-sandwich",
            code: "BLD-147",
            name: "Tenon Cottage Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-cheesecake",
            code: "BLD-148",
            name: "Tenon Date Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-cheesecake",
            code: "BLD-149",
            name: "Tenon Honey Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-cheesecake",
            code: "BLD-150",
            name: "Tenon PB Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-fruitcake",
            code: "BLD-151",
            name: "Tenon PB Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-fruitcake",
            code: "BLD-152",
            name: "Tenon Honey Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-almond-cookies",
            code: "BLD-153",
            name: "Tenon PB Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-almond-cookies",
            code: "BLD-154",
            name: "Tenon Honey Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-egg-sandwich",
            code: "BLD-155",
            name: "Tenon PB Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-yogurt-egg-sandwich",
            code: "BLD-156",
            name: "Tenon Yogurt Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-ice-cream",
            code: "BLD-157",
            name: "Tenon Banana Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-strawberry-ice-cream",
            code: "BLD-158",
            name: "Tenon Strawberry Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-honey-ice-cream",
            code: "BLD-159",
            name: "Tenon Honey Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-espresso-ice-cream",
            code: "BLD-160",
            name: "Tenon Espresso Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-blueberry-ice-cream",
            code: "BLD-161",
            name: "Tenon Blueberry Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-matcha-ice-cream",
            code: "BLD-162",
            name: "Tenon Matcha Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-tea-ice-cream",
            code: "BLD-163",
            name: "Tenon Tea Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-cocoa-ice-cream",
            code: "BLD-164",
            name: "Tenon Cocoa Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-date-ice-cream",
            code: "BLD-165",
            name: "Tenon Date Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-pistachio-ice-cream",
            code: "BLD-166",
            name: "Tenon Pistachio Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-cinnamon-ice-cream",
            code: "BLD-167",
            name: "Tenon Cinnamon Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-masala-ice-cream",
            code: "BLD-168",
            name: "Tenon Masala Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-yogurt-bowl",
            code: "BLD-169",
            name: "Tenon Almond Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-cottage-bowl",
            code: "BLD-170",
            name: "Tenon Almond Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-ice-cream",
            code: "BLD-171",
            name: "Tenon Almond Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-ice-cream",
            code: "BLD-172",
            name: "Tenon Coconut Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-pb-ice-cream",
            code: "BLD-173",
            name: "Tenon PB Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-oat-bar",
            code: "BLD-174",
            name: "Tenon Coconut Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-oat-bar",
            code: "BLD-175",
            name: "Tenon Almond Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-cheesecake",
            code: "BLD-176",
            name: "Tenon Almond Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-date-bites",
            code: "BLD-177",
            name: "Tenon Almond Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-overnight-oats",
            code: "BLD-178",
            name: "Tenon Almond Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-chia",
            code: "BLD-179",
            name: "Tenon Almond Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-egg-sandwich",
            code: "BLD-180",
            name: "Tenon Almond Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-cottage-bowl",
            code: "BLD-181",
            name: "Tenon Coconut Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-yogurt-bowl",
            code: "BLD-182",
            name: "Tenon Coconut Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-chia",
            code: "BLD-183",
            name: "Tenon Coconut Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-overnight-oats",
            code: "BLD-184",
            name: "Tenon Coconut Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-egg-sandwich",
            code: "BLD-185",
            name: "Tenon Coconut Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-almond-cookies",
            code: "BLD-186",
            name: "Tenon Coconut Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-fruitcake",
            code: "BLD-187",
            name: "Tenon Coconut Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-cheesecake",
            code: "BLD-188",
            name: "Tenon Coconut Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-date-bites",
            code: "BLD-189",
            name: "Tenon Coconut Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-coconut-protein-sandwich",
            code: "BLD-190",
            name: "Tenon Coconut Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-fruitcake",
            code: "BLD-191",
            name: "Tenon Almond Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-almond-protein-sandwich",
            code: "BLD-192",
            name: "Tenon Almond Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-banana-protein-sandwich",
            code: "BLD-193",
            name: "Tenon Banana Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-protein-sandwich",
            code: "BLD-194",
            name: "Tenon Cream Cheese Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-ice-cream",
            code: "BLD-195",
            name: "Tenon Cream Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-chia",
            code: "BLD-196",
            name: "Tenon Ginger Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-overnight-oats",
            code: "BLD-197",
            name: "Tenon Ginger Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-cottage-bowl",
            code: "BLD-198",
            name: "Tenon Cardamom Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-egg-sandwich",
            code: "BLD-199",
            name: "Tenon Ginger Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-egg-sandwich",
            code: "BLD-200",
            name: "Tenon Cream Cheese Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-cottage-bowl",
            code: "BLD-201",
            name: "Tenon Ginger Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-yogurt-bowl",
            code: "BLD-202",
            name: "Tenon Ginger Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-yogurt-bowl",
            code: "BLD-203",
            name: "Tenon Cardamom Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-chia",
            code: "BLD-204",
            name: "Tenon Cardamom Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-overnight-oats",
            code: "BLD-205",
            name: "Tenon Cardamom Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-egg-sandwich",
            code: "BLD-206",
            name: "Tenon Cardamom Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-ice-cream",
            code: "BLD-207",
            name: "Tenon Ginger Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-ice-cream",
            code: "BLD-208",
            name: "Tenon Cardamom Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-ice-cream",
            code: "BLD-209",
            name: "Tenon Cloves Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-oat-bar",
            code: "BLD-210",
            name: "Tenon Ginger Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-oat-bar",
            code: "BLD-211",
            name: "Tenon Cardamom Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-date-bites",
            code: "BLD-212",
            name: "Tenon Ginger Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-date-bites",
            code: "BLD-213",
            name: "Tenon Cardamom Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-almond-cookies",
            code: "BLD-214",
            name: "Tenon Ginger Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-almond-cookies",
            code: "BLD-215",
            name: "Tenon Cardamom Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-fruitcake",
            code: "BLD-216",
            name: "Tenon Ginger Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-fruitcake",
            code: "BLD-217",
            name: "Tenon Cardamom Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-cheesecake",
            code: "BLD-218",
            name: "Tenon Ginger Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-cheesecake",
            code: "BLD-219",
            name: "Tenon Cardamom Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-chia",
            code: "BLD-220",
            name: "Tenon Cloves Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-cottage-bowl",
            code: "BLD-221",
            name: "Tenon Cloves Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-yogurt-bowl",
            code: "BLD-222",
            name: "Tenon Cloves Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-overnight-oats",
            code: "BLD-223",
            name: "Tenon Cloves Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-egg-sandwich",
            code: "BLD-224",
            name: "Tenon Cloves Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-ginger-protein-sandwich",
            code: "BLD-225",
            name: "Tenon Ginger Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cardamom-protein-sandwich",
            code: "BLD-226",
            name: "Tenon Cardamom Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-oat-bar",
            code: "BLD-227",
            name: "Tenon Cloves Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-date-bites",
            code: "BLD-228",
            name: "Tenon Cloves Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-almond-cookies",
            code: "BLD-229",
            name: "Tenon Cloves Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-fruitcake",
            code: "BLD-230",
            name: "Tenon Cloves Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-cheesecake",
            code: "BLD-231",
            name: "Tenon Cloves Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cloves-protein-sandwich",
            code: "BLD-232",
            name: "Tenon Cloves Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-cottage-bowl",
            code: "BLD-233",
            name: "Tenon Cream Cheese Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-yogurt-bowl",
            code: "BLD-234",
            name: "Tenon Cream Cheese Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-chia",
            code: "BLD-235",
            name: "Tenon Cream Cheese Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-overnight-oats",
            code: "BLD-236",
            name: "Tenon Cream Cheese Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-ice-cream",
            code: "BLD-237",
            name: "Tenon Cream Cheese Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-cottage-bowl",
            code: "BLD-238",
            name: "Tenon Heavy Cream Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-yogurt-bowl",
            code: "BLD-239",
            name: "Tenon Heavy Cream Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-chia",
            code: "BLD-240",
            name: "Tenon Heavy Cream Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-overnight-oats",
            code: "BLD-241",
            name: "Tenon Heavy Cream Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-egg-sandwich",
            code: "BLD-242",
            name: "Tenon Heavy Cream Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-protein-sandwich",
            code: "BLD-243",
            name: "Tenon Heavy Cream Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-oat-bar",
            code: "BLD-244",
            name: "Tenon Heavy Cream Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-date-bites",
            code: "BLD-245",
            name: "Tenon Heavy Cream Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-almond-cookies",
            code: "BLD-246",
            name: "Tenon Heavy Cream Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-heavy-cream-fruitcake",
            code: "BLD-247",
            name: "Tenon Heavy Cream Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-oat-bar",
            code: "BLD-248",
            name: "Tenon Cream Cheese Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-date-bites",
            code: "BLD-249",
            name: "Tenon Cream Cheese Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-almond-cookies",
            code: "BLD-250",
            name: "Tenon Cream Cheese Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-fruitcake",
            code: "BLD-251",
            name: "Tenon Cream Cheese Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-cream-cheese-cheesecake",
            code: "BLD-252",
            name: "Tenon Cream Cheese Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-cottage-bowl",
            code: "BLD-253",
            name: "Tenon Whey Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-yogurt-bowl",
            code: "BLD-254",
            name: "Tenon Whey Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-chia",
            code: "BLD-255",
            name: "Tenon Whey Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-ice-cream",
            code: "BLD-256",
            name: "Tenon Whey Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-cottage-bowl",
            code: "BLD-257",
            name: "Tenon Soy Isolate Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-yogurt-bowl",
            code: "BLD-258",
            name: "Tenon Soy Isolate Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-chia",
            code: "BLD-259",
            name: "Tenon Soy Isolate Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-ice-cream",
            code: "BLD-260",
            name: "Tenon Soy Isolate Ice Cream",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-overnight-oats",
            code: "BLD-261",
            name: "Tenon Whey Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-overnight-oats",
            code: "BLD-262",
            name: "Tenon Soy Isolate Overnight Oats",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-egg-sandwich",
            code: "BLD-263",
            name: "Tenon Whey Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-egg-sandwich",
            code: "BLD-264",
            name: "Tenon Soy Isolate Egg Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-protein-sandwich",
            code: "BLD-265",
            name: "Tenon Whey Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-protein-sandwich",
            code: "BLD-266",
            name: "Tenon Soy Isolate Protein Sandwich",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-oat-bar",
            code: "BLD-267",
            name: "Tenon Whey Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-oat-bar",
            code: "BLD-268",
            name: "Tenon Soy Isolate Oat Bar",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-date-bites",
            code: "BLD-269",
            name: "Tenon Whey Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-date-bites",
            code: "BLD-270",
            name: "Tenon Soy Isolate Date Bites",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-almond-cookies",
            code: "BLD-271",
            name: "Tenon Whey Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-almond-cookies",
            code: "BLD-272",
            name: "Tenon Soy Isolate Almond Cookies",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-fruitcake",
            code: "BLD-273",
            name: "Tenon Whey Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-fruitcake",
            code: "BLD-274",
            name: "Tenon Soy Isolate Fruitcake",
          }),
          expect.objectContaining({
            ref: "build/tenon-whey-cheesecake",
            code: "BLD-275",
            name: "Tenon Whey Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-soy-isolate-cheesecake",
            code: "BLD-276",
            name: "Tenon Soy Isolate Cheesecake",
          }),
          expect.objectContaining({
            ref: "build/tenon-unisoy-cottage-bowl",
            code: "BLD-277",
            name: "Tenon Unisoy Cottage Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-unisoy-yogurt-bowl",
            code: "BLD-278",
            name: "Tenon Unisoy Yogurt Bowl",
          }),
          expect.objectContaining({
            ref: "build/tenon-unisoy-chia",
            code: "BLD-279",
            name: "Tenon Unisoy Chia",
          }),
          expect.objectContaining({
            ref: "build/tenon-unisoy-ice-cream",
            code: "BLD-280",
            name: "Tenon Unisoy Ice Cream",
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
