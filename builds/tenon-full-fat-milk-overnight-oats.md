---
id: tenon-full-fat-milk-overnight-oats
code: BLD-292
name: Tenon Full Fat Milk Overnight Oats
version: 0.1.0
description: Overnight oats remix with full-fat milk. Derived from Tenon Blueberry Overnight Oats.
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
        qty: 80
        unit: g
      - ref: ingredient/full-fat-milk
        qty: 160
        unit: g
        temp_c: 4
      - ref: ingredient/whey-concentrate
        qty: 20
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Combine oats, Greek yogurt, cold full-fat milk, whey, honey and salt in a jar. Stir until uniform.
        equipment: [scale, jar, spoon]
        temp_c: 4
      - op: 20
        action: Cover and refrigerate at least 6 h. Serve cold.
        equipment: [fridge]
        temp_c: 4
---

Remix of BLD-015 with full-fat milk.
