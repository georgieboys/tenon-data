---
id: tenon-hydroxypropyl-methylcellulose-cottage-bowl
code: BLD-12004
name: Tenon Hydroxypropyl Methylcellulose Cottage Bowl
version: 0.1.0
description: Cottage Bowl remix with hydroxypropyl methylcellulose. Derived from parent chassis.
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
        qty: 10
        unit: g
      - ref: ingredient/hydroxypropyl-methylcellulose
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, hydroxypropyl methylcellulose and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with hydroxypropyl methylcellulose.
