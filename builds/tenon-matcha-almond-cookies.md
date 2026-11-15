---
id: tenon-matcha-almond-cookies
code: BLD-078
name: Tenon Matcha Almond Cookies
version: 0.1.0
description: Baked almond-flour cookie remix with matcha. Derived from Tenon Almond Date Cookies.
derived_from: build/tenon-almond-date-cookies@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 115
        unit: g
      - ref: ingredient/matcha
        qty: 8
        unit: g
      - ref: ingredient/dates
        qty: 80
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
        action: Pulse dates with honey until a sticky paste forms. Whisk in the egg.
        equipment: [food processor, bowl, whisk]
      - op: 20
        action: Fold in almond flour, sifted matcha, baking powder and salt until a soft dough forms.
        equipment: [spatula, sieve]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set (about 12–15 min).
        equipment: [oven, baking tray]
        temp_c: 170
      - op: 40
        action: Cool on the tray. Nutrition is for the whole batch as mixed (input mass).
---

Remix of BLD-044 with matcha.
