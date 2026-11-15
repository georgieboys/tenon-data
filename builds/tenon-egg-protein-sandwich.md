---
id: tenon-egg-protein-sandwich
code: BLD-014
name: Tenon Egg Protein Sandwich
version: 0.1.0
description: High-protein sandwich bread with fried egg and butter. Assembled from the published protein-bread prep.
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
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: One large egg, fried
      - ref: ingredient/butter
        qty: 10
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set and the yolk is as preferred.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Assemble egg between the slices. Serve immediately.
---

Second assembled food blueprint. Egg, milk and tree-nut allergens are inherited from the bread and filling.
