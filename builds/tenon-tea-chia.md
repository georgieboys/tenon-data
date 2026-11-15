---
id: tenon-tea-chia
code: BLD-039
name: Tenon Tea Chia
version: 0.1.0
description: Chia pudding remix with strong black tea instead of blueberries. Derived from Tenon Chia Pudding.
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
        qty: 200
        unit: g
        temp_c: 4
      - ref: ingredient/black-tea
        qty: 50
        unit: g
        temp_c: 4
        note: Strong brew, cooled
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk chia, cold soy-whey milk, cooled black tea, honey and salt until seeds are suspended.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-017 with black tea. Crosses tea into assembled food.
