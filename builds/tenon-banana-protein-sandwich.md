---
id: tenon-banana-protein-sandwich
code: BLD-193
name: Tenon Banana Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with banana. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/banana
        qty: 80
        unit: g
        note: Peeled, sliced
      - ref: ingredient/honey
        qty: 10
        unit: g
      - ref: ingredient/butter
        qty: 8
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread butter and honey on one slice, layer banana, close the sandwich. Serve immediately.
        equipment: [spatula]
---

Remix of BLD-013 with banana.
