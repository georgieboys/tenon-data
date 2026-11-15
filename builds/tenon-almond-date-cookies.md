---
id: tenon-almond-date-cookies
code: BLD-044
name: Tenon Almond Date Cookies
version: 0.1.0
description: Baked almond-flour cookies sweetened with dates and honey, bound with egg. Gluten-free café snack.
derived_from: null
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/almond-flour
        qty: 120
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
        action: Fold in almond flour, baking powder and salt until a soft dough forms.
        equipment: [spatula]
      - op: 30
        action: Scoop into 12 cookies on a lined tray. Bake at 170 °C until set and lightly golden (about 12–15 min).
        equipment: [oven, baking tray]
        temp_c: 170
      - op: 40
        action: Cool on the tray. Nutrition is for the whole batch as mixed (input mass).
---

Baked gluten-free snack. Egg and tree_nut allergens inherited. Bake yield not yet measured.
