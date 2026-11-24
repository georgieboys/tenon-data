import type { CompiledDataset } from "../compile.ts";

const GAPS = [
  {
    id: "GAP-001",
    title: "Visit pin, hours and transit",
    status: "open",
    href: "/visit",
    body: "Street address, postal code, phone and opening hours remain TBA on /visit until the alley lease is fixed.",
  },
  {
    id: "GAP-002",
    title: "Measured bake and Creami yields",
    status: "open",
    href: "/methodology",
    body: "Baked preps/builds and ice-cream formats still use yield.method: sum (input mass). Café scale-out mass is required for concentration after moisture loss or overrun.",
  },
  {
    id: "GAP-003",
    title: "Café certificates of analysis",
    status: "open",
    href: "/open",
    body: "Ingredient lots still cite USDA, manufacturer label or literature proxies. Supplier CoAs replace proxies when SKUs lock.",
  },
];

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export default function render(_data: CompiledDataset): string {
  const header = ["id", "title", "status", "href", "body"];
  const rows = GAPS.map((g) =>
    [g.id, csvEscape(g.title), g.status, g.href, csvEscape(g.body)].join(","),
  );
  return `${header.join(",")}\n${rows.join("\n")}\n`;
}
