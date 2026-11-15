---
id: tenon-heavy-cream-date-bites
code: BLD-245
name: Tenon Heavy Cream Date Bites
version: 0.1.0
description: Date PB bites remix with heavy cream. Derived from Tenon Date Peanut Butter Bites.
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
      - ref: ingredient/heavy-cream
        qty: 25
        unit: g
      - ref: ingredient/oats
        qty: 40
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse dates until sticky. Add peanut butter, heavy cream, oats, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with heavy cream.
