---
id: tenon-dates-yogurt-bowl
code: BLD-138
name: Tenon Dates Yogurt Bowl
version: 0.1.0
description: Greek yogurt bowl remix with chopped dates instead of honey-only. Derived from Tenon Yogurt Honey Bowl.
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
        qty: 12
        unit: g
      - ref: ingredient/dates
        qty: 40
        unit: g
        note: Pitted, chopped
      - ref: ingredient/salt
        qty: 0.2
        unit: g
    steps:
      - op: 10
        action: Spoon yogurt into a bowl. Fold in honey and salt until lightly combined.
        equipment: [scale, bowl, spoon]
        temp_c: 4
      - op: 20
        action: Top with chopped dates. Serve cold. Nutrition is for the bowl as assembled.
---

Remix of BLD-022 with dates.
