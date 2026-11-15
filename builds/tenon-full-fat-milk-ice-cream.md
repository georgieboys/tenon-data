---
id: tenon-full-fat-milk-ice-cream
code: BLD-293
name: Tenon Full Fat Milk Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with full-fat milk as the only liquid. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
derived_from: build/tenon-cocoa-pb-ice-cream@0.1.0
vertical: food
slots: {}
formats:
  ice_cream:
    inputs:
      - ref: ingredient/full-fat-milk
        qty: 400
        unit: g
        temp_c: 4
      - ref: ingredient/honey
        qty: 45
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Weigh full-fat milk, honey and salt into a blender jug.
        equipment: [scale, blender]
      - op: 20
        action: Blend until completely smooth.
        equipment: [blender]
        duration_s: 30
      - op: 30
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 40
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix of BLD-007 with full-fat milk only.
