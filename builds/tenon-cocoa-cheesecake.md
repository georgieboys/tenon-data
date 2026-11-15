---
id: tenon-cocoa-cheesecake
code: BLD-091
name: Tenon Cocoa Cheesecake
version: 0.1.0
description: Baked cheesecake remix with cocoa instead of banana. Derived from Tenon Banana Cheesecake.
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
      - ref: ingredient/cocoa
        qty: 40
        unit: g
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
        note: Unflavoured
      - ref: ingredient/honey
        qty: 50
        unit: g
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Soften the cream cheese.
        equipment: [scale, bowl]
      - op: 20
        action: Blend cream cheese, cocoa, eggs, heavy cream, whey, honey and salt until completely smooth.
        equipment: [food processor]
        duration_s: 60
      - op: 30
        action: Pour into a lined springform or loaf tin. Tap to release air bubbles.
        equipment: [springform tin]
      - op: 40
        action: Bake at 160 °C until the edges are set and the centre still has a slight jiggle (about 40–50 min).
        equipment: [oven]
        temp_c: 160
      - op: 50
        action: Cool to room temperature, then chill at least 3 h before slicing. Nutrition is for the whole cake as mixed (input mass).
---

Remix of BLD-012 with cocoa and honey.
