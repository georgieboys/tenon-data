---
id: tenon-soy-isolate-date-bites
code: BLD-270
name: Tenon Soy Isolate Date Bites
version: 0.1.0
description: Date PB bites remix with soy protein isolate. Derived from Tenon Date Peanut Butter Bites.
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
        qty: 50
        unit: g
      - ref: ingredient/oats
        qty: 30
        unit: g
      - ref: ingredient/soy-protein-isolate
        qty: 25
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse dates until sticky. Add peanut butter, oats, soy isolate, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with soy isolate. Two hundred seventy builds.
