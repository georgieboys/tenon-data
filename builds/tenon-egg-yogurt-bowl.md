---
id: tenon-egg-yogurt-bowl
code: BLD-397
name: Tenon Egg Yogurt Bowl
version: 0.1.0
description: Yogurt honey bowl remix with soft-boiled egg. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 160
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: Soft-boiled, peeled
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Soft-boil the egg, peel, and chop. Spoon Greek yogurt into a bowl. Fold in honey, egg and salt.
        equipment: [scale, bowl, spoon, pot]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with egg.
