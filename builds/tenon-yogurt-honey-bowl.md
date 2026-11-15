---
id: tenon-yogurt-honey-bowl
code: BLD-025
name: Tenon Yogurt Honey Bowl
version: 0.1.0
description: Greek yogurt bowl with honey, blueberries and a pinch of salt. Simple high-protein cold assembly.
derived_from: null
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/greek-yogurt
        qty: 200
        unit: g
      - ref: ingredient/honey
        qty: 20
        unit: g
      - ref: ingredient/blueberry
        qty: 80
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey and salt.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with blueberries. Serve cold. Nutrition is for the bowl as assembled.
---

Minimal yogurt bowl using ingredients already in the oats chain. Milk allergen only.
