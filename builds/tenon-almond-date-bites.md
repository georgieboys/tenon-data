---
id: tenon-almond-date-bites
code: BLD-177
name: Tenon Almond Date Bites
version: 0.1.0
description: Date PB bites remix with almond flour. Derived from Tenon Date Peanut Butter Bites.
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
      - ref: ingredient/almond-flour
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Pulse dates with honey until sticky. Fold in almond flour, whey and salt.
        equipment: [food processor, bowl]
      - op: 20
        action: Roll into 12 bites. Chill until firm. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with almond flour.
