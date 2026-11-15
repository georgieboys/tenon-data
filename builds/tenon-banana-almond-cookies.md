---
id: tenon-banana-almond-cookies
code: BLD-110
name: Tenon Banana Almond Cookies
version: 0.1.0
description: Baked almond-flour cookie remix with banana. Derived from Tenon Almond Date Cookies.
derived_from: build/tenon-almond-date-cookies@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 110
        unit: g
      - ref: ingredient/banana
        qty: 80
        unit: g
        note: Peeled, mashed
      - ref: ingredient/dates
        qty: 60
        unit: g
        note: Pitted, chopped
      - ref: ingredient/honey
        qty: 25
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
        action: Pulse dates with honey until a sticky paste forms. Whisk in the egg and mashed banana.
        equipment: [food processor, bowl, whisk, fork]
      - op: 20
        action: Fold in almond flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set and lightly golden (about 12–15 min).
        equipment: [oven, baking tray]
        temp_c: 170
      - op: 40
        action: Cool on the tray. Nutrition is for the whole batch as mixed (input mass).
---

Remix of BLD-044 with banana. Milestone BLD-110.
