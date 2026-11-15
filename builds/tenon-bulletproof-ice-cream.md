---
id: tenon-bulletproof-ice-cream
code: BLD-010
name: Tenon Bulletproof-Style Ice Cream
version: 0.1.0
description: Espresso with coconut milk, butter and a high-protein milk base, frozen as ice cream. Lightly sweetened with honey.
derived_from: null
vertical: coffee
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
      - ref: ingredient/espresso
        qty: 60
        unit: g
        note: Double shot, weighed as liquid yield
      - slot: base
        qty: 250
        unit: g
        temp_c: 4
      - ref: ingredient/coconut-milk
        qty: 100
        unit: g
      - ref: ingredient/butter
        qty: 35
        unit: g
      - ref: ingredient/honey
        qty: 25
        unit: g
      - ref: ingredient/salt
        qty: 0.5
        unit: g
    steps:
      - op: 10
        action: Pull a double espresso and cool. Weigh the liquid yield.
        equipment: [espresso machine, scale]
      - op: 20
        action: Blend espresso, milk base, coconut milk, softened butter, honey and salt until emulsified.
        equipment: [blender]
        duration_s: 50
      - op: 30
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 40
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Espresso is liquid yield, not dry grounds. Butter and honey make every variant non-plant-based; coconut adds a tree-nut allergen declaration.
