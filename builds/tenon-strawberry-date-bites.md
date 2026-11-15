---
id: tenon-strawberry-date-bites
code: BLD-120
name: Tenon Strawberry Date Bites
version: 0.1.0
description: No-bake energy bites remix with strawberries instead of peanut butter. Derived from Tenon Date Peanut Butter Bites.
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
      - ref: ingredient/strawberry
        qty: 50
        unit: g
        note: Hulled
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/oats
        qty: 45
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Pulse pitted dates until a sticky paste forms. Add strawberries, honey, oats, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites (about 30 g each). Chill at least 30 min to firm. Nutrition is for the whole batch as mixed.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with strawberry and honey instead of peanut butter. Milestone BLD-120.
