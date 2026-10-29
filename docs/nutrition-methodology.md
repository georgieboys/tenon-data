# Nutrition methodology

A nutritional value is only as reliable as its underlying ingredient data. This document explains how Tenon's numbers are calculated and where they can be wrong.

## Source of truth

Ingredient records are the only place nutrient values are entered. Every value is tied to a named source in the ingredient's `sources` block:

| Source type | Meaning |
| --- | --- |
| `manufacturer_label` | Read from the product label or supplier specification. Record the capture date. |
| `usda_fdc` | USDA FoodData Central. Put the FDC ID in `ref`. |
| `lab_analysis` | Tenon's own or a third-party laboratory test. |
| `literature` | A published study or reference table. |
| `definition` | True by definition, e.g. water contains no protein. |
| `placeholder` | Illustrative only. Flagged in every output that depends on it. |

## Units and basis

- All calculation is done in grams.
- Ingredients may declare nutrition `per_100g` or `per_100ml`. Per-100 ml values (common on milk labels) are converted using `density_g_per_ml`.
- Recipes may specify inputs in `g`, `kg`, `ml` or `l`. Volumes are converted to mass using the density of the referenced ingredient or prep. Anything without a density, such as ice, must be weighed.
- `carbohydrate_g` is **total carbohydrate**, including sugars and fibre (the US label convention). Labels that declare *available* carbohydrate (as in the EU and Australia) must have fibre added back before entry. Check how each label defines carbohydrate before entering it.

## Unknown is not zero

- A nutrient listed as `null`, or not listed at all, is **unknown**.
- Only use `unlisted_nutrients: zero` when zero is true by definition (water, ice).
- When some inputs to a prep or build lack a value, the total is the sum of the known contributions and is marked incomplete. It is published as a lower bound, e.g. `≥ 116 µg`.
- When nothing is known, the value is published as `unknown`.

## Calculation

**Ingredient.** Values are normalised to per 100 g.

**Prep.**

1. Each input's contribution = its per-100 g value × input grams ÷ 100.
2. Contributions are summed into batch totals.
3. Optional `retention` factors (0–1) reduce specific nutrients lost in processing, e.g. heat-sensitive vitamins.
4. Per-100 g values = totals ÷ yield × 100.

Yield is either the sum of the inputs (`method: sum`) or a stated output mass (`measured` or `estimated`). A measured yield below the input mass, from evaporation, baking or material left in equipment, concentrates the per-100 g values. A yield above the input mass is rejected, because mass cannot appear from nowhere.

**Build.** Every combination of format and slot option is calculated as one serving. Serving mass is the sum of all inputs, including ice and water, so per-100 g values for iced drinks are lower than for hot drinks even when per-serving nutrition is similar.

**Menu product.** Uses the build's numbers for the formats and options it offers. No values are re-entered.

## Extracted ingredients

Matcha and cocoa powder are consumed whole, so the powder's composition ends up in the cup. Espresso and brewed tea are **extractions**: most of the coffee or leaf is discarded. Their nutrition must not be inherited from the dry grounds or leaves. Model the brewed liquid (e.g. "Espresso, brewed") as its own ingredient, sourced from reference data or analysis, and document the brewing method in a prep or its notes.

## Allergens and diet

- Allergens are the union of all inputs' allergens.
- A prep or build is `plant_based` or `vegetarian` only if every input is.

## Reference intakes

Percentages of reference intake are calculated per serving against two standards, defined in `reference/nutrients.yaml`:

- **US FDA Daily Values** (21 CFR 101.9) — entered.
- **Singapore HPB Recommended Dietary Allowances** — to be entered. Shown as `—` until then.

## Scaling

Batch scaling is linear: quantities, yield and totals multiply by the scale factor; per-100 g values do not change. Some things do not scale linearly, such as leavening, spice intensity, and evaporation in a wider pan. Note these in the record when they matter.

## Rounding

Calculations run at full precision. The JSON API rounds to six decimal places. Markdown exports round for display: no decimals at 100 and above, one decimal from 1 to 100, two decimals below 1.

## Claims

Tenon publishes nutrient amounts, not health claims. Copy derived from this data should state quantities ("14 g protein per serving") rather than effects.
