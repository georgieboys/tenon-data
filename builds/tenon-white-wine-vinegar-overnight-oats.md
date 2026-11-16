---
id: tenon-white-wine-vinegar-overnight-oats
code: BLD-6265
name: Tenon White Wine Vinegar Overnight Oats
version: 0.1.0
description: Overnight Oats remix with white wine vinegar. Derived from parent chassis.
derived_from: build/tenon-blueberry-overnight-oats@0.1.0
vertical: food
slots:
  base:
    label: Milk base
    options:
      - prep/soy-protein-milk
      - prep/soy-whey-milk
      - prep/dairy-whey-milk
    default: prep/soy-whey-milk
formats:
  assembled:
    inputs:
      - slot: base
        qty: 180
        unit: g
        temp_c: 4
      - ref: ingredient/oats
        qty: 55
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/white-wine-vinegar
        qty: 50
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Combine milk base, oats, honey, white wine vinegar, whey and salt in a jar. Stir until evenly wet.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix with white wine vinegar.
