---
id: tenon-baking-powder-cottage-bowl
code: BLD-367
name: Tenon Baking Powder Cottage Bowl
version: 0.1.0
description: Cottage cheese berry bowl remix with baking powder. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/baking-powder
        qty: 2
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, baking powder and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with baking powder.
