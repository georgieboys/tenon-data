---
id: tenon-spinach-egg-sandwich-elevated
code: BLD-700
name: Tenon Spinach Egg Sandwich Elevated
version: 0.1.0
description: Egg protein sandwich remix with elevated spinach. Derived from Tenon Egg Protein Sandwich.
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
      - ref: ingredient/spinach
        qty: 45
        unit: g
        note: Elevated spinach cell
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set. Wilt spinach in the pan briefly.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Add the egg and spinach between the slices. Serve immediately.
---

Remix of BLD-014 with elevated spinach. Seven hundred builds.
