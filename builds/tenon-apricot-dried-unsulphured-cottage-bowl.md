---
id: tenon-apricot-dried-unsulphured-cottage-bowl
code: BLD-9516
name: Tenon Apricot Dried Unsulphured Cottage Bowl
version: 0.1.0
description: Cottage Bowl remix with apricot dried unsulphured. Derived from parent chassis.
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
      - ref: ingredient/apricot-dried-unsulphured
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, apricot dried unsulphured and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with apricot dried unsulphured.
