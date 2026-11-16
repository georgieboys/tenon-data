---
id: tenon-eye-of-goat-egg-sandwich
code: BLD-5548
name: Tenon Eye Of Goat Egg Sandwich
version: 0.1.0
description: Egg Sandwich remix with eye of goat. Derived from parent chassis.
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
      - ref: ingredient/eye-of-goat
        qty: 40
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set. Finish with eye of goat.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Add the egg between the slices. Serve immediately.
---

Remix with eye of goat.
