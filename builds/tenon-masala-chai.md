---
id: tenon-masala-chai
code: BLD-006
name: Tenon Masala Chai
version: 0.1.0
description: Strong black tea liquor with transparent masala spice and a high-protein milk base. No added sugar.
derived_from: build/tenon-tea@0.1.0
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
  hot:
    inputs:
      - ref: ingredient/black-tea
        qty: 120
        unit: g
        note: Strong brew liquor, weighed as liquid yield
        temp_c: 95
      - ref: prep/masala-spice
        qty: 2.5
        unit: g
      - slot: base
        qty: 160
        unit: g
        temp_c: 60
    steps:
      - op: 10
        action: Brew a strong black tea; weigh the liquor. Discard the leaf.
        equipment: [kettle, scale, strainer]
        temp_c: 95
      - op: 20
        action: Whisk the masala spice into the hot liquor until suspended.
        equipment: [whisk]
      - op: 30
        action: Steam the milk base.
        equipment: [steam wand]
        temp_c: 60
      - op: 40
        action: Pour the milk base into the spiced tea and stir once.
  iced:
    inputs:
      - ref: ingredient/black-tea
        qty: 100
        unit: g
        note: Strong brew liquor, cooled
        temp_c: 4
      - ref: prep/masala-spice
        qty: 2.5
        unit: g
      - slot: base
        qty: 140
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 120
        unit: g
    steps:
      - op: 10
        action: Brew a strong black tea and cool. Weigh the liquor.
        equipment: [kettle, scale, strainer]
      - op: 20
        action: Whisk the masala spice into a splash of the liquor, then combine.
        equipment: [whisk]
      - op: 30
        action: Fill the glass with ice.
      - op: 40
        action: Add the cold milk base and the spiced tea. Stir once.
        temp_c: 4
---

Derived from Tenon Tea. Spice is a prep so ratios stay remixable; tea remains an extraction.
