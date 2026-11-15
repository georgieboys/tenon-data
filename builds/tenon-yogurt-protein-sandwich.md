---
id: tenon-yogurt-protein-sandwich
code: BLD-068
name: Tenon Yogurt Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with Greek yogurt and honey instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/greek-yogurt
        qty: 60
        unit: g
      - ref: ingredient/honey
        qty: 10
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Stir Greek yogurt with honey and salt. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [spoon]
---

Remix of BLD-013 with Greek yogurt and honey.
