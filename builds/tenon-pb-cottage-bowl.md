---
id: tenon-pb-cottage-bowl
code: BLD-133
name: Tenon PB Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with peanut butter swirled through instead of blueberries. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/peanut-butter
        qty: 20
        unit: g
      - ref: ingredient/honey
        qty: 10
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in peanut butter, honey and salt until lightly swirled.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with peanut butter.
