---
id: tenon-heavy-cream-chia
code: BLD-240
name: Tenon Heavy Cream Chia
version: 0.1.0
description: Chia pudding remix with heavy cream. Derived from Tenon Chia Pudding.
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
        qty: 180
        unit: g
        temp_c: 4
      - ref: ingredient/heavy-cream
        qty: 80
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk chia, cold soy-whey milk, heavy cream, honey and salt until seeds are suspended.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-017 with heavy cream. Two hundred forty builds.
