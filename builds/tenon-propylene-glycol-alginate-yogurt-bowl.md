---
id: tenon-propylene-glycol-alginate-yogurt-bowl
code: BLD-12015
name: Tenon Propylene Glycol Alginate Yogurt Bowl
version: 0.1.0
description: Yogurt Bowl remix with propylene glycol alginate. Derived from parent chassis.
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
      - ref: ingredient/propylene-glycol-alginate
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, propylene glycol alginate and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with propylene glycol alginate.
