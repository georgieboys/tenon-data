---
id: tenon-chia-yogurt-bowl
code: BLD-324
name: Tenon Chia Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with chia. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 160
        unit: g
      - ref: ingredient/chia
        qty: 15
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in chia, honey and salt. Rest 10 min for light gel.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-025 with chia.
