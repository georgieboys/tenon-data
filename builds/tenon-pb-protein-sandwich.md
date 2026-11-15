---
id: tenon-pb-protein-sandwich
code: BLD-013
name: Tenon Peanut Butter Protein Sandwich
version: 0.1.0
description: Two slices of high-protein sandwich bread with smooth peanut butter. Assembled format — bread is a published prep, filling is weighed.
derived_from: null
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: prep/protein-bread
        qty: 80
        unit: g
        note: About two slices
      - ref: ingredient/peanut-butter
        qty: 30
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter evenly. Serve immediately or wrap.
        equipment: [spatula]
---

Demonstrates bread-as-prep → sandwich-as-build. Peanut, tree-nut, milk and egg allergens are inherited from the chain.
