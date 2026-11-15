---
id: tenon-whole-wheat-oat-bar
code: BLD-313
name: Tenon Whole Wheat Oat Bar
version: 0.1.0
description: Honey oat bar remix with whole-wheat flour. Derived from Tenon Honey Oat Bar.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 140
        unit: g
      - ref: ingredient/whole-wheat-flour
        qty: 60
        unit: g
      - ref: ingredient/peanut-butter
        qty: 110
        unit: g
      - ref: ingredient/honey
        qty: 80
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Warm the honey and peanut butter until pourable. Whisk in the egg.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whole-wheat flour, whey and salt until coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 170 °C until set and golden at the edges.
        equipment: [oven, baking tin]
        temp_c: 170
      - op: 40
        action: Cool fully before cutting into bars.
---

Remix of BLD-016 with whole-wheat flour.
