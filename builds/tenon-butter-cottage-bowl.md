---
id: tenon-butter-cottage-bowl
code: BLD-386
name: Tenon Butter Cottage Bowl
version: 0.1.0
description: Cottage cheese berry bowl remix with butter. Derived from Tenon Cottage Cheese Berry Bowl.
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
      - ref: ingredient/butter
        qty: 20
        unit: g
        note: Softened
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Soften the butter. Spoon cottage cheese into a bowl. Fold in honey, butter and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with butter.
