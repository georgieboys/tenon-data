---
id: tenon-salt-yogurt-bowl
code: BLD-309
name: Tenon Salt Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with salt only. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 200
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in salt only — no honey or fruit.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-025 with salt only.
