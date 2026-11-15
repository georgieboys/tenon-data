---
id: tenon-strawberry-fruitcake
code: BLD-122
name: Tenon Strawberry Fruitcake
version: 0.1.0
description: Dense date fruitcake remix with strawberries. Derived from Tenon Energy Fruitcake.
derived_from: build/tenon-energy-fruitcake@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/dates
        qty: 200
        unit: g
        note: Pitted medjool
      - ref: ingredient/strawberry
        qty: 100
        unit: g
        note: Hulled, diced
      - ref: ingredient/whole-wheat-flour
        qty: 120
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/butter
        qty: 80
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
        action: Fold in flour, diced strawberries and salt until just combined. Do not overmix.
        equipment: [bowl, spatula]
      - op: 40
        action: Pack into a lined loaf tin. Bake at 170 °C until a skewer comes out with moist crumbs (about 45–55 min).
        equipment: [oven, loaf tin]
        temp_c: 170
      - op: 50
        action: Cool fully before slicing. Nutrition is for the whole loaf as baked (input mass).
---

Remix of BLD-011 with strawberry.
