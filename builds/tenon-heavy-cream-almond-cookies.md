---
id: tenon-heavy-cream-almond-cookies
code: BLD-246
name: Tenon Heavy Cream Almond Cookies
version: 0.1.0
description: Almond cookie remix with heavy cream. Derived from Tenon Almond Date Cookies.
derived_from: build/tenon-almond-date-cookies@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 120
        unit: g
      - ref: ingredient/dates
        qty: 60
        unit: g
        note: Pitted, chopped
      - ref: ingredient/heavy-cream
        qty: 30
        unit: g
      - ref: ingredient/honey
        qty: 35
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
        action: Pulse dates with honey and heavy cream until sticky. Whisk in the egg.
        equipment: [food processor, bowl, whisk]
      - op: 20
        action: Fold in almond flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set.
        equipment: [oven, tray]
        temp_c: 170
---

Remix of BLD-044 with heavy cream.
