---
id: tenon-pistachio-chia
code: BLD-060
name: Tenon Pistachio Chia
version: 0.1.0
description: Chia pudding remix with pistachios instead of blueberries. Derived from Tenon Chia Pudding.
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
      - ref: ingredient/pistachio
        qty: 30
        unit: g
        note: Shelled, chopped
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
        action: Top with chopped pistachios. Serve cold.
---

Remix of BLD-017 with pistachio. Adds tree_nut allergen.
