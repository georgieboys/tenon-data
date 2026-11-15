---
id: tenon-water-protein-sandwich
code: BLD-365
name: Tenon Water Protein Sandwich
version: 0.1.0
description: PB protein sandwich remix with water-thinned peanut butter. Derived from Tenon PB Protein Sandwich.
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
        qty: 32
        unit: g
      - ref: ingredient/water
        qty: 15
        unit: g
        note: Thins the peanut butter spread
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Stir peanut butter with water until spreadable. Spread on both slices.
        equipment: [knife, spoon]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix of BLD-013 with water-thinned PB.
