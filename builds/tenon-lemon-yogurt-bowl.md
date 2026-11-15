---
id: tenon-lemon-yogurt-bowl
code: BLD-485
name: Tenon Lemon Yogurt Bowl
version: 0.1.0
description: Yogurt honey bowl remix with lemon juice. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 190
        unit: g
      - ref: ingredient/honey
        qty: 18
        unit: g
      - ref: ingredient/lemon-juice
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, lemon juice and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with lemon juice.
