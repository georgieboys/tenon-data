---
id: tenon-matcha
code: BLD-001
name: Tenon Matcha
version: 0.1.0
description: Ceremonial matcha over a high-protein milk base. No added sugar.
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
  hot:
    inputs:
      - ref: ingredient/matcha
        qty: 4
        unit: g
      - ref: ingredient/water
        qty: 60
        unit: g
        temp_c: 80
      - slot: base
        qty: 200
        unit: g
        temp_c: 60
    steps:
      - op: 10
        action: Sift the matcha into a bowl.
        equipment: [scale, sieve, matcha bowl]
      - op: 20
        action: Add the water and whisk in a zigzag until smooth with fine foam and no lumps.
        equipment: [chasen]
        duration_s: 20
        temp_c: 80
      - op: 30
        action: Steam the milk base.
        equipment: [steam wand]
        temp_c: 60
      - op: 40
        action: Pour the milk base into the cup, then pour the matcha over it.
  iced:
    inputs:
      - ref: ingredient/matcha
        qty: 4
        unit: g
      - ref: ingredient/water
        qty: 40
        unit: g
        temp_c: 80
      - slot: base
        qty: 180
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 120
        unit: g
    steps:
      - op: 10
        action: Sift the matcha into a bowl.
        equipment: [scale, sieve, matcha bowl]
      - op: 20
        action: Add the water and whisk until smooth with no lumps.
        equipment: [chasen]
        duration_s: 20
        temp_c: 80
      - op: 30
        action: Fill the glass with ice.
      - op: 40
        action: Add the cold milk base.
        temp_c: 4
      - op: 50
        action: Pour the matcha over the milk base.
  ice_blended:
    inputs:
      - ref: ingredient/matcha
        qty: 5
        unit: g
      - ref: ingredient/water
        qty: 40
        unit: g
        temp_c: 80
      - slot: base
        qty: 200
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 180
        unit: g
    steps:
      - op: 10
        action: Sift the matcha into a pitcher.
        equipment: [scale, sieve]
      - op: 20
        action: Add the water and whisk until smooth with no lumps.
        equipment: [whisk]
        duration_s: 20
        temp_c: 80
      - op: 30
        action: Add the cold milk base and ice. Blend until smooth and pourable, not icy grit.
        equipment: [blender]
        duration_s: 25
        temp_c: 4
      - op: 40
        action: Pour into a cold glass. Serve immediately.
---

The hot and iced formats use the same matcha dose. Iced uses less water so the matcha concentrate stays strong after the ice melts. Ice-blended uses a slightly higher matcha dose so the flavour holds after dilution from blending.

Serving mass for iced and ice-blended includes the ice, so per-100 g values are lower than hot even though the per-serving nutrition is close.
