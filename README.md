# Tenon Data

The open ingredient, prep and build database behind [Tenon Coffee](https://tenon.coffee), an open-source functional food and beverage lab.

> We don't just serve the product. We publish the blueprint.

Every drink and food item served at Tenon is documented here as structured data: the raw ingredients and their nutrition, the reusable components prepared from them, and the final assembly. Nutrition is calculated automatically from the ingredients up, so a published number can never disagree with its recipe.

> **Status: v0.1, placeholder data.** The structure is real; the nutrition values are illustrative and are flagged as placeholders in every output until they are replaced with label or reference data.

## How it fits together

```
INGREDIENTS        raw materials and nutrition per 100 g      ingredients/
     │
PREPS              reusable prepared components               preps/
     │
BUILDS             final assembly for one serving             builds/
     │
MENU PRODUCTS      what the customer orders                   menu/
```

- **Ingredients** declare nutrition once, with a source for every value.
- **Preps** combine ingredients (or other preps) and state their yield, storage and procedure.
- **Builds** assemble a serving. A build can declare **slots**, such as the milk base, so one build covers every interchangeable option. Every format and slot combination is calculated.
- **Menu products** point at a build and choose which formats and options are offered.

Nutrition flows down the chain: ingredient → prep → build → menu product. See [docs/nutrition-methodology.md](docs/nutrition-methodology.md).

## Records

Each record is a Markdown file. Structured fields live in YAML frontmatter, checked against the JSON Schemas in [`schema/`](schema/); free-form notes go below.

```yaml
# preps/soy-whey-milk.md
---
id: soy-whey-milk
code: PRP-002
name: High-protein soy and whey milk
version: 0.1.0
inputs:
  - { ref: ingredient/unisoy, qty: 1000, unit: ml }
  - { ref: ingredient/whey-concentrate, qty: 40, unit: g }
yield: { method: sum }
steps:
  - { op: 10, action: Weigh the whey concentrate into a jug. }
---
Notes in Markdown.
```

| Folder | Code | Contents |
| --- | --- | --- |
| `ingredients/` | `ING-###` | Raw materials, nutrition, sources, allergens |
| `preps/` | `PRP-###` | Reusable prepared components |
| `builds/` | `BLD-###` | Final assembly recipes |
| `menu/` | `MNU-###` | Menu products |
| `reference/nutrients.yaml` | | Tracked nutrients, units and reference intakes (US FDA, Singapore HPB) |
| `schema/` | | JSON Schemas for every record type |

## Using the data

Requires Node.js 22.18 or later and pnpm.

```sh
pnpm install
pnpm validate   # schema and cross-record checks
pnpm test       # calculation tests
pnpm build      # writes dist/
```

`pnpm build` produces:

- `dist/api/v1/` — a static JSON API: `index.json`, `all.json`, `nutrients.json` and one file per record, e.g. `builds/tenon-matcha.json`. Each build contains every variant with its resolved bill of materials, per-serving and per-100 g nutrition, allergens, diet flags and % of reference intake.
- `dist/markdown/` — a human-readable spec sheet for every record.

The calculation code in `src/` can also be imported directly, including `scaleRecipe` and `factorForMass` for batch scaling.

## Contributing and remixing

Recipes are meant to be adapted. A remix is a new prep or build with `derived_from` pointing at the original version. See [docs/contribution-guide.md](docs/contribution-guide.md).

## Licence

- Code (`src/`, `test/`, `schema/`): [MIT](LICENSE)
- Recipes, data and documentation: [CC BY-SA 4.0](LICENSE-DATA)
