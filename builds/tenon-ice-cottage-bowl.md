---
id: tenon-ice-cottage-bowl
code: BLD-303
name: Tenon Ice Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix topped with ice. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 180
        unit: g
      - ref: ingredient/ice
        qty: 40
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with ice. Serve immediately. Nutrition includes ice mass.
---

Remix of BLD-021 with ice.
