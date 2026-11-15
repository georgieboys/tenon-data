---
id: tenon-matcha-chia
code: BLD-027
name: Tenon Matcha Chia
version: 0.1.0
description: Chia pudding remix with ceremonial matcha instead of blueberries. Derived from Tenon Chia Pudding.
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
      - ref: ingredient/matcha
        qty: 4
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk chia, cold soy-whey milk, honey, sifted matcha and salt until seeds and matcha are suspended.
        equipment: [scale, bowl, whisk, sieve]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-017 with matcha. Crosses the matcha vertical into assembled food.
