---
id: tenon-egg-oat-bar
code: BLD-403
name: Tenon Egg Oat Bar
version: 0.1.0
description: Honey oat bar remix with elevated egg. Derived from Tenon Honey Oat Bar.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 150
        unit: g
      - ref: ingredient/peanut-butter
        qty: 80
        unit: g
      - ref: ingredient/honey
        qty: 60
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs — elevated egg cell
      - ref: ingredient/whey-concentrate
        qty: 25
        unit: g
      - ref: ingredient/salt
        qty: 1.5
        unit: g
    steps:
      - op: 10
        action: Warm peanut butter and honey until pourable. Whisk in both eggs.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey and salt until evenly coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 165 °C until set at the edges.
        equipment: [oven, tin]
        temp_c: 165
---

Remix of BLD-017 with elevated egg.
