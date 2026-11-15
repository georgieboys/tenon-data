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
