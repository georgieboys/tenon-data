---
id: tenon-grapefruit-zest-dried-cottage-bowl
code: BLD-13216
name: Tenon Grapefruit Zest Dried Cottage Bowl
version: 0.1.0
description: Cottage Bowl remix with grapefruit zest dried. Derived from parent chassis.
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
      - ref: ingredient/grapefruit-zest-dried
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, grapefruit zest dried and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with grapefruit zest dried.
