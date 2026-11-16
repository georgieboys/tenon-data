---
id: tenon-tempeh-starter-ice-cream
code: BLD-11462
name: Tenon Tempeh Starter Ice Cream
version: 0.1.0
description: Ice Cream remix with tempeh starter. Derived from parent chassis.
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
        qty: 350
        unit: g
        temp_c: 4
      - ref: ingredient/tempeh-starter
        qty: 50
        unit: g
      - ref: ingredient/honey
        qty: 45
        unit: g
      - ref: ingredient/salt
        qty: 1.2
        unit: g
    steps:
      - op: 10
        action: Blend milk base with tempeh starter, honey and salt until completely smooth.
        equipment: [scale, blender]
        duration_s: 60
      - op: 20
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 30
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix with tempeh starter.
