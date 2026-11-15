---
id: tenon-oats-yogurt-bowl
code: BLD-323
name: Tenon Oats Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with dry oats. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 160
        unit: g
      - ref: ingredient/oats
        qty: 30
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in dry oats, honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold; oats stay lightly crunchy.
---

Remix of BLD-025 with oats.
