---
id: tenon-cocoa
code: BLD-002
name: Tenon Cocoa
version: 0.1.0
description: Unsweetened cocoa over a high-protein milk base. Deliberately bitter. No added sugar.
derived_from: null
vertical: cocoa
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
      - ref: ingredient/cocoa
        qty: 12
        unit: g
      - ref: ingredient/water
        qty: 40
        unit: g
        temp_c: 90
      - slot: base
        qty: 220
        unit: g
        temp_c: 60
    steps:
      - op: 10
        action: Weigh the cocoa into a pitcher.
        equipment: [scale]
      - op: 20
        action: Add a splash of hot water and whisk to a smooth paste with no dry pockets.
        equipment: [whisk]
        temp_c: 90
      - op: 30
        action: Steam the milk base.
        equipment: [steam wand]
        temp_c: 60
      - op: 40
        action: Whisk in the remaining water, then pour the milk base into the cup and finish with the cocoa paste on top — or whisk everything together for a flat cocoa.
  iced:
    inputs:
      - ref: ingredient/cocoa
        qty: 12
        unit: g
      - ref: ingredient/water
        qty: 30
        unit: g
        temp_c: 90
      - slot: base
        qty: 200
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 120
        unit: g
    steps:
      - op: 10
        action: Weigh the cocoa into a pitcher.
        equipment: [scale]
      - op: 20
        action: Add hot water and whisk to a smooth paste.
        equipment: [whisk]
        temp_c: 90
      - op: 30
        action: Fill the glass with ice.
      - op: 40
        action: Add the cold milk base.
        temp_c: 4
      - op: 50
        action: Pour the cocoa paste over and stir until uniform.
---

Cocoa dose is higher than matcha because cocoa is less intense by weight and the build is meant to read as bitter chocolate, not sweet hot chocolate. No sugar in the published recipe; sweetener on request is recorded separately.
