---
id: tenon-egg-ice-cream
code: BLD-402
name: Tenon Egg Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with soft-boiled egg. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
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
      - ref: ingredient/egg
        qty: 50
        unit: g
        note: Soft-boiled, peeled
      - ref: ingredient/honey
        qty: 45
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Soft-boil and peel the egg. Blend milk base with egg, honey and salt until completely smooth.
        equipment: [scale, blender, pot]
        duration_s: 60
      - op: 20
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 30
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix of BLD-007 with egg.
