---
id: tenon-blueberry-overnight-oats
code: BLD-015
name: Tenon Blueberry Overnight Oats
version: 0.1.0
description: Rolled oats soaked in Greek yogurt and soy-whey milk, finished with blueberries, whey and honey. No refined sugar.
derived_from: null
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
      - ref: ingredient/blueberry
        qty: 80
        unit: g
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
        action: Fold in most of the blueberries. Cover and refrigerate at least 6 h (overnight preferred).
        equipment: [fridge]
        temp_c: 4
      - op: 30
        action: Top with remaining blueberries. Serve cold. Nutrition is for the jar as assembled.
---

Cold assembled food — same inheritance chain as sandwiches. Milk, soy and gluten allergens are inherited. Honey keeps plant_based false.
