import type { CompiledDataset } from "../compile.ts";

/** Public site facts used inside exported files (links, licences). */
export const site = {
  name: "Tenon Coffee",
  tagline: "Open-source functional food and beverage laboratory",
  url: "https://tenon.coffee",
  dataRepo: "https://github.com/georgieboys/tenon-data",
} as const;

export const licences = {
  code: { name: "MIT", url: "https://opensource.org/license/mit" },
  data: { name: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
} as const;

const roundNumbers = (_key: string, value: unknown) =>
  typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value;

export function json(body: unknown): string {
  return `${JSON.stringify(body, roundNumbers, 2)}\n`;
}

export function placeholderRecords(data: CompiledDataset) {
  return [...data.ingredients, ...data.preps].filter((r) => r.composition.placeholder);
}
