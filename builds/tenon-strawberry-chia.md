---
id: tenon-strawberry-chia
code: BLD-018
name: Tenon Strawberry Chia
version: 0.1.0
description: Chia pudding remix with strawberries instead of blueberries. Derived from Tenon Chia Pudding.
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
        qty: 20
        unit: g
      - ref: ingredient/strawberry
        qty: 100
        unit: g
        note: Hulled, sliced
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
        action: Top with sliced strawberries. Serve cold.
---

Remix of BLD-017 with strawberry. Demonstrates derived_from on assembled food.
