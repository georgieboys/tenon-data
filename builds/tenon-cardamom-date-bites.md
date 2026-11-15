---
id: tenon-cardamom-date-bites
code: BLD-213
name: Tenon Cardamom Date Bites
version: 0.1.0
description: Date PB bites remix with cardamom. Derived from Tenon Date Peanut Butter Bites.
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
      - ref: ingredient/cardamom
        qty: 1.5
        unit: g
        note: Freshly ground
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse pitted dates until sticky. Add peanut butter, oats, whey, cardamom and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites. Chill at least 30 min to firm.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with cardamom.
