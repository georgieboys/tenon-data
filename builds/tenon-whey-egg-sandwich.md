---
id: tenon-whey-egg-sandwich
code: BLD-263
name: Tenon Whey Egg Sandwich
version: 0.1.0
description: Egg protein sandwich remix with whey dust. Derived from Tenon Egg Protein Sandwich.
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
        qty: 8
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 10
        unit: g
        note: Dusted on egg
      - ref: ingredient/honey
        qty: 8
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set. Dust with whey.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Drizzle honey on one slice, add the whey egg, close the sandwich. Serve immediately.
---

Remix of BLD-014 with whey dust.
