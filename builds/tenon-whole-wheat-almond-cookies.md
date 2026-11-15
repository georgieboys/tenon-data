---
id: tenon-whole-wheat-almond-cookies
code: BLD-315
name: Tenon Whole Wheat Almond Cookies
version: 0.1.0
description: Almond cookie remix with whole-wheat flour. Derived from Tenon Almond Date Cookies.
derived_from: build/tenon-almond-date-cookies@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 80
        unit: g
      - ref: ingredient/whole-wheat-flour
        qty: 40
        unit: g
      - ref: ingredient/dates
        qty: 70
        unit: g
        note: Pitted, chopped
      - ref: ingredient/honey
        qty: 40
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/baking-powder
        qty: 3
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse dates with honey until sticky. Whisk in the egg.
        equipment: [food processor, bowl, whisk]
      - op: 20
        action: Fold in almond flour, whole-wheat flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set.
        equipment: [oven, tray]
        temp_c: 170
---

Remix of BLD-044 with whole-wheat flour.
