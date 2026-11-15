---
id: tenon-sesame-yogurt-bowl
code: BLD-513
name: Tenon Sesame Yogurt Bowl
version: 0.1.0
description: Yogurt honey bowl remix with sesame. Derived from Tenon Yogurt Honey Bowl.
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
        qty: 15
        unit: g
      - ref: ingredient/sesame
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, sesame and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with sesame.
