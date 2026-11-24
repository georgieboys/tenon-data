import { renderIngredient, renderPrep } from "../markdown.ts";
import type { CompiledDataset } from "../compile.ts";
import { licences, site } from "./util.ts";

/** Keep under Vercel's 20 MB ISR body limit: full sheets for ingredients/preps; one line per build and menu item. */

function macro(build: CompiledDataset["builds"][number], key: "energy_kcal" | "protein_g"): string {
  const variant = build.variants.find((v) => v.is_default) ?? build.variants[0];
  const value = variant?.composition.totals[key]?.value;
  return value == null ? "—" : String(Math.round(value * 10) / 10);
}

function buildLine(build: CompiledDataset["builds"][number]): string {
  return `- ${build.code} ${build.name} · ${macro(build, "energy_kcal")} kcal · ${macro(build, "protein_g")} g protein · ${site.url}/api/v1/builds/${build.id}.md`;
}

function menuLine(item: CompiledDataset["menu"][number]): string {
  return `- ${item.code} ${item.name} · ${site.url}/api/v1/menu/${item.id}.md`;
}

export default function render(data: CompiledDataset): string {
  const sections: string[] = [
    `# ${site.name} — full corpus`,
    "",
    `> ${site.tagline}. Ingredients and preps are inlined. Each build and menu product is one line with a deep link so this file stays under the 20 MB edge limit.`,
    "",
    `Data version: ${data.data_version}`,
    `Licence: data ${licences.data.name}, code ${licences.code.name}`,
    `Source: ${site.dataRepo}`,
    `Index map: ${site.url}/llms.txt`,
    `API: ${site.url}/api/v1/index.json`,
    `Per-build Markdown: ${site.url}/api/v1/builds/{id}.md`,
    "",
  ];

  const push = (body: string) => {
    sections.push(body.trimEnd(), "", "---", "");
  };

  for (const ing of data.ingredients) {
    push(`# Ingredient · ${ing.code} ${ing.name}\n\n${renderIngredient(data, ing)}`);
  }
  for (const prep of data.preps) {
    push(`# Prep · ${prep.code} ${prep.name}\n\n${renderPrep(data, prep)}`);
  }
  sections.push("# Builds", "", ...data.builds.map(buildLine), "", "---", "");
  sections.push("# Menu", "", ...data.menu.map(menuLine), "", "---", "");

  return sections.join("\n");
}
