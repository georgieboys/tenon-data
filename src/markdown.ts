import type {
  BuildVariant,
  CompiledBuild,
  CompiledDataset,
  CompiledIngredient,
  CompiledMenuProduct,
  CompiledPrep,
  ResolvedInput,
} from "./compile.ts";
import type { Composition, NutrientValue, NutrientVector, PercentOfReference } from "./nutrition.ts";
import type { NutrientDef, Step } from "./types.ts";

const DATA_LICENCE = "CC BY-SA 4.0";

const PLACEHOLDER_BANNER =
  "> **Placeholder data.** Some values in this record are illustrative and must not be used for nutrition labelling.";

const UNIT_LABEL: Record<NutrientDef["unit"], string> = { kcal: "kcal", g: "g", mg: "mg", ug: "µg" };

export function formatNumber(value: number): string {
  const abs = Math.abs(value);
  const dp = abs >= 100 || abs === 0 ? 0 : abs >= 1 ? 1 : 2;
  return String(Number(value.toFixed(dp)));
}

/** "unknown" when nothing is known; "≥ x" when some inputs lack data. */
export function formatNutrient(n: NutrientValue | undefined): string {
  if (!n || n.value === null || (!n.complete && n.value === 0)) return "unknown";
  return n.complete ? formatNumber(n.value) : `≥ ${formatNumber(n.value)}`;
}

const yesNo = (b: boolean) => (b ? "yes" : "no");
const cell = (s: string | undefined) => (s ?? "").replace(/\|/g, "\\|");

function table(header: string[], rows: string[][]): string {
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`),
  ].join("\n");
}

class Renderer {
  private readonly nutrients: NutrientDef[];
  private readonly labels = new Map<string, string>();

  constructor(data: CompiledDataset) {
    this.nutrients = data.nutrients.nutrients;
    for (const r of [...data.ingredients, ...data.preps, ...data.builds, ...data.menu]) {
      this.labels.set(r.ref, `${r.code} · ${r.name}`);
    }
  }

  label(ref: string): string {
    return this.labels.get(ref) ?? ref;
  }

  header(code: string, name: string, description: string | undefined, placeholder: boolean): string {
    return [`# ${code} · ${name}`, placeholder ? PLACEHOLDER_BANNER : "", description ?? ""]
      .filter(Boolean)
      .join("\n\n");
  }

  footer(sourceFile: string): string {
    return `---\n\nSource: \`${sourceFile}\` · Data licence: ${DATA_LICENCE}`;
  }

  dietRows(c: Composition): string[][] {
    return [
      ["Allergens", c.allergens.length ? c.allergens.join(", ") : "none declared"],
      ["Plant-based", yesNo(c.diet.plant_based)],
      ["Vegetarian", yesNo(c.diet.vegetarian)],
    ];
  }

  billOfMaterials(inputs: ResolvedInput[]): string {
    return table(
      ["#", "Component", "Quantity", "Mass (g)", "Temp (°C)", "Note"],
      inputs.map((i, n) => [
        String(n + 1),
        `${this.label(i.ref)}${i.slot ? ` (slot: ${i.slot})` : ""}`,
        `${formatNumber(i.qty)} ${i.unit}`,
        formatNumber(i.grams),
        i.temp_c !== undefined ? String(i.temp_c) : "",
        i.note ?? "",
      ]),
    );
  }

  procedure(steps: Step[]): string {
    return table(
      ["Op", "Action", "Equipment", "Time (s)", "Temp (°C)"],
      steps.map((s) => [
        String(s.op),
        s.action,
        (s.equipment ?? []).join(", "),
        s.duration_s !== undefined ? String(s.duration_s) : "",
        s.temp_c !== undefined ? String(s.temp_c) : "",
      ]),
    );
  }

  nutritionTable(columns: { label: string; vector: NutrientVector }[], percent?: PercentOfReference): string {
    const formatPercent = (pct: number | null | undefined, n: NutrientValue | undefined) => {
      if (pct === null || pct === undefined) return "—";
      if (formatNutrient(n) === "unknown") return "unknown";
      return `${n?.complete ? "" : "≥ "}${formatNumber(pct)}%`;
    };
    const header = ["Nutrient", ...columns.map((c) => c.label)];
    if (percent) header.push("% RI (US FDA)", "% RI (SG HPB)");
    const rows = this.nutrients.map((n) => {
      const row = [`${n.name} (${UNIT_LABEL[n.unit]})`, ...columns.map((c) => formatNutrient(c.vector[n.key]))];
      if (percent) {
        const total = columns[0]?.vector[n.key];
        row.push(formatPercent(percent.us_fda[n.key], total), formatPercent(percent.sg_hpb[n.key], total));
      }
      return row;
    });
    return table(header, rows);
  }

  usedBy(refs: string[]): string {
    return refs.length ? refs.map((r) => `- ${this.label(r)} (\`${r}\`)`).join("\n") : "Not used by any record yet.";
  }

  variantSummary(variants: BuildVariant[]): string {
    const value = (v: BuildVariant, key: string) => formatNutrient(v.composition.totals[key]);
    return table(
      ["Variant", "Serving (g)", "Energy (kcal)", "Protein (g)", "Fibre (g)", "Caffeine (mg)", "Allergens", "Plant-based"],
      variants.map((v) => [
        `\`${v.key}\`${v.is_default ? " (default)" : ""}`,
        formatNumber(v.composition.mass_g),
        value(v, "energy_kcal"),
        value(v, "protein_g"),
        value(v, "fibre_g"),
        value(v, "caffeine_mg"),
        v.composition.allergens.join(", ") || "none",
        yesNo(v.composition.diet.plant_based),
      ]),
    );
  }

  variantDetail(v: BuildVariant, heading: string): string {
    return [
      `## ${heading}`,
      `Variant \`${v.key}\`. Serving mass ${formatNumber(v.composition.mass_g)} g.`,
      "### Bill of materials",
      this.billOfMaterials(v.inputs),
      "### Procedure",
      this.procedure(v.steps),
      "### Nutrition",
      this.nutritionTable(
        [
          { label: "Per serving", vector: v.composition.totals },
          { label: "Per 100 g", vector: v.composition.per_100g },
        ],
        v.percent_ri,
      ),
    ].join("\n\n");
  }
}

