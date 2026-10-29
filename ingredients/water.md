---
id: water
code: ING-001
name: Water
version: 0.1.0
description: Filtered water used for brewing, whisking and dilution.
category: water
basis: per_100g
density_g_per_ml: 1.0
unlisted_nutrients: zero
default_source: definition
sources:
  definition:
    type: definition
    ref: "Treated as nutritionally zero. Trace minerals in filtered water are ignored."
nutrition: {}
allergens: []
diet:
  plant_based: true
  vegetarian: true
---

Filtered water. Mineral content of the café water supply is not tracked yet; if a remineralisation recipe is adopted for brewing, it will become its own ingredient with measured values.
