---
id: tenon-water-ice-cream
code: BLD-307
name: Tenon Water Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with water and whey. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
derived_from: build/tenon-cocoa-pb-ice-cream@0.1.0
vertical: food
slots: {}
formats:
  ice_cream:
    inputs:
      - ref: ingredient/water
        qty: 350
        unit: g
        temp_c: 4
      - ref: ingredient/honey
        qty: 60
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Weigh water, honey, whey and salt into a blender jug.
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

Remix of BLD-007 with water and whey.
