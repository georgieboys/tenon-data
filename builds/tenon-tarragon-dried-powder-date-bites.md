---
id: tenon-tarragon-dried-powder-date-bites
code: BLD-15296
name: Tenon Tarragon Dried Powder Date Bites
version: 0.1.0
description: Date Bites remix with tarragon dried powder. Derived from parent chassis.
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
        qty: 35
        unit: g
      - ref: ingredient/tarragon-dried-powder
        qty: 35
        unit: g
      - ref: ingredient/oats
        qty: 30
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse dates until sticky. Add peanut butter, tarragon dried powder, oats, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min.
        equipment: [fridge]
        temp_c: 4
---

Remix with tarragon dried powder.
