---
id: tenon-rosemary-chia
code: BLD-1266
name: Tenon Rosemary Chia
version: 0.1.0
description: Chia remix with rosemary. Derived from parent chassis.
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
        qty: 200
        unit: g
        temp_c: 4
      - ref: ingredient/chia
        qty: 32
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/rosemary
        qty: 50
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk milk base, chia, honey, rosemary and salt until seeds are evenly dispersed.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest at least 20 min (or overnight) until gelled. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix with rosemary.
