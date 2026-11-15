---
id: tenon-honey-yogurt-bowl
code: BLD-143
name: Tenon Honey Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with a heavier honey fold and no fruit. Derived from Tenon Yogurt Honey Bowl.
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
        qty: 30
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold with no fruit topping. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with honey only.
