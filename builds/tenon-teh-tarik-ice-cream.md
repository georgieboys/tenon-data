---
id: tenon-teh-tarik-ice-cream
code: BLD-009
name: Tenon Spiced Teh Tarik Ice Cream
version: 0.1.0
description: Strong black-tea liquor with masala spice and a high-protein milk base, frozen as ice cream. Sweetened with honey. Derived from Tenon Masala Chai.
derived_from: build/tenon-masala-chai@0.1.0
vertical: tea
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
      - ref: ingredient/black-tea
        qty: 120
        unit: g
        note: Strong brew liquor, cooled
        temp_c: 4
      - ref: prep/masala-spice
        qty: 3
        unit: g
      - slot: base
        qty: 320
        unit: g
        temp_c: 4
      - ref: ingredient/honey
        qty: 40
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Brew a strong black tea and cool. Weigh the liquor. Discard the leaf.
        equipment: [kettle, scale, strainer]
      - op: 20
        action: Whisk masala spice into the liquor, then blend with milk base, honey and salt until smooth.
        equipment: [whisk, blender]
        duration_s: 40
      - op: 30
        action: Pour into a freezer-safe pint. Freeze solid (about 24 h).
        temp_c: -18
      - op: 40
        action: Process in a Creami or similar on the ice-cream cycle. Re-spin once if crumbly.
        equipment: [ice cream maker]
---

Tea remains an extraction. Masala is the same transparent prep as the hot drink. Honey keeps the build vegetarian but not plant-based.
