---
id: tenon-cacao-nibs-roasted-yogurt-bowl
code: BLD-9589
name: Tenon Cacao Nibs Roasted Yogurt Bowl
version: 0.1.0
description: Yogurt Bowl remix with cacao nibs roasted. Derived from parent chassis.
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
      - ref: ingredient/cacao-nibs-roasted
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, cacao nibs roasted and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with cacao nibs roasted.
