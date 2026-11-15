---
id: tenon-coconut-fruitcake
code: BLD-187
name: Tenon Coconut Fruitcake
version: 0.1.0
description: Energy fruitcake remix with coconut milk. Derived from Tenon Energy Fruitcake.
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
      - ref: ingredient/coconut-milk
        qty: 60
        unit: g
      - ref: ingredient/whole-wheat-flour
        qty: 120
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/butter
        qty: 60
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Soften the butter. Pit and chop the dates.
        equipment: [scale, knife]
      - op: 20
        action: Blend dates, coconut milk, eggs, butter and honey to a sticky paste.
        equipment: [food processor]
        duration_s: 45
      - op: 30
        action: Fold in flour and salt until just combined. Do not overmix.
        equipment: [bowl, spatula]
      - op: 40
        action: Pack into a lined loaf tin. Bake until a probe comes out with moist crumbs.
        equipment: [oven, loaf tin]
        temp_c: 160
---

Remix of BLD-011 with coconut milk.
