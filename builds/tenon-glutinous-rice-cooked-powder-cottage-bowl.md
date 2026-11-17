---
id: tenon-glutinous-rice-cooked-powder-cottage-bowl
code: BLD-16754
name: Tenon Glutinous Rice Cooked Powder Cottage Bowl
version: 0.1.0
description: Cottage Bowl remix with glutinous rice cooked powder. Derived from parent chassis.
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
      - ref: ingredient/glutinous-rice-cooked-powder
        qty: 60
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, glutinous rice cooked powder and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix with glutinous rice cooked powder.
