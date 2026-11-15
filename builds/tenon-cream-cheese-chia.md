---
id: tenon-cream-cheese-chia
code: BLD-235
name: Tenon Cream Cheese Chia
version: 0.1.0
description: Chia pudding remix with cream cheese. Derived from Tenon Chia Pudding.
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
        qty: 220
        unit: g
        temp_c: 4
      - ref: ingredient/cream-cheese
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Soften cream cheese. Whisk with chia, cold soy-whey milk, honey and salt until seeds are suspended.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-017 with cream cheese.
