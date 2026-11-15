---
id: tenon-ginger-overnight-oats
code: BLD-197
name: Tenon Ginger Overnight Oats
version: 0.1.0
description: Overnight oats remix with ginger. Derived from Tenon Blueberry Overnight Oats.
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
      - ref: ingredient/ginger
        qty: 3
        unit: g
        note: Finely grated
      - ref: ingredient/honey
        qty: 18
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Combine oats, Greek yogurt, cold soy-whey milk, whey, ginger, honey and salt in a jar. Stir until uniform.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h (overnight preferred). Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-015 with ginger.
