---
id: tenon-honey-protein-sandwich
code: BLD-081
name: Tenon Honey Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with honey instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
derived_from: build/tenon-pb-protein-sandwich@0.1.0
vertical: food
slots: {}
formats:
  assembled:
    inputs:
      - ref: prep/protein-bread
        qty: 80
        unit: g
        note: About two slices
      - ref: ingredient/honey
        qty: 25
        unit: g
      - ref: ingredient/butter
        qty: 10
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread butter then honey evenly. Close the sandwich. Serve immediately.
        equipment: [spatula]
---

Remix of BLD-013 with honey and butter. Peanut allergen drops.
