---
id: tenon-soy-isolate-cheesecake
code: BLD-276
name: Tenon Soy Isolate Cheesecake
version: 0.1.0
description: Banana cheesecake remix with soy isolate. Derived from Tenon Banana Cheesecake.
derived_from: build/tenon-banana-cheesecake@0.1.0
vertical: food
slots: {}
formats:
  baked:
    inputs:
      - ref: ingredient/cream-cheese
        qty: 280
        unit: g
      - ref: ingredient/heavy-cream
        qty: 140
        unit: g
      - ref: ingredient/honey
        qty: 60
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/soy-protein-isolate
        qty: 40
        unit: g
      - ref: ingredient/whey-concentrate
        qty: 20
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
        action: Blend cream cheese, honey, eggs, heavy cream, soy isolate, whey and salt until completely smooth.
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

Remix of BLD-012 with soy isolate.
