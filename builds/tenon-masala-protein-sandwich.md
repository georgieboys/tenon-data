---
id: tenon-masala-protein-sandwich
code: BLD-117
name: Tenon Masala Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with masala honey yogurt instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
        qty: 55
        unit: g
      - ref: prep/masala-spice
        qty: 2
        unit: g
      - ref: ingredient/honey
        qty: 10
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Whisk Greek yogurt with masala spice and honey. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [spoon]
---

Remix of BLD-013 with masala yogurt.
