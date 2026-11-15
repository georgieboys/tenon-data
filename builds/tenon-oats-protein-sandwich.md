---
id: tenon-oats-protein-sandwich
code: BLD-329
name: Tenon Oats Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with oats honey butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
        qty: 12
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/oats
        qty: 20
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Mash butter with honey and oats. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [fork, spatula]
---

Remix of BLD-013 with oats honey butter.
