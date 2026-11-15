---
id: tenon-cloves-date-bites
code: BLD-228
name: Tenon Cloves Date Bites
version: 0.1.0
description: Date PB bites remix with cloves. Derived from Tenon Date Peanut Butter Bites.
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
        qty: 55
        unit: g
      - ref: ingredient/oats
        qty: 40
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 20
        unit: g
      - ref: ingredient/cloves
        qty: 0.8
        unit: g
        note: Finely ground
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse dates until sticky. Add peanut butter, oats, whey, cloves and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with cloves.
