---
id: tenon-sichuan-peppercorn-powder-protein-sandwich
code: BLD-15763
name: Tenon Sichuan Peppercorn Powder Protein Sandwich
version: 0.1.0
description: Protein Sandwich remix with sichuan peppercorn powder. Derived from parent chassis.
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
      - ref: ingredient/sichuan-peppercorn-powder
        qty: 35
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter and sichuan-peppercorn-powder across the slices.
        equipment: [knife, spoon]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix with sichuan peppercorn powder.
