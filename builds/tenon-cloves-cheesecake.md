---
id: tenon-cloves-cheesecake
code: BLD-231
name: Tenon Cloves Cheesecake
version: 0.1.0
description: Banana cheesecake remix with cloves. Derived from Tenon Banana Cheesecake.
derived_from: build/tenon-banana-cheesecake@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/cream-cheese
        qty: 300
        unit: g
      - ref: ingredient/heavy-cream
        qty: 150
        unit: g
      - ref: ingredient/honey
        qty: 70
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
        note: Unflavoured
      - ref: ingredient/cloves
        qty: 1.2
        unit: g
        note: Finely ground
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Soften the cream cheese.
        equipment: [scale, bowl]
      - op: 20
        action: Blend cream cheese, honey, cloves, eggs, heavy cream, whey and salt until completely smooth.
        equipment: [food processor]
        duration_s: 60
      - op: 30
        action: Pour into a lined springform or loaf tin. Tap to release air bubbles.
        equipment: [springform tin]
      - op: 40
        action: Bake until the centre still has a slight wobble. Cool, then chill at least 4 h before slicing.
        equipment: [oven]
        temp_c: 160
---

Remix of BLD-012 with cloves.
