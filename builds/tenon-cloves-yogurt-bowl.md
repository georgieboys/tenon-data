---
id: tenon-cloves-yogurt-bowl
code: BLD-222
name: Tenon Cloves Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with cloves. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 200
        unit: g
      - ref: ingredient/cloves
        qty: 0.6
        unit: g
        note: Finely ground
      - ref: ingredient/honey
        qty: 18
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in cloves, honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-025 with cloves.
