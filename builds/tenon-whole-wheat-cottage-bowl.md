---
id: tenon-whole-wheat-cottage-bowl
code: BLD-376
name: Tenon Whole Wheat Cottage Bowl
version: 0.1.0
description: Cottage cheese berry bowl remix with whole-wheat flour. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 180
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/whole-wheat-flour
        qty: 25
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, whole-wheat flour and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with whole-wheat flour.
