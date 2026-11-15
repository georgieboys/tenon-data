---
id: tenon-ice-oat-bar
code: BLD-351
name: Tenon Ice Oat Bar
version: 0.1.0
description: Honey oat bar remix with crushed ice. Derived from Tenon Honey Oat Bar.
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
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 25
        unit: g
      - ref: ingredient/ice
        qty: 40
        unit: g
        note: Crushed; folds steam into the bake
      - ref: ingredient/salt
        qty: 1.5
        unit: g
    steps:
      - op: 10
        action: Warm peanut butter and honey until pourable. Whisk in the egg.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey, crushed ice and salt until evenly coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 165 °C until set at the edges.
        equipment: [oven, tin]
        temp_c: 165
---

Remix of BLD-017 with crushed ice.
