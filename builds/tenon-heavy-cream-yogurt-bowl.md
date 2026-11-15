---
id: tenon-heavy-cream-yogurt-bowl
code: BLD-239
name: Tenon Heavy Cream Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with heavy cream. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 160
        unit: g
      - ref: ingredient/heavy-cream
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in heavy cream, honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-025 with heavy cream.
