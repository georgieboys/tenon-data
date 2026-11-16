---
id: tenon-black-vinegar-aged-oat-bar
code: BLD-11445
name: Tenon Black Vinegar Aged Oat Bar
version: 0.1.0
description: Oat Bar remix with black vinegar aged. Derived from parent chassis.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 130
        unit: g
      - ref: ingredient/peanut-butter
        qty: 55
        unit: g
      - ref: ingredient/black-vinegar-aged
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 55
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 25
        unit: g
      - ref: ingredient/salt
        qty: 1.5
        unit: g
    steps:
      - op: 10
        action: Warm peanut butter and honey until pourable. Whisk in the egg. Fold in black-vinegar-aged.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey and salt until evenly coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 165 °C until set at the edges.
        equipment: [oven, tin]
        temp_c: 165
---

Remix with black vinegar aged.
