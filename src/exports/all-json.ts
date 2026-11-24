import type { CompiledDataset } from "../compile.ts";

const roundNumbers = (_key: string, value: unknown) =>
  typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value;

/** Drop bulky fields that remain available on per-record JSON endpoints. */
const OMIT = new Set([
  "steps",
  "notes",
  "source_file",
  "percent_ri",
  "used_by",
  "description",
  // composition trees dominate ISR size; full trees stay on /api/v1/{collection}/{id}.json
  "composition",
]);

function slim(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(slim);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (OMIT.has(key)) continue;
      out[key] = slim(child);
    }
    return out;
  }
  return value;
}

type Variantish = { key?: string; is_default?: boolean };

/** Builds/menu dominate ISR size via variant inputs; all.json keeps an index card only. */
function indexBuild(build: Record<string, unknown>) {
  const variants = Array.isArray(build.variants) ? (build.variants as Variantish[]) : [];
  const defaultVariant = variants.find((v) => v.is_default)?.key ?? variants[0]?.key ?? null;
  return {
    ref: build.ref,
    id: build.id,
    code: build.code,
    name: build.name,
    version: build.version,
    derived_from: build.derived_from ?? null,
    vertical: build.vertical,
    formats: build.formats,
    default_variant: defaultVariant,
    variant_count: variants.length,
  };
}

function indexMenu(item: Record<string, unknown>) {
  const variants = Array.isArray(item.variants) ? (item.variants as Variantish[]) : [];
  return {
    ref: item.ref,
    id: item.id,
    code: item.code,
    name: item.name,
    version: item.version,
    build: item.build,
    status: item.status,
    formats: item.formats,
    price_sgd: item.price_sgd,
    default_variant: item.default_variant ?? variants.find((v) => v.is_default)?.key ?? variants[0]?.key ?? null,
    variant_count: variants.length,
  };
}

/**
 * Compact catalogue dump under Vercel's 20 MB ISR body limit.
 * Full variant trees stay on /api/v1/builds/{id}.json and /api/v1/menu/{id}.json.
 */
export default function render(data: CompiledDataset): string {
  const base = slim(data) as Record<string, unknown>;
  const payload = {
    ...base,
    builds: Array.isArray(base.builds)
      ? (base.builds as Record<string, unknown>[]).map(indexBuild)
      : base.builds,
    menu: Array.isArray(base.menu)
      ? (base.menu as Record<string, unknown>[]).map(indexMenu)
      : base.menu,
  };
  return `${JSON.stringify(payload, roundNumbers)}\n`;
}
