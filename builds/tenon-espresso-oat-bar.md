---
id: tenon-espresso-oat-bar
code: BLD-069
name: Tenon Espresso Oat Bar
version: 0.1.0
description: Baked oat bar remix with espresso instead of peanut butter as the flavour lead. Derived from Tenon Honey Oat Bar.
derived_from: build/tenon-honey-oat-bar@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/oats
        qty: 200
        unit: g
      - ref: ingredient/honey
        qty: 100
        unit: g
      - ref: ingredient/espresso
        qty: 40
        unit: g
        temp_c: 4
        note: Cooled espresso shot
      - ref: ingredient/egg
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
      - ref: ingredient/butter
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 2
        unit: g
    steps:
      - op: 10
        action: Warm the honey and butter until pourable. Whisk in the egg and cooled espresso.
        equipment: [bowl, whisk]
      - op: 20
        action: Fold in oats, whey and salt until coated.
        equipment: [spatula]
      - op: 30
        action: Press into a lined tin. Bake at 170 °C until set (about 18–22 min).
        equipment: [oven, baking tin]
        temp_c: 170
      - op: 40
        action: Cool fully before cutting into bars. Nutrition is for the whole slab as mixed (input mass).
---

Remix of BLD-016 with espresso and butter instead of peanut butter.
