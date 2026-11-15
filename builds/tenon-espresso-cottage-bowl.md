---
id: tenon-espresso-cottage-bowl
code: BLD-051
name: Tenon Espresso Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with cooled espresso instead of blueberries. Derived from Tenon Cottage Cheese Berry Bowl.
derived_from: build/tenon-cottage-cheese-berry-bowl@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/espresso
        qty: 30
        unit: g
        temp_c: 4
        note: Cooled espresso shot
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey, cooled espresso and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with espresso. Milk-only allergens; caffeine from espresso.
