---
id: tenon-salt-cottage-bowl
code: BLD-308
name: Tenon Salt Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with salt only. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/salt
        qty: 1.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in salt only — no honey or fruit.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-021 with salt only.
