---
id: tenon-matcha-ice-cream
code: BLD-162
name: Tenon Matcha Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with matcha. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
derived_from: build/tenon-cocoa-pb-ice-cream@0.1.0
vertical: matcha
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
        qty: 400
        unit: g
        temp_c: 4
      - ref: ingredient/matcha
        qty: 8
        unit: g
      - ref: ingredient/honey
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Weigh the milk base and flavour inputs into a blender jug.
        equipment: [scale, blender]
      - op: 20
        action: Blend until completely smooth.
        equipment: [blender]
        duration_s: 45
      - op: 30
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 40
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix of BLD-007 with matcha.
