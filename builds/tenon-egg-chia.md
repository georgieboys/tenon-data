---
id: tenon-egg-chia
code: BLD-400
name: Tenon Egg Chia
version: 0.1.0
description: Chia pudding remix with soft-boiled egg. Derived from Tenon Chia Pudding.
derived_from: build/tenon-chia-pudding@0.1.0
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
      - ref: ingredient/chia
        qty: 35
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: Soft-boiled, peeled and chopped
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Soft-boil and chop the egg. Whisk milk base, chia, honey, egg and salt until seeds are evenly dispersed.
        equipment: [scale, bowl, whisk, pot]
        temp_c: 4
      - op: 20
        action: Rest at least 20 min (or overnight) until gelled. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-016 with egg. Four hundred builds.
