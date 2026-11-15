---
id: tenon-unisoy-protein-sandwich
code: BLD-283
name: Tenon Unisoy Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with UniSoy honey butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/butter
        qty: 10
        unit: g
      - ref: ingredient/unisoy
        qty: 25
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Mash butter with UniSoy and honey. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [fork, spatula]
---

Remix of BLD-013 with UniSoy honey butter.
