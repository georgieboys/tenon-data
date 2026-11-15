---
id: tenon-dates-ice-cream
code: BLD-426
name: Tenon Dates Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with dates. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
derived_from: build/tenon-cocoa-pb-ice-cream@0.1.0
vertical: food
slots:
  base:
    label: Milk base
    options:
      - prep/soy-protein-milk
      - prep/soy-whey-milk
      - prep/dairy-whey-milk
    default: prep/soy-whey-milk
formats:
  ice_cream:
    inputs:
      - slot: base
        qty: 340
        unit: g
        temp_c: 4
      - ref: ingredient/dates
        qty: 60
        unit: g
        note: Pitted
      - ref: ingredient/honey
        qty: 30
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Blend milk base with dates, honey and salt until completely smooth.
        equipment: [scale, blender]
        duration_s: 60
      - op: 20
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 30
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix of BLD-007 with dates.
