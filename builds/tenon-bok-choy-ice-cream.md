---
id: tenon-bok-choy-ice-cream
code: BLD-2234
name: Tenon Bok Choy Ice Cream
version: 0.1.0
description: Ice Cream remix with bok choy. Derived from parent chassis.
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
      - ref: ingredient/bok-choy
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
        action: Blend milk base with bok choy, honey and salt until completely smooth.
        equipment: [scale, blender]
        duration_s: 60
      - op: 20
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 30
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Remix with bok choy.
