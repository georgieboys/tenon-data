---
id: tenon-sichuan-peppercorn-powder-cottage-bowl
code: BLD-15754
name: Tenon Sichuan Peppercorn Powder Cottage Bowl
version: 0.1.0
description: Cottage Bowl remix with sichuan peppercorn powder. Derived from parent chassis.
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
      - ref: ingredient/sichuan-peppercorn-powder
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, sichuan peppercorn powder and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with sichuan peppercorn powder.
