---
id: tenon-fermented-chili-paste-powder-chia
code: BLD-16006
name: Tenon Fermented Chili Paste Powder Chia
version: 0.1.0
description: Chia remix with fermented chili paste powder. Derived from parent chassis.
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
      - ref: ingredient/fermented-chili-paste-powder
        qty: 50
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Whisk milk base, chia, honey, fermented chili paste powder and salt until seeds are evenly dispersed.
        equipment: [scale, bowl, whisk]
        temp_c: 4
      - op: 20
        action: Rest at least 20 min (or overnight) until gelled. Stir before serving.
        equipment: [fridge]
        temp_c: 4
---

Remix with fermented chili paste powder.
