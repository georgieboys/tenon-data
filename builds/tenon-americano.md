---
id: tenon-americano
code: BLD-005
name: Tenon Americano
version: 0.1.0
description: Double espresso stretched with water. No milk, no sugar — the coffee vertical without a protein base.
derived_from: null
vertical: coffee
slots: {}
formats:
  hot:
    inputs:
      - ref: ingredient/espresso
        qty: 60
        unit: g
        note: Double shot, weighed as liquid yield
      - ref: ingredient/water
        qty: 180
        unit: g
        temp_c: 85
    steps:
      - op: 10
        action: Pull a double espresso into the cup. Weigh the liquid yield.
        equipment: [espresso machine, scale]
      - op: 20
        action: Top with hot water. Do not stir vigorously — let the crema settle.
        temp_c: 85
  iced:
    inputs:
      - ref: ingredient/espresso
        qty: 60
        unit: g
        note: Double shot, weighed as liquid yield
      - ref: ingredient/water
        qty: 120
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 120
        unit: g
    steps:
      - op: 10
        action: Pull a double espresso and cool briefly.
        equipment: [espresso machine, scale]
      - op: 20
        action: Fill the glass with ice and cold water.
      - op: 30
        action: Pour the espresso over.
  ice_blended:
    inputs:
      - ref: ingredient/espresso
        qty: 60
        unit: g
        note: Double shot, weighed as liquid yield
      - ref: ingredient/water
        qty: 140
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 180
        unit: g
    steps:
      - op: 10
        action: Pull a double espresso and cool briefly.
        equipment: [espresso machine, scale]
      - op: 20
        action: Add cold water and ice. Blend until smooth and pourable, not icy grit.
        equipment: [blender]
        duration_s: 20
        temp_c: 4
      - op: 30
        action: Pour into a cold glass. Serve immediately.
---

Americano has no milk slot. Protein drinks sit on Tenon Latte; this build is the transparent coffee-and-water counterpart. Espresso quantity is liquid yield, not dry dose. Ice-blended serving mass includes the ice.

