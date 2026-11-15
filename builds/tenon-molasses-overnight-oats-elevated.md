---
id: tenon-molasses-overnight-oats-elevated
code: BLD-650
name: Tenon Molasses Overnight Oats Elevated
version: 0.1.0
description: Overnight oats remix with elevated molasses. Derived from Tenon Blueberry Overnight Oats.
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
        qty: 170
        unit: g
        temp_c: 4
      - ref: ingredient/oats
        qty: 60
        unit: g
      - ref: ingredient/molasses
        qty: 35
        unit: g
        note: Elevated molasses cell
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Combine milk base, oats, molasses, whey and salt in a jar. Stir until evenly wet.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-015 with elevated molasses. Six hundred fifty builds.
