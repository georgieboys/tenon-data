---
id: tenon-oats-cottage-bowl
code: BLD-319
name: Tenon Oats Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with dry oats. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 160
        unit: g
      - ref: ingredient/oats
        qty: 30
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in dry oats, honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold; oats stay lightly crunchy.
---

Remix of BLD-021 with oats.
