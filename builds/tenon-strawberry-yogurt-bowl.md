---
id: tenon-strawberry-yogurt-bowl
code: BLD-026
name: Tenon Strawberry Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with strawberries instead of blueberries. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 200
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/strawberry
        qty: 100
        unit: g
        note: Hulled, sliced
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with sliced strawberries. Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with strawberry. Milk-only allergens unchanged.
