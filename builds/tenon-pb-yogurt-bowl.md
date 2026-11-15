---
id: tenon-pb-yogurt-bowl
code: BLD-140
name: Tenon PB Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with peanut butter swirled through. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 200
        unit: g
      - ref: ingredient/peanut-butter
        qty: 20
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in peanut butter, honey and salt until lightly swirled.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-022 with peanut butter. One hundred forty builds.
