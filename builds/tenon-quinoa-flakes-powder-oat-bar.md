---
id: tenon-quinoa-flakes-powder-oat-bar
code: BLD-17007
name: Tenon Quinoa Flakes Powder Oat Bar
version: 0.1.0
description: Oat Bar remix with quinoa flakes powder. Derived from parent chassis.
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
      - ref: ingredient/quinoa-flakes-powder
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
        action: Warm peanut butter and honey until pourable. Whisk in the egg. Fold in quinoa-flakes-powder.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey and salt until evenly coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 165 °C until set at the edges.
        equipment: [oven, tin]
        temp_c: 165
---

Remix with quinoa flakes powder.
