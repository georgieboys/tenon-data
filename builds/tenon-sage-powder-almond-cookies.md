---
id: tenon-sage-powder-almond-cookies
code: BLD-14521
name: Tenon Sage Powder Almond Cookies
version: 0.1.0
description: Almond Cookies remix with sage powder. Derived from parent chassis.
derived_from: build/tenon-almond-date-cookies@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 100
        unit: g
      - ref: ingredient/dates
        qty: 70
        unit: g
        note: Pitted, chopped
      - ref: ingredient/honey
        qty: 35
        unit: g
      - ref: ingredient/sage-powder
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
        action: Pulse dates with honey and sage-powder until sticky. Whisk in the egg.
        equipment: [food processor, bowl, whisk]
      - op: 20
        action: Fold in almond flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set.
        equipment: [oven, tray]
        temp_c: 170
---

Remix with sage powder.
