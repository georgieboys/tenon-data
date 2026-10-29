# Contribution guide

Corrections, better data and remixes are welcome. Every change goes through a pull request and must pass `pnpm validate` and `pnpm test`, which CI runs automatically.

## Conventions

- **IDs** are kebab-case, match the file name, and are never renamed or reused once published. To retire a record, keep the file and mark it in the notes.
- **Codes** are sequential per type: `ING-###`, `PRP-###`, `BLD-###`, `MNU-###`. Take the next free number.
- **Versions** follow semantic versioning:
  - Patch (`0.1.1`): wording, notes or corrected source data with no recipe change.
  - Minor (`0.2.0`): quantity or method changes.
  - Major (`1.0.0`): a different product, e.g. a changed core ingredient.
- **Weigh everything.** Prefer grams. Use `ml` only for liquids with a known density.
- **Steps** are numbered 10, 20, 30 so steps can be inserted later. Keep quantities in the bill of materials, not in step text, so scaling stays correct.

## Adding or correcting an ingredient

1. Create or edit `ingredients/<id>.md`.
2. Add a source for every value. For a label, record the product and the capture date. For USDA data, put the FDC ID in `ref`.
3. Use `null` for anything you do not know. Never use `0` for unknown.
4. Declare allergens and diet flags. Validation rejects a plant-based ingredient that lists an animal allergen.

## Adding a nutrient

Add it to `reference/nutrients.yaml` with its unit, group and reference intakes, then add values to the ingredients that have data. Ingredients without a value report it as unknown.

## Remixing

A remix is a new prep or build that records where it came from:

```yaml
id: tenon-matcha-oat
code: BLD-007
version: 0.1.0
derived_from: build/tenon-matcha@0.1.0
```

Change what you need: a different slot option, a new ingredient, different quantities. Nutrition, allergens and diet flags are recalculated automatically. Explain what changed and why in the notes.

To offer a new option within an existing build, such as an oat-based milk, add a prep and list it under that build's slot `options` instead of creating a new build.

## Pull request checklist

- [ ] `pnpm validate` passes
- [ ] `pnpm test` passes
- [ ] New values have sources; unknowns are `null`
- [ ] Version bumped on changed records
- [ ] Notes explain any change in method or ingredients
