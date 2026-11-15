---
id: tenon-cottage-yogurt-bowl
code: BLD-322
name: Tenon Cottage Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with cottage cheese. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 120
        unit: g
      - ref: ingredient/cottage-cheese
        qty: 80
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Fold Greek yogurt with cottage cheese, honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-025 with cottage cheese.
