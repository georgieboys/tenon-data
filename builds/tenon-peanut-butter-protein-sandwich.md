---
id: tenon-peanut-butter-protein-sandwich
code: BLD-457
name: Tenon Peanut Butter Protein Sandwich
version: 0.1.0
description: PB protein sandwich remix with elevated peanut butter. Derived from Tenon PB Protein Sandwich.
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
        qty: 50
        unit: g
        note: Elevated peanut butter cell
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter thickly on both slices.
        equipment: [knife]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix of BLD-013 with elevated peanut butter.
