---
id: tenon-egg-banana-sandwich
code: BLD-034
name: Tenon Egg Banana Sandwich
version: 0.1.0
description: Protein bread sandwich remix with banana alongside egg. Derived from Tenon Egg Protein Sandwich.
derived_from: build/tenon-egg-protein-sandwich@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: prep/protein-bread
        qty: 60
        unit: g
        note: Two slices
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: Soft-scrambled or boiled, cooled
      - ref: ingredient/banana
        qty: 40
        unit: g
        note: Sliced
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Prepare the egg (soft scramble or slice a boiled egg). Season with salt.
        equipment: [scale, pan or knife]
      - op: 20
        action: Layer egg and banana between two slices of protein bread. Serve. Nutrition is for the sandwich as assembled.
---

Remix of BLD-014 with banana. Egg, milk and tree_nut allergens inherited from bread and egg.
