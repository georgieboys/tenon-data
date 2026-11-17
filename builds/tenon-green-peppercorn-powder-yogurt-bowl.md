---
id: tenon-green-peppercorn-powder-yogurt-bowl
code: BLD-14603
name: Tenon Green Peppercorn Powder Yogurt Bowl
version: 0.1.0
description: Yogurt Bowl remix with green peppercorn powder. Derived from parent chassis.
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
      - ref: ingredient/green-peppercorn-powder
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, green peppercorn powder and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with green peppercorn powder.
