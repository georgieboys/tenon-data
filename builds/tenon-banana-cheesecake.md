---
id: tenon-banana-cheesecake
code: BLD-012
name: Tenon Banana Cheesecake
version: 0.1.0
description: No-added-sugar baked cheesecake from cream cheese, heavy cream, banana, egg and whey. Sweetness from ripe banana only.
derived_from: null
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
      - ref: ingredient/banana
        qty: 250
        unit: g
        note: Ripe, peeled
      - ref: ingredient/egg
        qty: 100
        unit: g
        note: About two large eggs
      - ref: ingredient/whey-concentrate
        qty: 40
        unit: g
        note: Unflavoured
      - ref: ingredient/salt
        qty: 1
        unit: g
    steps:
      - op: 10
        action: Soften the cream cheese. Peel and mash the bananas.
        equipment: [scale, bowl]
      - op: 20
        action: Blend cream cheese, banana, eggs, heavy cream, whey and salt until completely smooth.
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
        action: Cool to room temperature, then chill at least 3 h before slicing. Nutrition is for the whole cake as mixed (input mass; bake yield not yet measured).
---

Whole-cake nutrition until the café locks slice mass and measures bake yield. Milk and egg allergens are inherited. No refined sugar — ripe banana is the only sweetener.
