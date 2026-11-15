---
id: tenon-strawberry-protein-sandwich
code: BLD-100
name: Tenon Strawberry Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with strawberries and Greek yogurt instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
        qty: 50
        unit: g
      - ref: ingredient/strawberry
        qty: 40
        unit: g
        note: Hulled, sliced
      - ref: ingredient/honey
        qty: 8
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread Greek yogurt, drizzle honey, layer sliced strawberries, close the sandwich. Serve immediately.
        equipment: [spoon]
---

Remix of BLD-013 with yogurt, strawberry and honey. Milestone BLD-100.
