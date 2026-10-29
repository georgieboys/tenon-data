import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadDataset } from "../src/load.ts";
import { DataError } from "../src/types.ts";
import { validateDataset } from "../src/validate.ts";
import { ROOT, repoDataset } from "./helpers.ts";

const messages = (issues: { message: string }[]) => issues.map((i) => i.message).join("\n");

describe("repository data", () => {
  it("passes all checks", async () => {
    expect(validateDataset(await repoDataset())).toEqual([]);
  });
});

describe("cross-record checks", () => {
  it("rejects unknown references", async () => {
    const ds = await repoDataset();
    ds.prep["soy-whey-milk"]!.inputs[1]!.ref = "ingredient/pea-protein";
    expect(messages(validateDataset(ds))).toContain("unknown reference ingredient/pea-protein");
  });

  it("rejects volumes for components without a density", async () => {
    const ds = await repoDataset();
    const iced = ds.build["tenon-matcha"]!.formats.iced!;
    const ice = iced.inputs.find((i) => "ref" in i && i.ref === "ingredient/ice")!;
    ice.unit = "ml";
    expect(messages(validateDataset(ds))).toContain("ingredient/ice is measured in ml but has no density_g_per_ml");
  });

  it("rejects a measured yield above the input mass", async () => {
    const ds = await repoDataset();
    ds.prep["soy-protein-milk"]!.yield = { method: "measured", mass_g: 2000 };
    expect(messages(validateDataset(ds))).toContain("exceeds total input mass");
  });

  it("rejects circular prep references", async () => {
    const ds = await repoDataset();
    ds.prep["soy-whey-milk"]!.inputs.push({ ref: "prep/dairy-whey-milk", qty: 10, unit: "g" });
    ds.prep["dairy-whey-milk"]!.inputs.push({ ref: "prep/soy-whey-milk", qty: 10, unit: "g" });
    expect(messages(validateDataset(ds))).toContain("circular prep reference");
  });

  it("rejects nutrients missing from the catalogue", async () => {
    const ds = await repoDataset();
    ds.ingredient.matcha!.nutrition.theanine_mg = 1500;
    expect(messages(validateDataset(ds))).toContain("unknown nutrient 'theanine_mg'");
  });

  it("rejects plant-based ingredients with animal allergens", async () => {
    const ds = await repoDataset();
    ds.ingredient["whey-concentrate"]!.diet.plant_based = true;
    expect(messages(validateDataset(ds))).toContain("marked plant_based but lists animal allergens (milk)");
  });

  it("rejects duplicate codes", async () => {
    const ds = await repoDataset();
    ds.ingredient.ice!.code = "ING-001";
    expect(messages(validateDataset(ds))).toContain("code ING-001 is already used");
  });

  it("rejects slot defaults that are not options and menu formats the build lacks", async () => {
    const ds = await repoDataset();
    ds.build["tenon-matcha"]!.slots!.base!.default = "prep/missing-milk";
    ds.menu["tenon-matcha"]!.formats.push("ice_cream");
    const text = messages(validateDataset(ds));
    expect(text).toContain("is not one of its options");
    expect(text).toContain("has no 'ice_cream' format");
  });
});

describe("schema checks on files", () => {
  let dir: string | undefined;
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  async function copyRepo() {
    dir = await mkdtemp(join(tmpdir(), "tenon-data-"));
    for (const sub of ["schema", "reference", "ingredients", "preps", "builds", "menu"]) {
      await cp(join(ROOT, sub), join(dir, sub), { recursive: true });
    }
    return dir;
  }

  it("rejects unknown fields", async () => {
    const root = await copyRepo();
    const matcha = join(root, "ingredients", "matcha.md");
    const source = await readFile(matcha, "utf8");
    await writeFile(matcha, source.replace("id: matcha\n", "id: matcha\ncolour: green\n"));

    const error = await loadDataset(root).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DataError);
    expect(messages((error as DataError).issues)).toContain("must NOT have additional properties 'colour'");
  });

  it("rejects ids that do not match the file name", async () => {
    const root = await copyRepo();
    const matcha = join(root, "ingredients", "matcha.md");
    await writeFile(matcha, (await readFile(matcha, "utf8")).replace("id: matcha", "id: matcha-powder"));

    const error = (await loadDataset(root).catch((e: unknown) => e)) as DataError;
    expect(messages(error.issues)).toContain("id 'matcha-powder' must match the file name 'matcha'");
  });
});
