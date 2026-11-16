---
id: tenon-arborio-rice-cooked-fruitcake
code: BLD-10084
name: Tenon Arborio Rice Cooked Fruitcake
version: 0.1.0
description: Fruitcake remix with arborio rice cooked. Derived from parent chassis.
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
      - ref: ingredient/whole-wheat-flour
        qty: 110
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/butter
        qty: 50
        unit: g
      - ref: ingredient/arborio-rice-cooked
        qty: 50
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Soften the butter. Pit and chop the dates.
        equipment: [scale, knife]
      - op: 20
        action: Blend dates, eggs, butter and arborio-rice-cooked to a sticky paste.
        equipment: [food processor]
        duration_s: 45
      - op: 30
        action: Fold in flour and salt until just combined.
        equipment: [bowl, spatula]
      - op: 40
        action: Pack into a lined loaf tin. Bake until a probe comes out with moist crumbs.
        equipment: [oven, loaf tin]
        temp_c: 160
---

Remix with arborio rice cooked.
