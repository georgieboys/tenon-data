---
id: tenon-whey-chia
code: BLD-255
name: Tenon Whey Chia
version: 0.1.0
description: Chia pudding remix with extra whey concentrate. Derived from Tenon Chia Pudding.
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
      - ref: ingredient/whey-concentrate
        qty: 25
        unit: g
      - ref: ingredient/honey
        qty: 18
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk chia, cold soy-whey milk, whey, honey and salt until seeds are suspended.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-017 with extra whey.
