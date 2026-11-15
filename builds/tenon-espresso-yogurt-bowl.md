---
id: tenon-espresso-yogurt-bowl
code: BLD-045
name: Tenon Espresso Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with cooled espresso instead of blueberries. Derived from Tenon Yogurt Honey Bowl.
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
      - ref: ingredient/espresso
        qty: 30
        unit: g
        temp_c: 4
        note: Cooled espresso shot
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Spoon Greek yogurt into a bowl. Fold in honey, cooled espresso and salt until uniform.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-025 with espresso. Milk-only allergens; caffeine from espresso.
