---
id: tenon-full-fat-milk-chia
code: BLD-291
name: Tenon Full Fat Milk Chia
version: 0.1.0
description: Chia pudding remix with full-fat milk. Derived from Tenon Chia Pudding.
derived_from: build/tenon-chia-pudding@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/chia
        qty: 40
        unit: g
      - ref: ingredient/full-fat-milk
        qty: 250
        unit: g
        temp_c: 4
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk chia, cold full-fat milk, honey and salt until seeds are suspended.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest 10 min, whisk again, then refrigerate at least 4 h until gelled. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-017 with full-fat milk.
