---
id: tenon-pickles-dill-overnight-oats
code: BLD-10517
name: Tenon Pickles Dill Overnight Oats
version: 0.1.0
description: Overnight Oats remix with pickles dill. Derived from parent chassis.
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
      - ref: ingredient/pickles-dill
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
        action: Combine milk base, oats, honey, pickles dill, whey and salt in a jar. Stir until evenly wet.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix with pickles dill.
