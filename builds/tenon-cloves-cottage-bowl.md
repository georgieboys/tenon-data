---
id: tenon-cloves-cottage-bowl
code: BLD-221
name: Tenon Cloves Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with cloves. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/cloves
        qty: 0.6
        unit: g
        note: Finely ground
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in cloves, honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-021 with cloves.
