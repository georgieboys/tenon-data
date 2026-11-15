---
id: tenon-peanut-butter-date-bites
code: BLD-456
name: Tenon Peanut Butter Date Bites
version: 0.1.0
description: Date PB bites remix with elevated peanut butter. Derived from Tenon Date Peanut Butter Bites.
derived_from: build/tenon-date-pb-bites@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/dates
        qty: 110
        unit: g
        note: Pitted
      - ref: ingredient/peanut-butter
        qty: 70
        unit: g
        note: Elevated peanut butter cell
      - ref: ingredient/oats
        qty: 35
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse dates until sticky. Add peanut butter, oats, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with elevated peanut butter.
