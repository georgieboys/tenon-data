---
id: tenon-tea-yogurt-bowl
code: BLD-046
name: Tenon Tea Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with cooled black tea instead of blueberries. Derived from Tenon Yogurt Honey Bowl.
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
      - ref: ingredient/black-tea
        qty: 40
        unit: g
        temp_c: 4
        note: Strong brew, cooled
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, cooled black tea and salt until uniform.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with black tea. Milk-only allergens; caffeine from tea.
