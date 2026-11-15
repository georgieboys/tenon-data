---
id: tenon-water-yogurt-bowl
code: BLD-358
name: Tenon Water Yogurt Bowl
version: 0.1.0
description: Yogurt honey bowl remix with water. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 180
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/water
        qty: 40
        unit: g
        note: Thins the bowl
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, water and salt until pourable.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with water.
