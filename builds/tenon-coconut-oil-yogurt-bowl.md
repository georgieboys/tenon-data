---
id: tenon-coconut-oil-yogurt-bowl
code: BLD-537
name: Tenon Coconut Oil Yogurt Bowl
version: 0.1.0
description: Yogurt honey bowl remix with coconut oil. Derived from Tenon Yogurt Honey Bowl.
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
      - ref: ingredient/coconut-oil
        qty: 12
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, coconut oil and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with coconut oil.
