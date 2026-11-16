---
id: tenon-flaxseed-meal-golden-yogurt-bowl
code: BLD-9327
name: Tenon Flaxseed Meal Golden Yogurt Bowl
version: 0.1.0
description: Yogurt Bowl remix with flaxseed meal golden. Derived from parent chassis.
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
        qty: 12
        unit: g
      - ref: ingredient/flaxseed-meal-golden
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, flaxseed meal golden and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with flaxseed meal golden.
