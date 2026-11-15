---
id: tenon-heavy-cream-ice-cream
code: BLD-452
name: Tenon Heavy Cream Ice Cream
version: 0.1.0
description: Cocoa–PB ice cream remix with elevated heavy cream. Derived from Tenon Cocoa–Peanut Butter Ice Cream.
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
        qty: 300
        unit: g
        temp_c: 4
      - ref: ingredient/heavy-cream
        qty: 100
        unit: g
        note: Elevated heavy cream cell
      - ref: ingredient/honey
        qty: 45
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Blend milk base with heavy cream, honey and salt until completely smooth.
        equipment: [scale, blender]
        duration_s: 45
      - op: 20
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 30
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix of BLD-007 with elevated heavy cream.
