import { json } from "./util.ts";
import type { CompiledDataset } from "../compile.ts";

/**
 * Chassis-scoped dependency graph under Vercel's 20 MB ISR body limit.
 * Remake matrices dominate edge count; full trees stay on per-record JSON + builds.csv.
 */
export default function render(data: CompiledDataset): string {
  const chassis = data.builds.filter((b) => !b.derived_from);
  const chassisRefs = new Set(chassis.map((b) => b.ref));
  const remakeBuildsOmitted = data.builds.length - chassis.length;

  const nodes = [
    ...data.ingredients.map((r) => ({
      id: r.ref,
      kind: "ingredient" as const,
      code: r.code,
      name: r.name,
      html: `/blueprints/ingredients/${r.id}`,
      json: `/api/v1/ingredients/${r.id}.json`,
    })),
    ...data.preps.map((r) => ({
      id: r.ref,
      kind: "prep" as const,
      code: r.code,
      name: r.name,
      html: `/blueprints/preps/${r.id}`,
      json: `/api/v1/preps/${r.id}.json`,
    })),
    ...chassis.map((r) => ({
      id: r.ref,
      kind: "build" as const,
      code: r.code,
      name: r.name,
      html: `/blueprints/builds/${r.id}`,
      json: `/api/v1/builds/${r.id}.json`,
    })),
    ...data.menu
      .filter((r) => chassisRefs.has(r.build))
      .map((r) => ({
        id: r.ref,
        kind: "menu" as const,
        code: r.code,
        name: r.name,
        html: `/menu#${r.id}`,
        json: `/api/v1/menu/${r.id}.json`,
      })),
  ];

  const edges: { from: string; to: string; type: "uses" | "offers" }[] = [];

  for (const prep of data.preps) {
    for (const input of prep.inputs) {
      edges.push({ from: prep.ref, to: input.ref, type: "uses" });
    }
  }

  for (const build of chassis) {
    const seen = new Set<string>();
    for (const variant of build.variants) {
      for (const input of variant.inputs) {
        if (seen.has(input.ref)) continue;
        seen.add(input.ref);
        edges.push({ from: build.ref, to: input.ref, type: "uses" });
      }
    }
  }

  for (const item of data.menu) {
    if (!chassisRefs.has(item.build)) continue;
    edges.push({ from: item.ref, to: item.build, type: "offers" });
  }

  return json({
    schema_version: data.schema_version,
    data_version: data.data_version,
    description:
      "Chassis-scoped dependency graph: menu offers chassis builds; builds and preps use ingredients/preps. Remake matrices omitted for ISR size — see builds.csv and per-record JSON.",
    scope: "chassis",
    remake_builds_omitted: remakeBuildsOmitted,
    node_count: nodes.length,
    edge_count: edges.length,
    nodes,
    edges,
  });
}
