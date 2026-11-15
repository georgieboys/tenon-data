---
id: tenon-baking-powder-egg-sandwich
code: BLD-373
name: Tenon Baking Powder Egg Sandwich
version: 0.1.0
description: Egg protein sandwich remix with baking powder. Derived from Tenon Egg Protein Sandwich.
derived_from: build/tenon-egg-protein-sandwich@0.1.0
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
      - ref: ingredient/baking-powder
        qty: 1.5
        unit: g
        note: Dusted on the fried egg
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set. Dust with baking powder while still hot.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Add the egg between the slices. Serve immediately.
---

Remix of BLD-014 with baking powder.
