---
id: tenon-yogurt-cottage-bowl
code: BLD-321
name: Tenon Yogurt Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with Greek yogurt. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 120
        unit: g
      - ref: ingredient/greek-yogurt
        qty: 80
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Fold cottage cheese with Greek yogurt, honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold.
---

Remix of BLD-021 with Greek yogurt.
