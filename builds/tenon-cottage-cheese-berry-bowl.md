---
id: tenon-cottage-cheese-berry-bowl
code: BLD-021
name: Tenon Cottage Cheese Berry Bowl
version: 0.1.0
description: Cottage cheese bowl with blueberries, honey and a pinch of salt. High-protein cold assembly — no oats chassis.
derived_from: null
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/cottage-cheese
        qty: 200
        unit: g
      - ref: ingredient/blueberry
        qty: 100
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon cottage cheese into a bowl. Fold in honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with blueberries. Serve cold. Nutrition is for the bowl as assembled.
---

Cold protein bowl using café cottage cheese stock already in the sandwich-bread prep chain.
