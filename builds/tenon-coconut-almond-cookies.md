---
id: tenon-coconut-almond-cookies
code: BLD-186
name: Tenon Coconut Almond Cookies
version: 0.1.0
description: Almond cookie remix with coconut milk. Derived from Tenon Almond Date Cookies.
derived_from: build/tenon-almond-date-cookies@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 100
        unit: g
      - ref: ingredient/coconut-milk
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 45
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
        action: Whisk coconut milk, honey and egg until smooth.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in almond flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set and lightly golden (about 12–15 min).
        equipment: [oven, tray]
        temp_c: 170
---

Remix of BLD-044 with coconut milk.
