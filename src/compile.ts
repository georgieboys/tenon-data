import { combine, ingredientComposition, percentOfReference } from "./nutrition.ts";
import type { Composition, DeclaredValue, PercentOfReference } from "./nutrition.ts";
import { massInGrams } from "./units.ts";
import { lookupComponent } from "./validate.ts";
import type {
  Build,
  BuildInput,
  ComponentInput,
  Dataset,
  Format,
  NutrientCatalog,
  Slot,
  Source,
  Step,
  Unit,
} from "./types.ts";

export const SCHEMA_VERSION = 1;

export interface ResolvedInput {
  ref: string;
  /** Set when the component was chosen through a build slot. */
  slot?: string;
  code: string;
  name: string;
  qty: number;
  unit: Unit;
  grams: number;
  temp_c?: number;
  note?: string;
}

interface CompiledBase {
  ref: string;
  id: string;
  code: string;
  name: string;
  version: string;
  description?: string;
  /** Records that reference this one directly. */
  used_by: string[];
  notes: string;
  source_file: string;
}

export interface CompiledIngredient extends CompiledBase {
  category: string;
  supplier?: { name: string; product?: string; notes?: string };
  basis: "per_100g" | "per_100ml";
  density_g_per_ml?: number;
  declared_nutrition: Record<string, DeclaredValue>;
  sources: Record<string, Source>;
  composition: Composition;
}

export interface CompiledPrep extends CompiledBase {
  derived_from: string | null;
  inputs: ResolvedInput[];
  yield: { method: "sum" | "measured" | "estimated"; mass_g: number; input_mass_g: number };
  density_g_per_ml?: number;
  retention?: Record<string, number>;
  storage?: { temp_c?: number; shelf_life_h?: number; notes?: string };
  steps: Step[];
  composition: Composition;
}

export interface BuildVariant {
  /** e.g. "hot.soy-whey-milk": the format followed by the chosen option for each slot. */
  key: string;
  format: Format;
  selection: Record<string, string>;
  /** True when every slot uses the build's default option. */
  is_default: boolean;
  inputs: ResolvedInput[];
  steps: Step[];
  /** Per serving: mass_g is the serving mass. */
  composition: Composition;
  /** Per serving, as a percentage of each daily reference intake. */
  percent_ri: PercentOfReference;
}

export interface CompiledBuild extends CompiledBase {
  derived_from: string | null;
  vertical: Build["vertical"];
  slots: Record<string, Slot>;
  formats: Format[];
  variants: BuildVariant[];
}

export interface CompiledMenuProduct extends CompiledBase {
  build: string;
  status: "planned" | "available" | "retired";
  formats: Format[];
  options: Record<string, string[]>;
  price_sgd: number | null;
  variants: BuildVariant[];
  default_variant: string;
}

export interface CompiledDataset {
  schema_version: number;
  data_version: string;
  nutrients: NutrientCatalog;
  ingredients: CompiledIngredient[];
  preps: CompiledPrep[];
  builds: CompiledBuild[];
  menu: CompiledMenuProduct[];
}

const byCode = <T extends { code: string }>(a: T, b: T) => a.code.localeCompare(b.code);

function cartesian<T>(lists: T[][]): T[][] {
  return lists.reduce<T[][]>((acc, list) => acc.flatMap((combo) => list.map((x) => [...combo, x])), [[]]);
}

/**
 * Resolves the full Ingredient -> Prep -> Build -> Menu graph and calculates
 * nutrition at every level. Run validateDataset first; this throws on the
 * first unresolvable reference rather than collecting issues.
 */