export function renderIngredient(data: CompiledDataset, ing: CompiledIngredient): string {
  const r = new Renderer(data);
  const spec: string[][] = [
    ["Reference", `\`${ing.ref}\``],
    ["Version", ing.version],
    ["Category", ing.category],
    ["Supplier", [ing.supplier?.name, ing.supplier?.product].filter(Boolean).join(", ") || "not recorded"],
    ["Declared basis", ing.basis === "per_100ml" ? "per 100 ml" : "per 100 g"],
  ];
  if (ing.density_g_per_ml !== undefined) spec.push(["Density", `${ing.density_g_per_ml} g/ml`]);
  spec.push(...r.dietRows(ing.composition));

  const sources = Object.entries(ing.sources).map(
    ([key, s]) => `- \`${key}\` (${s.type.replace(/_/g, " ")}): ${s.ref}${s.captured ? `, captured ${s.captured}` : ""}${s.url ? ` <${s.url}>` : ""}`,
  );

  const nutrition = table(
    ["Nutrient", "Per 100 g", "Source"],
    data.nutrients.nutrients.map((n) => [
      `${n.name} (${UNIT_LABEL[n.unit]})`,
      formatNutrient(ing.composition.per_100g[n.key]),
      ing.declared_nutrition[n.key]?.source ?? "—",
    ]),
  );

  return [
    r.header(ing.code, ing.name, ing.description, ing.composition.placeholder),
    table(["Spec", ""], spec),
    "## Nutrition per 100 g",
    ing.basis === "per_100ml" ? "Declared per 100 ml and converted to per 100 g using the density above." : "",
    nutrition,
    "## Sources",
    sources.join("\n"),
    "## Used by",
    r.usedBy(ing.used_by),
    ing.notes ? `## Notes\n\n${ing.notes}` : "",
    r.footer(ing.source_file),
  ]
    .filter(Boolean)
    .join("\n\n") + "\n";
}

