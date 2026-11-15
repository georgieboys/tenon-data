---
id: tenon-unisoy-oat-bar
code: BLD-284
name: Tenon Unisoy Oat Bar
version: 0.1.0
description: Honey oat bar remix with UniSoy. Derived from Tenon Honey Oat Bar.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 200
        unit: g
      - ref: ingredient/unisoy
        qty: 80
        unit: g
      - ref: ingredient/honey
        qty: 70
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
      - ref: ingredient/butter
        qty: 30
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Warm honey and butter until pourable. Whisk in UniSoy and the egg.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey and salt until coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 170 °C until set and golden at the edges.
        equipment: [oven, baking tin]
        temp_c: 170
      - op: 40
        action: Cool fully before cutting into bars.
---

Remix of BLD-016 with UniSoy.
