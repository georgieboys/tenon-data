---
id: tenon-date-chia
code: BLD-139
name: Tenon Date Chia
version: 0.1.0
description: Chia pudding remix with chopped dates instead of blueberries. Derived from Tenon Chia Pudding.
derived_from: build/tenon-chia-pudding@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/chia
        qty: 40
        unit: g
      - ref: prep/soy-whey-milk
        qty: 250
        unit: g
        temp_c: 4
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/dates
        qty: 50
        unit: g
        note: Pitted, chopped
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk chia, cold soy-whey milk, honey and salt until seeds are suspended.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled.
        equipment: [fridge]
        temp_c: 4
      - op: 30
        action: Top with chopped dates. Serve cold.
---

Remix of BLD-017 with dates.
