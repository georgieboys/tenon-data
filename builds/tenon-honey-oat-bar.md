---
id: tenon-honey-oat-bar
code: BLD-016
name: Tenon Honey Oat Bar
version: 0.1.0
description: Baked oat bar with peanut butter, honey, whey and egg. Café snack and portable protein.
derived_from: null
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 200
        unit: g
      - ref: ingredient/peanut-butter
        qty: 120
        unit: g
      - ref: ingredient/honey
        qty: 80
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Warm the honey and peanut butter until pourable. Whisk in the egg.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey and salt until coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 170 °C until set and golden at the edges (about 18–22 min).
        equipment: [oven, baking tin]
        temp_c: 170
      - op: 40
        action: Cool fully before cutting into bars. Nutrition is for the whole slab as mixed (input mass).
---

Peanut, egg, milk and gluten allergens are inherited. Bake yield not yet measured.
