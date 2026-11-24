import type { CompiledDataset } from "../compile.ts";
import { json } from "./util.ts";

export default function render(data: CompiledDataset): string {
  return json(data.nutrients);
}
