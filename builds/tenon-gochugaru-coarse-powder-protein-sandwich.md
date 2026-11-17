---
id: tenon-gochugaru-coarse-powder-protein-sandwich
code: BLD-15775
name: Tenon Gochugaru Coarse Powder Protein Sandwich
version: 0.1.0
description: Protein Sandwich remix with gochugaru coarse powder. Derived from parent chassis.
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
        qty: 24
        unit: g
      - ref: ingredient/gochugaru-coarse-powder
        qty: 35
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter and gochugaru-coarse-powder across the slices.
        equipment: [knife, spoon]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix with gochugaru coarse powder.
