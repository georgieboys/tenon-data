import type {
  BuildVariant,
  CompiledBuild,
  CompiledDataset,
  CompiledIngredient,
  CompiledMenuProduct,
  CompiledPrep,
} from "./compile.ts";
import type { Composition } from "./nutrition.ts";
import { apiStats } from "./exports/stats-json.ts";

/**
 * Compact per-record shapes for list pages. A summary carries everything a
 * catalogue row needs (names, flags, default-variant nutrition) but none of
 * the heavy arrays: inputs, steps, every variant, used_by.
 */
interface SummaryBase {
  ref: string;
  id: string;
  code: string;
  name: string;
  version: string;
  description?: string;
  used_by_count: number;
}

export interface VariantSummary {
  key: string;
  format: BuildVariant["format"];
  selection: Record<string, string>;
  is_default: boolean;
  composition: Composition;
}

export interface IngredientSummary extends SummaryBase {
  kind: "ingredient";
  category: string;
  supplier?: CompiledIngredient["supplier"];
  basis: CompiledIngredient["basis"];
  composition: Composition;
}

export interface PrepSummary extends SummaryBase {
  kind: "prep";
  derived_from: string | null;
  yield: CompiledPrep["yield"];
  composition: Composition;
}

export interface BuildSummary extends SummaryBase {
  kind: "build";
  derived_from: string | null;
  vertical: CompiledBuild["vertical"];
  formats: CompiledBuild["formats"];
  variant_count: number;
  placeholder: boolean;
  allergens: string[];
  default: VariantSummary | null;
}

export interface MenuSummary extends SummaryBase {
  kind: "menu";
  build: string;
  /** Vertical of the build this product serves. */
  vertical: CompiledBuild["vertical"];
  /** True when the build is a chassis (not a remake). */
  chassis: boolean;
  status: CompiledMenuProduct["status"];
  formats: CompiledMenuProduct["formats"];
  options: CompiledMenuProduct["options"];
  price_sgd: number | null;
  default_variant: string;
  variant_count: number;
  default: VariantSummary | null;
}

export type RecordSummary = IngredientSummary | PrepSummary | BuildSummary | MenuSummary;

/** Dataset-wide aggregates the site shows without scanning every record. */
export interface DatasetStats extends ReturnType<typeof apiStats> {
  chassis: number;
  /** Builds containing each allergen in any variant. */
  build_allergens: Record<string, number>;
  /** Remake count per parent ref (`build/x` or `prep/x`). */
  remakes_by_parent: Record<string, number>;
  /** Builds where any variant inherits placeholder nutrition. */
  placeholder_builds: number;
  /** Food menu products whose build is a remake (kept off /menu, listed on menu.csv). */
  menu_remake_food: number;
}

const DRINK_VERTICALS = new Set(["coffee", "matcha", "cocoa", "tea"]);

export function parentRef(derived: string | null | undefined): string | null {
  if (!derived) return null;
  const match = /^(prep|build)\/([a-z0-9-]+)@/.exec(derived);
  return match ? `${match[1]}/${match[2]}` : derived;
}

function variantSummary(v: BuildVariant | undefined): VariantSummary | null {
  if (!v) return null;
  return { key: v.key, format: v.format, selection: v.selection, is_default: v.is_default, composition: v.composition };
}

function base(r: CompiledIngredient | CompiledPrep | CompiledBuild | CompiledMenuProduct): SummaryBase {
  return {
    ref: r.ref,
    id: r.id,
    code: r.code,
    name: r.name,
    version: r.version,
    ...(r.description ? { description: r.description } : {}),
    used_by_count: r.used_by.length,
  };
}

export const buildAllergens = (b: CompiledBuild) => [...new Set(b.variants.flatMap((v) => v.composition.allergens))].sort();

export function ingredientSummary(r: CompiledIngredient): IngredientSummary {
  return {
    kind: "ingredient",
    ...base(r),
    category: r.category,
    ...(r.supplier ? { supplier: r.supplier } : {}),
    basis: r.basis,
    composition: r.composition,
  };
}

export function prepSummary(r: CompiledPrep): PrepSummary {
  return { kind: "prep", ...base(r), derived_from: r.derived_from, yield: r.yield, composition: r.composition };
}

export function buildSummary(r: CompiledBuild): BuildSummary {
  return {
    kind: "build",
    ...base(r),
    derived_from: r.derived_from,
    vertical: r.vertical,
    formats: r.formats,
    variant_count: r.variants.length,
    placeholder: r.variants.some((v) => v.composition.placeholder),
    allergens: buildAllergens(r),
    default: variantSummary(r.variants.find((v) => v.is_default) ?? r.variants[0]),
  };
}

export function menuSummary(r: CompiledMenuProduct, build: CompiledBuild | undefined): MenuSummary {
  return {
    kind: "menu",
    ...base(r),
    build: r.build,
    vertical: build?.vertical ?? "food",
    chassis: !build?.derived_from,
    status: r.status,
    formats: r.formats,
    options: r.options,
    price_sgd: r.price_sgd,
    default_variant: r.default_variant,
    variant_count: r.variants.length,
    default: variantSummary(r.variants.find((v) => v.key === r.default_variant) ?? r.variants[0]),
  };
}

export function datasetStats(data: CompiledDataset): DatasetStats {
  const buildByRef = new Map(data.builds.map((b) => [b.ref, b]));
  const build_allergens: Record<string, number> = {};
  const remakes_by_parent: Record<string, number> = {};
  let placeholder_builds = 0;
  for (const b of data.builds) {
    for (const a of buildAllergens(b)) build_allergens[a] = (build_allergens[a] ?? 0) + 1;
    const parent = parentRef(b.derived_from);
    if (parent) remakes_by_parent[parent] = (remakes_by_parent[parent] ?? 0) + 1;
    if (b.variants.some((v) => v.composition.placeholder)) placeholder_builds += 1;
  }
  let menu_remake_food = 0;
  for (const m of data.menu) {
    const b = buildByRef.get(m.build);
    if (b?.derived_from && !DRINK_VERTICALS.has(b.vertical)) menu_remake_food += 1;
  }
  return {
    ...apiStats(data),
    chassis: data.builds.filter((b) => !b.derived_from).length,
    build_allergens,
    remakes_by_parent,
    placeholder_builds,
    menu_remake_food,
  };
}
