---
id: tenon-egg-cottage-bowl
code: BLD-398
name: Tenon Egg Cottage Bowl
version: 0.1.0
description: Cottage cheese berry bowl remix with soft-boiled egg. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 160
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: Soft-boiled, peeled
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Soft-boil the egg, peel, and chop. Spoon cottage cheese into a bowl. Fold in honey, egg and salt.
        equipment: [scale, bowl, spoon, pot]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with egg.
