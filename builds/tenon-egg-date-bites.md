---
id: tenon-egg-date-bites
code: BLD-401
name: Tenon Egg Date Bites
version: 0.1.0
description: Date PB bites remix with soft-boiled egg. Derived from Tenon Date Peanut Butter Bites.
derived_from: build/tenon-date-pb-bites@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/dates
        qty: 120
        unit: g
        note: Pitted
      - ref: ingredient/peanut-butter
        qty: 40
        unit: g
      - ref: ingredient/oats
        qty: 35
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: Soft-boiled, peeled
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Soft-boil and peel the egg. Pulse dates until sticky. Add peanut butter, oats, egg, whey and salt; pulse until uniform.
        equipment: [scale, food processor, pot]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with egg.
