---
id: tenon-maple-protein-sandwich
code: BLD-476
name: Tenon Maple Protein Sandwich
version: 0.1.0
description: PB protein sandwich remix with maple syrup. Derived from Tenon PB Protein Sandwich.
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
        qty: 28
        unit: g
      - ref: ingredient/maple-syrup
        qty: 15
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter on both slices. Drizzle maple syrup over the peanut butter.
        equipment: [knife, spoon]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix of BLD-013 with maple syrup.
