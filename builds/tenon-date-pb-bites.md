---
id: tenon-date-pb-bites
code: BLD-023
name: Tenon Date Peanut Butter Bites
version: 0.1.0
description: No-bake energy bites from dates, peanut butter, oats and whey. Portable snack without oven time.
derived_from: null
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
        qty: 60
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
        action: Pulse pitted dates until a sticky paste forms. Add peanut butter, oats, whey and salt; pulse until uniform.
        equipment: [scale, food processor]
      - op: 20
        action: Roll into 8 bites (about 30 g each). Chill at least 30 min to firm. Nutrition is for the whole batch as mixed.
        equipment: [fridge]
        temp_c: 4
---

Assembled no-bake snack. Peanut, milk and gluten allergens inherited. Batch yield not yet measured on the scale.
