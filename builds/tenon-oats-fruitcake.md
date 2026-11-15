---
id: tenon-oats-fruitcake
code: BLD-335
name: Tenon Oats Fruitcake
version: 0.1.0
description: Energy fruitcake remix with oats. Derived from Tenon Energy Fruitcake.
derived_from: build/tenon-energy-fruitcake@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/dates
        qty: 220
        unit: g
        note: Pitted medjool
      - ref: ingredient/oats
        qty: 60
        unit: g
      - ref: ingredient/whole-wheat-flour
        qty: 80
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/butter
        qty: 70
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Soften the butter. Pit and chop the dates.
        equipment: [scale, knife]
      - op: 20
        action: Blend dates, eggs and butter to a sticky paste.
        equipment: [food processor]
        duration_s: 45
      - op: 30
        action: Fold in oats, flour and salt until just combined.
        equipment: [bowl, spatula]
      - op: 40
        action: Pack into a lined loaf tin. Bake until a probe comes out with moist crumbs.
        equipment: [oven, loaf tin]
        temp_c: 160
---

Remix of BLD-011 with oats.
