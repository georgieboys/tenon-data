---
id: tenon-matcha-cottage-bowl
code: BLD-050
name: Tenon Matcha Cottage Bowl
version: 0.1.0
description: Cottage cheese bowl remix with ceremonial matcha instead of blueberries. Derived from Tenon Cottage Cheese Berry Bowl.
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
      - ref: ingredient/matcha
        qty: 4
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Sift in matcha, then fold with honey and salt until lightly combined.
        equipment: [scale, bowl, spoon, sieve]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-021 with matcha. Milk-only allergens unchanged. Milestone BLD-050.
