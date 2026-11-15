---
id: tenon-ice-yogurt-bowl
code: BLD-304
name: Tenon Ice Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix topped with ice. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 180
        unit: g
      - ref: ingredient/ice
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
        action: Spoon yogurt into a bowl. Fold in honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with ice. Serve immediately. Nutrition includes ice mass.
---

Remix of BLD-025 with ice.
