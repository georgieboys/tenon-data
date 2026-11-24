import type { CompiledDataset } from "../compile.ts";
import { json, licences } from "./util.ts";

const COLLECTIONS = ["ingredients", "preps", "builds", "menu"] as const;

function apiIndex(data: CompiledDataset) {
  return {
    schema_version: data.schema_version,
    data_version: data.data_version,
    licence: { code: licences.code.name, data: licences.data.name },
    openapi: "/api/v1/openapi.json",
    nutrients: "/api/v1/nutrients.json",
    all: "/api/v1/all.json",
    variants_csv: "/api/v1/variants.csv",
    menu_csv: "/api/v1/menu.csv",
    ingredients_csv: "/api/v1/ingredients.csv",
    preps_csv: "/api/v1/preps.csv",
    builds_csv: "/api/v1/builds.csv",
    allergens_csv: "/api/v1/allergens.csv",
    remixes_csv: "/api/v1/remixes.csv",
    formats_csv: "/api/v1/formats.csv",
    verticals_csv: "/api/v1/verticals.csv",
    chassis_csv: "/api/v1/chassis.csv",
    sources_csv: "/api/v1/sources.csv",
    placeholders_csv: "/api/v1/placeholders.csv",
    diet_csv: "/api/v1/diet.csv",
    categories_csv: "/api/v1/categories.csv",
    gaps_csv: "/api/v1/gaps.csv",
    records_ndjson: "/api/v1/records.ndjson",
    graph: "/api/v1/graph.json",
    stats: "/api/v1/stats.json",
    docs: {
      open: "/open",
      methodology: "/methodology",
      llms: "/llms.txt",
      llms_full: "/llms-full.txt",
      humans: "/humans.txt",
      ai: "/ai.txt",
    },
    ...Object.fromEntries(
      COLLECTIONS.map((c) => [
        c,
        data[c].map((r) => ({
          ref: r.ref,
          code: r.code,
          name: r.name,
          version: r.version,
          json: `/api/v1/${c}/${r.id}.json`,
          markdown: `/api/v1/${c}/${r.id}.md`,
        })),
      ]),
    ),
  };
}

export default function render(data: CompiledDataset): string {
  return json(apiIndex(data));
}
