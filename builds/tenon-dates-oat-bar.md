---
id: tenon-dates-oat-bar
code: BLD-425
name: Tenon Dates Oat Bar
version: 0.1.0
description: Honey oat bar remix with dates. Derived from Tenon Honey Oat Bar.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 140
        unit: g
      - ref: ingredient/dates
        qty: 80
        unit: g
        note: Pitted, chopped
      - ref: ingredient/peanut-butter
        qty: 70
        unit: g
      - ref: ingredient/honey
        qty: 50
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
        action: Warm peanut butter and honey until pourable. Whisk in the egg.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, chopped dates, whey and salt until evenly coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 165 °C until set at the edges.
        equipment: [oven, tin]
        temp_c: 165
---

Remix of BLD-017 with dates.
