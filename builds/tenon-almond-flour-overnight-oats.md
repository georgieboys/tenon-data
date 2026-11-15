---
id: tenon-almond-flour-overnight-oats
code: BLD-433
name: Tenon Almond Flour Overnight Oats
version: 0.1.0
description: Overnight oats remix with almond flour. Derived from Tenon Blueberry Overnight Oats.
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
        qty: 40
        unit: g
      - ref: ingredient/almond-flour
        qty: 25
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Combine milk base, oats, almond flour, honey, whey and salt in a jar. Stir until evenly wet.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-015 with almond flour.
