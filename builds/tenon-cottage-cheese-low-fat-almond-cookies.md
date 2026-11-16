---
id: tenon-cottage-cheese-low-fat-almond-cookies
code: BLD-9207
name: Tenon Cottage Cheese Low Fat Almond Cookies
version: 0.1.0
description: Almond Cookies remix with cottage cheese low fat. Derived from parent chassis.
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
      - ref: ingredient/cottage-cheese-low-fat
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
        action: Pulse dates with honey and cottage-cheese-low-fat until sticky. Whisk in the egg.
        equipment: [food processor, bowl, whisk]
      - op: 20
        action: Fold in almond flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set.
        equipment: [oven, tray]
        temp_c: 170
---

Remix with cottage cheese low fat.
