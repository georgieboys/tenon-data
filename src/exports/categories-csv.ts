import type { CompiledDataset } from "../compile.ts";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(data: CompiledDataset): string {
  const header = ["category", "ingredient_count", "ingredient_ids"];

  const byCat = new Map<string, string[]>();
  for (const ing of data.ingredients) {
    const cat = ing.category ?? "uncategorised";
    const list = byCat.get(cat) ?? [];
    list.push(ing.id);
    byCat.set(cat, list);
  }

  const rows = [...byCat.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, ids]) => {
      const sorted = [...ids].sort();
      return [category, String(sorted.length), csvEscape(sorted.join("|"))].join(",");
    });

  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
