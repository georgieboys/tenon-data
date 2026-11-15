---
id: tenon-blueberry-protein-sandwich
code: BLD-084
name: Tenon Blueberry Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with blueberries and cottage cheese instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/cottage-cheese
        qty: 50
        unit: g
      - ref: ingredient/blueberry
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 8
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spoon cottage cheese onto one slice, drizzle honey, top with blueberries, close the sandwich. Serve immediately.
        equipment: [spoon]
---

Remix of BLD-013 with cottage cheese, blueberry and honey.
