---
id: tenon-lemon-verbena-dried-powder-protein-sandwich
code: BLD-15351
name: Tenon Lemon Verbena Dried Powder Protein Sandwich
version: 0.1.0
description: Protein Sandwich remix with lemon verbena dried powder. Derived from parent chassis.
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
      - ref: ingredient/lemon-verbena-dried-powder
        qty: 35
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter and lemon-verbena-dried-powder across the slices.
        equipment: [knife, spoon]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix with lemon verbena dried powder.
