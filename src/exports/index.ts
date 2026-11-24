import type { CompiledDataset } from "../compile.ts";
import AllJson from "./all-json.ts";
import AllergensCsv from "./allergens-csv.ts";
import BuildsCsv from "./builds-csv.ts";
import CategoriesCsv from "./categories-csv.ts";
import ChassisCsv from "./chassis-csv.ts";
import DietCsv from "./diet-csv.ts";
import FormatsCsv from "./formats-csv.ts";
import GapsCsv from "./gaps-csv.ts";
import GraphJson from "./graph-json.ts";
import IndexJson from "./index-json.ts";
import IngredientsCsv from "./ingredients-csv.ts";
import LlmsFullTxt from "./llms-full-txt.ts";
import MenuCsv from "./menu-csv.ts";
import NutrientsJson from "./nutrients-json.ts";
import PlaceholdersCsv from "./placeholders-csv.ts";
import PrepsCsv from "./preps-csv.ts";
import RecordsNdjson from "./records-ndjson.ts";
import RemixesCsv from "./remixes-csv.ts";
import SourcesCsv from "./sources-csv.ts";
import StatsJson from "./stats-json.ts";
import VariantsCsv from "./variants-csv.ts";
import VerticalsCsv from "./verticals-csv.ts";

/**
 * Bulk downloads published as GitHub Release files on every data tag.
 * The site copies them into /api/v1 (and /llms-full.txt) at build time, so
 * they are served as static files and never computed in a function.
 */
export const EXPORTS: Record<string, (data: CompiledDataset) => string> = {
  "all.json": AllJson,
  "allergens.csv": AllergensCsv,
  "builds.csv": BuildsCsv,
  "categories.csv": CategoriesCsv,
  "chassis.csv": ChassisCsv,
  "diet.csv": DietCsv,
  "formats.csv": FormatsCsv,
  "gaps.csv": GapsCsv,
  "graph.json": GraphJson,
  "index.json": IndexJson,
  "ingredients.csv": IngredientsCsv,
  "llms-full.txt": LlmsFullTxt,
  "menu.csv": MenuCsv,
  "nutrients.json": NutrientsJson,
  "placeholders.csv": PlaceholdersCsv,
  "preps.csv": PrepsCsv,
  "records.ndjson": RecordsNdjson,
  "remixes.csv": RemixesCsv,
  "sources.csv": SourcesCsv,
  "stats.json": StatsJson,
  "variants.csv": VariantsCsv,
  "verticals.csv": VerticalsCsv,
};
