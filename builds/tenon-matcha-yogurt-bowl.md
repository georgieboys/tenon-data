---
id: tenon-matcha-yogurt-bowl
code: BLD-042
name: Tenon Matcha Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with ceremonial matcha instead of blueberries. Derived from Tenon Yogurt Honey Bowl.
derived_from: build/tenon-yogurt-honey-bowl@0.1.0
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
      - ref: ingredient/matcha
        qty: 4
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Sift in matcha, then fold with honey and salt until uniform.
        equipment: [scale, bowl, spoon, sieve]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with matcha. Milk-only allergens unchanged.
