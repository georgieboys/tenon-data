---
id: tenon-yogurt-overnight-oats
code: BLD-407
name: Tenon Yogurt Overnight Oats
version: 0.1.0
description: Overnight oats remix with Greek yogurt. Derived from Tenon Blueberry Overnight Oats.
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
        qty: 100
        unit: g
        temp_c: 4
      - ref: ingredient/greek-yogurt
        qty: 100
        unit: g
      - ref: ingredient/oats
        qty: 60
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
        action: Combine milk base, Greek yogurt, oats, honey, whey and salt in a jar. Stir until evenly wet.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-015 with Greek yogurt.