export function renderPrep(data: CompiledDataset, prep: CompiledPrep): string {
  const r = new Renderer(data);
  const spec: string[][] = [
    ["Reference", `\`${prep.ref}\``],
    ["Version", prep.version],
    ["Derived from", prep.derived_from ?? "original"],
    ["Yield", `${formatNumber(prep.yield.mass_g)} g (${prep.yield.method}) from ${formatNumber(prep.yield.input_mass_g)} g of inputs`],
  ];
  if (prep.density_g_per_ml !== undefined) spec.push(["Density", `${prep.density_g_per_ml} g/ml`]);
  if (prep.storage) {
    const s = prep.storage;
    spec.push([
      "Storage",
      [s.temp_c !== undefined ? `${s.temp_c} °C` : "", s.shelf_life_h !== undefined ? `${s.shelf_life_h} h` : "", s.notes ?? ""]
        .filter(Boolean)
        .join(", "),
    ]);
  }
  spec.push(...r.dietRows(prep.composition));

  return [
    r.header(prep.code, prep.name, prep.description, prep.composition.placeholder),
    table(["Spec", ""], spec),
    "## Bill of materials",
    r.billOfMaterials(prep.inputs),
    "## Procedure",
    r.procedure(prep.steps),
    "## Nutrition",
    r.nutritionTable([
      { label: `Per batch (${formatNumber(prep.composition.mass_g)} g)`, vector: prep.composition.totals },
      { label: "Per 100 g", vector: prep.composition.per_100g },
    ]),
    "## Used by",
    r.usedBy(prep.used_by),
    prep.notes ? `## Notes\n\n${prep.notes}` : "",
    r.footer(prep.source_file),
  ]
    .filter(Boolean)
    .join("\n\n") + "\n";
}

export function renderBuild(data: CompiledDataset, build: CompiledBuild): string {
  const r = new Renderer(data);
  const slotRows = Object.entries(build.slots).map(([name, slot]) => [
    `Slot: ${slot.label} (\`${name}\`)`,
    slot.options.map((o) => `${r.label(o)}${o === slot.default ? " (default)" : ""}`).join("; "),
  ]);
  const details = build.formats.map((format) => {
    const v = build.variants.find((x) => x.format === format && x.is_default);
    return v ? r.variantDetail(v, `Format: ${format}`) : "";
  });

  return [
    r.header(build.code, build.name, build.description, build.variants.some((v) => v.composition.placeholder)),
    table(
      ["Spec", ""],
      [
        ["Reference", `\`${build.ref}\``],
        ["Version", build.version],
        ["Vertical", build.vertical],
        ["Derived from", build.derived_from ?? "original"],
        ["Formats", build.formats.join(", ")],
        ...slotRows,
      ],
    ),
    "## Variants",
    "Nutrition per serving for every format and slot combination.",
    r.variantSummary(build.variants),
    ...details,
    "## Used by",
    r.usedBy(build.used_by),
    build.notes ? `## Notes\n\n${build.notes}` : "",
    r.footer(build.source_file),
  ]
    .filter(Boolean)
    .join("\n\n") + "\n";
}

export function renderMenuProduct(data: CompiledDataset, item: CompiledMenuProduct): string {
  const r = new Renderer(data);
  const defaultVariant = item.variants.find((v) => v.key === item.default_variant)!;
  return [
    r.header(item.code, item.name, item.description, item.variants.some((v) => v.composition.placeholder)),
    table(
      ["Spec", ""],
      [
        ["Reference", `\`${item.ref}\``],
        ["Version", item.version],
        ["Status", item.status],
        ["Build", `${r.label(item.build)} (\`${item.build}\`)`],
        ["Formats", item.formats.join(", ")],
        ...Object.entries(item.options).map(([name, options]) => [`Options: ${name}`, options.map((o) => r.label(o)).join("; ")]),
        ["Price", item.price_sgd === null ? "not set" : `S$${item.price_sgd.toFixed(2)}`],
      ],
    ),
    "## Variants",
    r.variantSummary(item.variants),
    r.variantDetail(defaultVariant, "Default"),
    item.notes ? `## Notes\n\n${item.notes}` : "",
    r.footer(item.source_file),
  ]
    .filter(Boolean)
    .join("\n\n") + "\n";
}
