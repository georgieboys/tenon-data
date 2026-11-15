---
id: tenon-pb-banana-sandwich
code: BLD-032
name: Tenon Peanut Butter Banana Sandwich
version: 0.1.0
description: Protein bread sandwich remix with banana alongside peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
derived_from: build/tenon-pb-protein-sandwich@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: prep/protein-bread
        qty: 60
        unit: g
        note: Two slices
      - ref: ingredient/peanut-butter
        qty: 30
        unit: g
      - ref: ingredient/banana
        qty: 60
        unit: g
        note: Sliced
    steps:
      - op: 10
        action: Spread peanut butter on both slices of protein bread.
        equipment: [scale, knife]
      - op: 20
        action: Layer banana slices, close the sandwich, and serve. Nutrition is for the sandwich as assembled.
---

Remix of BLD-013 with banana. Peanut, milk, egg and tree_nut allergens inherited from bread and peanut butter.
