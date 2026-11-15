---
id: tenon-cinnamon-egg-sandwich
code: BLD-126
name: Tenon Cinnamon Egg Sandwich
version: 0.1.0
description: Egg protein sandwich remix with cinnamon honey on the fried egg. Derived from Tenon Egg Protein Sandwich.
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
      - ref: ingredient/cinnamon
        qty: 1
        unit: g
      - ref: ingredient/honey
        qty: 10
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Stir honey with cinnamon, drizzle on one slice, add the egg, close the sandwich. Serve immediately.
---

Remix of BLD-014 with cinnamon honey.
