---
id: tenon-almond-oat-bar
code: BLD-175
name: Tenon Almond Oat Bar
version: 0.1.0
description: Honey oat bar remix with almond flour. Derived from Tenon Honey Oat Bar.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 120
        unit: g
      - ref: ingredient/almond-flour
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 70
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 30
        unit: g
      - ref: ingredient/butter
        qty: 30
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Soften butter. Whisk with honey and egg.
        equipment: [scale, bowl, whisk]
      - op: 20
        action: Fold in oats, almond flour, whey and salt until evenly coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake until set and lightly golden at the edges.
        equipment: [oven, tin]
        temp_c: 170
---

Remix of BLD-016 with almond flour.