export function compileDataset(ds: Dataset, options: { dataVersion?: string } = {}): CompiledDataset {
  const nutrientDefs = ds.nutrients.nutrients;
  const keys = nutrientDefs.map((n) => n.key);
  const memo = new Map<string, Composition>();
  const declaredByIngredient = new Map<string, Record<string, DeclaredValue>>();
  const preparedYield = new Map<string, CompiledPrep["yield"]>();
  const usedBy = new Map<string, Set<string>>();

  const markUse = (ref: string, by: string) => {
    if (!usedBy.has(ref)) usedBy.set(ref, new Set());
    usedBy.get(ref)!.add(by);
  };

  const resolveInput = (input: ComponentInput, slot?: string): ResolvedInput => {
    const target = lookupComponent(ds, input.ref);
    if (!target) throw new Error(`unknown reference ${input.ref}`);
    return {
      ref: input.ref,
      ...(slot ? { slot } : {}),
      code: target.code,
      name: target.name,
      qty: input.qty,
      unit: input.unit,
      grams: massInGrams(input.qty, input.unit, target.density_g_per_ml),
      ...(input.temp_c !== undefined ? { temp_c: input.temp_c } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
    };
  };

  const compositionOf = (ref: string, stack: string[] = []): Composition => {
    const cached = memo.get(ref);
    if (cached) return cached;
    if (stack.includes(ref)) throw new Error(`circular reference: ${[...stack, ref].join(" -> ")}`);

    const [kind, id] = ref.split("/");
    let result: Composition;
    if (kind === "ingredient" && ds.ingredient[id!]) {
      const { composition, declared } = ingredientComposition(ds.ingredient[id!]!, keys);
      declaredByIngredient.set(ref, declared);
      result = composition;
    } else if (kind === "prep" && ds.prep[id!]) {
      const prep = ds.prep[id!]!;
      const parts = prep.inputs.map((input) => {
        const resolved = resolveInput(input);
        return { composition: compositionOf(resolved.ref, [...stack, ref]), grams: resolved.grams };
      });
      const inputMass = parts.reduce((sum, p) => sum + p.grams, 0);
      const mass = prep.yield.method === "sum" ? inputMass : prep.yield.mass_g;
      preparedYield.set(ref, { method: prep.yield.method, mass_g: mass, input_mass_g: inputMass });
      result = combine(keys, parts, mass, prep.retention);
    } else {
      throw new Error(`unknown reference ${ref}`);
    }
    memo.set(ref, result);
    return result;
  };

  const buildVariants = (build: Build): BuildVariant[] => {
    const slots = build.slots ?? {};
    const variants: BuildVariant[] = [];
    for (const [format, spec] of Object.entries(build.formats) as [Format, { inputs: BuildInput[]; steps: Step[] }][]) {
      const usedSlots = Object.keys(slots).filter((name) =>
        spec.inputs.some((input) => "slot" in input && input.slot === name),
      );
      for (const combo of cartesian(usedSlots.map((name) => slots[name]!.options))) {
        const selection = Object.fromEntries(usedSlots.map((name, i) => [name, combo[i]!]));
        const inputs = spec.inputs.map((input) =>
          "slot" in input
            ? resolveInput({ ...input, ref: selection[input.slot]! }, input.slot)
            : resolveInput(input),
        );
        const servingMass = inputs.reduce((sum, i) => sum + i.grams, 0);
        const composition = combine(
          keys,
          inputs.map((i) => ({ composition: compositionOf(i.ref), grams: i.grams })),
          servingMass,
        );
        variants.push({
          key: [format, ...usedSlots.map((name) => selection[name]!.split("/")[1])].join("."),
          format,
          selection,
          is_default: usedSlots.every((name) => selection[name] === slots[name]!.default),
          inputs,
          steps: spec.steps,
          composition,
          percent_ri: percentOfReference(composition.totals, nutrientDefs),
        });
      }
    }
    return variants;
  };

  const ingredients: CompiledIngredient[] = Object.values(ds.ingredient).map((ing) => {
    const ref = `ingredient/${ing.id}`;
    const composition = compositionOf(ref);
    return {
      ref,
      id: ing.id,
      code: ing.code,
      name: ing.name,
      version: ing.version,
      ...(ing.description !== undefined ? { description: ing.description } : {}),
      category: ing.category,
      ...(ing.supplier ? { supplier: ing.supplier } : {}),
      basis: ing.basis,
      ...(ing.density_g_per_ml !== undefined ? { density_g_per_ml: ing.density_g_per_ml } : {}),
      declared_nutrition: declaredByIngredient.get(ref)!,
      sources: ing.sources,
      composition,
      used_by: [],
      notes: ing.body,
      source_file: ing.file,
    };
  });

  const preps: CompiledPrep[] = Object.values(ds.prep).map((prep) => {
    const ref = `prep/${prep.id}`;
    const composition = compositionOf(ref);
    for (const input of prep.inputs) markUse(input.ref, ref);
    return {
      ref,
      id: prep.id,
      code: prep.code,
      name: prep.name,
      version: prep.version,
      ...(prep.description !== undefined ? { description: prep.description } : {}),
      derived_from: prep.derived_from ?? null,
      inputs: prep.inputs.map((input) => resolveInput(input)),
      yield: preparedYield.get(ref)!,
      ...(prep.density_g_per_ml !== undefined ? { density_g_per_ml: prep.density_g_per_ml } : {}),
      ...(prep.retention ? { retention: prep.retention } : {}),
      ...(prep.storage ? { storage: prep.storage } : {}),
      steps: prep.steps,
      composition,
      used_by: [],
      notes: prep.body,
      source_file: prep.file,
    };
  });

  const compiledBuilds = new Map<string, CompiledBuild>();
  const builds: CompiledBuild[] = Object.values(ds.build).map((build) => {
    const ref = `build/${build.id}`;
    for (const spec of Object.values(build.formats)) {
      for (const input of spec.inputs) {
        if ("ref" in input) markUse(input.ref, ref);
        else for (const option of build.slots?.[input.slot]?.options ?? []) markUse(option, ref);
      }
    }
    const compiled: CompiledBuild = {
      ref,
      id: build.id,
      code: build.code,
      name: build.name,
      version: build.version,
      ...(build.description !== undefined ? { description: build.description } : {}),
      derived_from: build.derived_from ?? null,
      vertical: build.vertical,
      slots: build.slots ?? {},
      formats: Object.keys(build.formats) as Format[],
      variants: buildVariants(build),
      used_by: [],
      notes: build.body,
      source_file: build.file,
    };
    compiledBuilds.set(ref, compiled);
    return compiled;
  });

  const menu: CompiledMenuProduct[] = Object.values(ds.menu).map((item) => {
    const ref = `menu/${item.id}`;
    const build = compiledBuilds.get(item.build);
    if (!build) throw new Error(`unknown reference ${item.build}`);
    markUse(item.build, ref);

    const offered: Record<string, string[]> = Object.fromEntries(
      Object.entries(build.slots).map(([name, slot]) => [name, item.options?.[name] ?? slot.options]),
    );
    const variants = build.variants.filter(
      (v) =>
        item.formats.includes(v.format) &&
        Object.entries(v.selection).every(([name, option]) => offered[name]!.includes(option)),
    );
    const defaultSelection = Object.fromEntries(
      Object.entries(build.slots).map(([name, slot]) => [
        name,
        offered[name]!.includes(slot.default) ? slot.default : offered[name]![0]!,
      ]),
    );
    const defaultVariant =
      variants.find(
        (v) =>
          v.format === item.formats[0] &&
          Object.entries(v.selection).every(([name, option]) => defaultSelection[name] === option),
      ) ?? variants[0];
    if (!defaultVariant) throw new Error(`${item.file}: no variants match the offered formats and options`);

    return {
      ref,
      id: item.id,
      code: item.code,
      name: item.name,
      version: item.version,
      ...(item.description !== undefined ? { description: item.description } : {}),
      build: item.build,
      status: item.status,
      formats: item.formats,
      options: offered,
      price_sgd: item.price_sgd ?? null,
      variants,
      default_variant: defaultVariant.key,
      used_by: [],
      notes: item.body,
      source_file: item.file,
    };
  });

  for (const record of [...ingredients, ...preps, ...builds, ...menu]) {
    record.used_by = [...(usedBy.get(record.ref) ?? [])].sort();
  }

  return {
    schema_version: SCHEMA_VERSION,
    data_version: options.dataVersion ?? "0.0.0",
    nutrients: ds.nutrients,
    ingredients: ingredients.sort(byCode),
    preps: preps.sort(byCode),
    builds: builds.sort(byCode),
    menu: menu.sort(byCode),
  };
}
