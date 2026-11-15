---
id: tenon-cream-cheese-cottage-bowl
code: BLD-233
name: Tenon Cream Cheese Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with cream cheese. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 150
        unit: g
      - ref: ingredient/cream-cheese
        qty: 50
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Soften cream cheese. Fold into cottage cheese with honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-021 with cream cheese.
