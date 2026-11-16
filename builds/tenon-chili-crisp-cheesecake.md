---
id: tenon-chili-crisp-cheesecake
code: BLD-6559
name: Tenon Chili Crisp Cheesecake
version: 0.1.0
description: Cheesecake remix with chili crisp. Derived from parent chassis.
derived_from: build/tenon-banana-cheesecake@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/cream-cheese
        qty: 250
        unit: g
      - ref: ingredient/heavy-cream
        qty: 120
        unit: g
      - ref: ingredient/honey
        qty: 55
        unit: g
      - ref: ingredient/chili-crisp
        qty: 40
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/whey-concentrate
        qty: 30
        unit: g
        note: Unflavoured
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Soften the cream cheese.
        equipment: [scale, bowl]
      - op: 20
        action: Blend cream cheese, honey, chili crisp, eggs, heavy cream, whey and salt until completely smooth.
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

Remix with chili crisp.
