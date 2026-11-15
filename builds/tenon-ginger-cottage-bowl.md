---
id: tenon-ginger-cottage-bowl
code: BLD-201
name: Tenon Ginger Cottage Bowl
version: 0.1.0
description: Tenon Ginger Cottage Bowl remix with ginger. Derived from parent chassis.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/ginger
        qty: 3
        unit: g
        note: Finely grated
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon into a bowl. Fold in spice, honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with ginger.
