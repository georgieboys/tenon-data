---
id: tenon-butter-protein-sandwich
code: BLD-396
name: Tenon Butter Protein Sandwich
version: 0.1.0
description: PB protein sandwich remix with butter. Derived from Tenon PB Protein Sandwich.
derived_from: build/tenon-pb-protein-sandwich@0.1.0
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
        qty: 24
        unit: g
      - ref: ingredient/butter
        qty: 16
        unit: g
        note: Softened
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Soften the butter. Spread peanut butter on one slice and butter on the other.
        equipment: [knife]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix of BLD-013 with butter.
