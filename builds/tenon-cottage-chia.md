---
id: tenon-cottage-chia
code: BLD-416
name: Tenon Cottage Chia
version: 0.1.0
description: Chia pudding remix with cottage cheese. Derived from Tenon Chia Pudding.
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
        qty: 100
        unit: g
        temp_c: 4
      - ref: ingredient/cottage-cheese
        qty: 100
        unit: g
      - ref: ingredient/chia
        qty: 35
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk milk base, cottage cheese, chia, honey and salt until seeds are evenly dispersed.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest at least 20 min (or overnight) until gelled. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-016 with cottage cheese.
