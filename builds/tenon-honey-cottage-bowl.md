---
id: tenon-honey-cottage-bowl
code: BLD-132
name: Tenon Honey Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with a heavier honey fold and no fruit topping. Derived from Tenon Cottage Cheese Berry Bowl.
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
        qty: 25
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold with no fruit topping. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with honey only.
