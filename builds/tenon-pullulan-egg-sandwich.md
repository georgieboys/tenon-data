---
id: tenon-pullulan-egg-sandwich
code: BLD-12038
name: Tenon Pullulan Egg Sandwich
version: 0.1.0
description: Egg Sandwich remix with pullulan. Derived from parent chassis.
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
      - ref: ingredient/pullulan
        qty: 40
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Fry the egg in butter until the white is set. Finish with pullulan.
        equipment: [pan, spatula]
        temp_c: 160
      - op: 30
        action: Add the egg between the slices. Serve immediately.
---

Remix with pullulan.
