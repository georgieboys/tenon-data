---
id: tenon-cream-cheese-yogurt-bowl
code: BLD-234
name: Tenon Cream Cheese Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with cream cheese. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 150
        unit: g
      - ref: ingredient/cream-cheese
        qty: 50
        unit: g
      - ref: ingredient/honey
        qty: 18
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Soften cream cheese. Fold into yogurt with honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-025 with cream cheese.
