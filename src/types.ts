export const KINDS = ["ingredient", "prep", "build", "menu"] as const;
export type Kind = (typeof KINDS)[number];

export const FORMATS = ["hot", "iced", "ice_blended", "ice_cream"] as const;
export type Format = (typeof FORMATS)[number];

export type Unit = "g" | "kg" | "ml" | "l";
export type ReferenceStandard = "us_fda" | "sg_hpb";
export const REFERENCE_STANDARDS: ReferenceStandard[] = ["us_fda", "sg_hpb"];

export interface NutrientDef {
  key: string;
  name: string;
  unit: "kcal" | "g" | "mg" | "ug";
  group: "energy" | "macro" | "micro" | "other";
  lever?: "protein" | "fibre" | "micronutrient";
  reference_intakes: Record<ReferenceStandard, number | null>;
}

export interface NutrientCatalog {
  reference_sources: Record<ReferenceStandard, string>;
  nutrients: NutrientDef[];
}

export type SourceType =
  | "manufacturer_label"
  | "usda_fdc"
  | "lab_analysis"
  | "literature"
  | "definition"
  | "placeholder";

export interface Source {
  type: SourceType;
  ref: string;
  captured?: string;
  url?: string;
}

export type NutrientEntry = number | { value: number; source: string } | null;

export interface Diet {
  plant_based: boolean;
  vegetarian: boolean;
}

export interface Step {
  op: number;
  action: string;
  equipment?: string[];
  duration_s?: number;
  temp_c?: number;
}

export interface ComponentInput {
  ref: string;
  qty: number;
  unit: Unit;
  temp_c?: number;
  note?: string;
}

export interface SlotInput {
  slot: string;
  qty: number;
  unit: Unit;
  temp_c?: number;
  note?: string;
}

export type BuildInput = ComponentInput | SlotInput;

export type Yield =
  | { method: "sum" }
  | { method: "measured" | "estimated"; mass_g: number };

interface RecordBase {
  id: string;
  code: string;
  name: string;
  version: string;
  description?: string;
  /** Path relative to the repository root. */
  file: string;
  /** Markdown body below the frontmatter. */
  body: string;
}

export interface Ingredient extends RecordBase {
  kind: "ingredient";
  category: string;
  supplier?: { name: string; product?: string; notes?: string };
  basis: "per_100g" | "per_100ml";
  density_g_per_ml?: number;
  unlisted_nutrients?: "unknown" | "zero";
  default_source: string;
  sources: Record<string, Source>;
  nutrition: Record<string, NutrientEntry>;
  allergens: string[];
  diet: Diet;
}

export interface Prep extends RecordBase {
  kind: "prep";
  derived_from?: string | null;
  inputs: ComponentInput[];
  yield: Yield;
  density_g_per_ml?: number;
  retention?: Record<string, number>;
  storage?: { temp_c?: number; shelf_life_h?: number; notes?: string };
  steps: Step[];
}

export interface Slot {
  label: string;
  options: string[];
  default: string;
}

export interface FormatSpec {
  inputs: BuildInput[];
  steps: Step[];
}

export interface Build extends RecordBase {
  kind: "build";
  derived_from?: string | null;
  vertical: "coffee" | "matcha" | "cocoa" | "tea";
  slots?: Record<string, Slot>;
  formats: Partial<Record<Format, FormatSpec>>;
}

export interface MenuProduct extends RecordBase {
  kind: "menu";
  build: string;
  status: "planned" | "available" | "retired";
  formats: Format[];
  options?: Record<string, string[]>;
  price_sgd?: number | null;
}

export interface Dataset {
  nutrients: NutrientCatalog;
  ingredient: Record<string, Ingredient>;
  prep: Record<string, Prep>;
  build: Record<string, Build>;
  menu: Record<string, MenuProduct>;
}

export interface Issue {
  file: string;
  message: string;
}

export class DataError extends Error {
  readonly issues: Issue[];

  constructor(issues: Issue[]) {
    super(issues.map((i) => `${i.file}: ${i.message}`).join("\n"));
    this.name = "DataError";
    this.issues = issues;
  }
}
