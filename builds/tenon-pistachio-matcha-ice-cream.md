---
id: tenon-pistachio-matcha-ice-cream
code: BLD-008
name: Tenon Pistachio–Matcha Ice Cream
version: 0.1.0
description: Matcha and ground pistachio ice cream on a high-protein milk base, lightly sweetened with honey. Designed for a home Creami or similar.
derived_from: null
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
      - ref: ingredient/pistachio
        qty: 50
        unit: g
      - ref: ingredient/honey
        qty: 35
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Grind the pistachios to a fine meal if not already ground.
        equipment: [scale, food processor]
      - op: 20
        action: Blend milk base, matcha, pistachio meal, honey and salt until smooth.
        equipment: [blender]
        duration_s: 50
      - op: 30
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 40
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Matcha is consumed whole. Tree-nut allergen comes from pistachio; milk/soy from the chosen base. Honey keeps the build vegetarian but not plant-based.
