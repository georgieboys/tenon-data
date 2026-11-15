---
id: tenon-strawberry-overnight-oats
code: BLD-019
name: Tenon Strawberry Overnight Oats
version: 0.1.0
description: Overnight oats remix with strawberries instead of blueberries. Derived from Tenon Blueberry Overnight Oats.
derived_from: build/tenon-blueberry-overnight-oats@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: ingredient/oats
        qty: 60
        unit: g
      - ref: ingredient/greek-yogurt
        qty: 120
        unit: g
      - ref: prep/soy-whey-milk
        qty: 120
        unit: g
        temp_c: 4
      - ref: ingredient/whey-concentrate
        qty: 20
        unit: g
      - ref: ingredient/strawberry
        qty: 100
        unit: g
        note: Hulled, sliced
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Combine oats, Greek yogurt, cold soy-whey milk, whey, honey and salt in a jar. Stir until uniform.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Fold in most of the strawberries. Cover and refrigerate at least 6 h (overnight preferred).
        equipment: [fridge]
        temp_c: 4
      - op: 30
        action: Top with remaining strawberries. Serve cold. Nutrition is for the jar as assembled.
---

Remix of BLD-015 with strawberry. Demonstrates derived_from on overnight oats.
