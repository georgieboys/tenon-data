---
id: tenon-cardamom-yogurt-bowl
code: BLD-203
name: Tenon Cardamom Yogurt Bowl
version: 0.1.0
description: Tenon Cardamom Yogurt Bowl remix with cardamom. Derived from parent chassis.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 200
        unit: g
      - ref: ingredient/cardamom
        qty: 1
        unit: g
        note: Freshly ground
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon into a bowl. Fold in spice, honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with cardamom.
