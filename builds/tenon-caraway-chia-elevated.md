---
id: tenon-caraway-chia-elevated
code: BLD-1499
name: Tenon Caraway Chia Elevated
version: 0.1.0
description: Chia pudding remix with elevated caraway. Derived from Tenon Chia Pudding.
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
        qty: 190
        unit: g
        temp_c: 4
      - ref: ingredient/chia
        qty: 30
        unit: g
      - ref: ingredient/caraway
        qty: 80
        unit: g
        note: Elevated caraway cell
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk milk base, chia, raspberries, honey and salt until evenly dispersed.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest at least 20 min (or overnight) until gelled. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-016 with elevated caraway.
