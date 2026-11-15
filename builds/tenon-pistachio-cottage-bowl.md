---
id: tenon-pistachio-cottage-bowl
code: BLD-053
name: Tenon Pistachio Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with pistachios instead of blueberries. Derived from Tenon Cottage Cheese Berry Bowl.
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
      - ref: ingredient/pistachio
        qty: 30
        unit: g
        note: Shelled, chopped
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with chopped pistachios. Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with pistachio. Milk and tree_nut allergens.
