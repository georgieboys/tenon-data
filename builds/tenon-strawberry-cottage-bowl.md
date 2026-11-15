---
id: tenon-strawberry-cottage-bowl
code: BLD-022
name: Tenon Strawberry Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with strawberries instead of blueberries. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/strawberry
        qty: 100
        unit: g
        note: Hulled, sliced
      - ref: ingredient/honey
        qty: 15
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
        action: Top with sliced strawberries. Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with strawberry. Milk-only allergens unchanged.
