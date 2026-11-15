---
id: tenon-peanut-butter-egg-sandwich
code: BLD-450
name: Tenon Peanut Butter Egg Sandwich
version: 0.1.0
description: Egg protein sandwich remix with peanut butter. Derived from Tenon Egg Protein Sandwich.
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
      - ref: ingredient/peanut-butter
        qty: 20
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set. Spread peanut butter on one slice.
        equipment: [pan, spatula, knife]
        temp_c: 160
      - op: 30
        action: Add the egg and close the sandwich. Serve immediately.
---

Remix of BLD-014 with peanut butter. Four hundred fifty builds.
