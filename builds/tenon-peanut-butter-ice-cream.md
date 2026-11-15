---
id: tenon-peanut-butter-ice-cream
code: BLD-449
name: Tenon Peanut Butter Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with elevated peanut butter. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
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
      - ref: ingredient/peanut-butter
        qty: 50
        unit: g
        note: Elevated peanut butter cell
      - ref: ingredient/honey
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Blend milk base with peanut butter, honey and salt until completely smooth.
        equipment: [scale, blender]
        duration_s: 60
      - op: 20
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 30
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix of BLD-007 with elevated peanut butter.
