---
id: tenon-pistachio-date-bites
code: BLD-075
name: Tenon Pistachio Date Bites
version: 0.1.0
description: No-bake energy bites remix with pistachios instead of peanut butter. Derived from Tenon Date Peanut Butter Bites.
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
      - ref: ingredient/honey
        qty: 25
        unit: g
      - ref: ingredient/pistachio
        qty: 50
        unit: g
        note: Shelled
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
        action: Pulse pitted dates and pistachios until a sticky paste forms. Add honey, oats, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites (about 30 g each). Chill at least 30 min to firm. Nutrition is for the whole batch as mixed.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-023 with pistachio. Tree_nut allergen; peanut drops.
