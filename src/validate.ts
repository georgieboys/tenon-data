import { isVolume, massInGrams } from "./units.ts";
import type { Dataset, Ingredient, Issue, Prep, Step, Unit } from "./types.ts";

const ANIMAL_ALLERGENS = new Set(["milk", "egg", "fish", "crustacean", "mollusc"]);

type Component = Ingredient | Prep;

export function lookupComponent(ds: Dataset, ref: string): Component | undefined {
  const [kind, id] = ref.split("/");
  if (!id) return undefined;
  if (kind === "ingredient") return ds.ingredient[id];
  if (kind === "prep") return ds.prep[id];
  return undefined;
}

/**
 * Cross-record checks that JSON Schema cannot express. Assumes every record
 * already passed its schema (see loadDataset).
 */
export function validateDataset(ds: Dataset): Issue[] {
  const issues: Issue[] = [];
  const add = (file: string, message: string) => issues.push({ file, message });
  const nutrientKeys = new Set<string>();

  for (const n of ds.nutrients.nutrients) {
    if (nutrientKeys.has(n.key)) add("reference/nutrients.yaml", `duplicate nutrient key '${n.key}'`);
    nutrientKeys.add(n.key);
  }

  const codes = new Map<string, string>();
  for (const record of [
    ...Object.values(ds.ingredient),
    ...Object.values(ds.prep),
    ...Object.values(ds.build),
    ...Object.values(ds.menu),
  ]) {
    const existing = codes.get(record.code);
    if (existing) add(record.file, `code ${record.code} is already used by ${existing}`);
    else codes.set(record.code, record.file);
  }

  const checkComponent = (file: string, where: string, ref: string, unit: Unit) => {
    const target = lookupComponent(ds, ref);
    if (!target) {
      add(file, `${where}: unknown reference ${ref}`);
    } else if (isVolume(unit) && target.density_g_per_ml === undefined) {
      add(file, `${where}: ${ref} is measured in ${unit} but has no density_g_per_ml. Weigh it or add a density.`);
    }
  };

  const checkSteps = (file: string, where: string, steps: Step[]) => {
    for (let i = 1; i < steps.length; i++) {
      if (steps[i]!.op <= steps[i - 1]!.op) {
        add(file, `${where}: operation numbers must increase (op ${steps[i]!.op} follows op ${steps[i - 1]!.op})`);
      }
    }
  };

  const checkDerivedFrom = (file: string, derived: string | null | undefined) => {
    if (!derived) return;
    const [ref] = derived.split("@");
    const [kind, id] = ref!.split("/");
    const exists = kind === "prep" ? ds.prep[id!] : kind === "build" ? ds.build[id!] : undefined;
    if (!exists) add(file, `derived_from: unknown record ${ref}`);
  };

  for (const ing of Object.values(ds.ingredient)) {
    const f = ing.file;
    if (ing.basis === "per_100ml" && ing.density_g_per_ml === undefined) {
      add(f, "basis per_100ml requires density_g_per_ml");
    }
    if (!ing.sources[ing.default_source]) {
      add(f, `default_source '${ing.default_source}' is not defined under sources`);
    }
    for (const [key, entry] of Object.entries(ing.nutrition)) {
      if (!nutrientKeys.has(key)) add(f, `nutrition: unknown nutrient '${key}' (see reference/nutrients.yaml)`);
      if (entry !== null && typeof entry === "object" && !ing.sources[entry.source]) {
        add(f, `nutrition.${key}: source '${entry.source}' is not defined under sources`);
      }
    }
    if (ing.diet.plant_based && !ing.diet.vegetarian) {
      add(f, "diet: plant_based implies vegetarian");
    }
    const animal = ing.allergens.filter((a) => ANIMAL_ALLERGENS.has(a));
    if (ing.diet.plant_based && animal.length > 0) {
      add(f, `diet: marked plant_based but lists animal allergens (${animal.join(", ")})`);
    }
  }

  for (const prep of Object.values(ds.prep)) {
    const f = prep.file;
    checkDerivedFrom(f, prep.derived_from);
    prep.inputs.forEach((input, i) => checkComponent(f, `inputs[${i}]`, input.ref, input.unit));
    for (const key of Object.keys(prep.retention ?? {})) {
      if (!nutrientKeys.has(key)) add(f, `retention: unknown nutrient '${key}'`);
    }
    checkSteps(f, "steps", prep.steps);

    if (prep.yield.method !== "sum") {
      try {
        const inputMass = prep.inputs.reduce((sum, input) => {
          const target = lookupComponent(ds, input.ref);
          if (!target) throw new Error("unresolved");
          return sum + massInGrams(input.qty, input.unit, target.density_g_per_ml);
        }, 0);
        if (prep.yield.mass_g > inputMass + 1e-6) {
          add(f, `yield: ${prep.yield.mass_g} g exceeds total input mass of ${inputMass.toFixed(1)} g`);
        }
      } catch {
        // Unresolvable inputs are already reported above.
      }
    }
  }

  // Preps may use other preps; the graph must be acyclic.
  const state = new Map<string, "visiting" | "done">();
  const visit = (id: string, path: string[]) => {
    if (state.get(id) === "done") return;
    if (state.get(id) === "visiting") {
      const cycle = [...path.slice(path.indexOf(id)), id].map((p) => `prep/${p}`).join(" -> ");
      add(ds.prep[id]!.file, `circular prep reference: ${cycle}`);
      return;
    }
    state.set(id, "visiting");
    for (const input of ds.prep[id]!.inputs) {
      const [kind, childId] = input.ref.split("/");
      if (kind === "prep" && childId && ds.prep[childId]) visit(childId, [...path, id]);
    }
    state.set(id, "done");
  };
  for (const id of Object.keys(ds.prep)) visit(id, []);

  for (const build of Object.values(ds.build)) {
    const f = build.file;
    checkDerivedFrom(f, build.derived_from);
    const slots = build.slots ?? {};
    for (const [name, slot] of Object.entries(slots)) {
      if (!slot.options.includes(slot.default)) {
        add(f, `slots.${name}: default ${slot.default} is not one of its options`);
      }
      for (const option of slot.options) {
        if (!lookupComponent(ds, option)) add(f, `slots.${name}: unknown reference ${option}`);
      }
    }
    for (const [format, spec] of Object.entries(build.formats)) {
      spec.inputs.forEach((input, i) => {
        const where = `formats.${format}.inputs[${i}]`;
        if ("ref" in input) {
          checkComponent(f, where, input.ref, input.unit);
          return;
        }
        const slot = slots[input.slot];
        if (!slot) {
          add(f, `${where}: slot '${input.slot}' is not declared under slots`);
          return;
        }
        for (const option of slot.options) checkComponent(f, where, option, input.unit);
      });
      checkSteps(f, `formats.${format}.steps`, spec.steps);
    }
  }

  for (const item of Object.values(ds.menu)) {
    const f = item.file;
    const build = ds.build[item.build.split("/")[1]!];
    if (!build) {
      add(f, `build: unknown reference ${item.build}`);
      continue;
    }
    for (const format of item.formats) {
      if (!build.formats[format]) add(f, `formats: ${item.build} has no '${format}' format`);
    }
    for (const [name, options] of Object.entries(item.options ?? {})) {
      const slot = build.slots?.[name];
      if (!slot) {
        add(f, `options.${name}: ${item.build} has no slot '${name}'`);
        continue;
      }
      for (const option of options) {
        if (!slot.options.includes(option)) {
          add(f, `options.${name}: ${option} is not an option of ${item.build}`);
        }
      }
    }
  }

  return issues;
}
