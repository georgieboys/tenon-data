---
id: tenon-tahini-cottage-bowl
code: BLD-502
name: Tenon Tahini Cottage Bowl
version: 0.1.0
description: Cottage cheese berry bowl remix with tahini. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 190
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/tahini
        qty: 30
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, tahini and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with tahini.
