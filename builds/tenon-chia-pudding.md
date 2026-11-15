---
id: tenon-chia-pudding
code: BLD-017
name: Tenon Chia Pudding
version: 0.1.0
description: Chia seeds gelled in soy-whey milk with honey and blueberries. Cold assembled; fibre-forward.
derived_from: null
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
      - ref: ingredient/blueberry
        qty: 80
        unit: g
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
        action: Top with blueberries. Serve cold. Nutrition is for the jar as assembled.
---

Milk and soy allergens are inherited. Honey keeps plant_based false.
