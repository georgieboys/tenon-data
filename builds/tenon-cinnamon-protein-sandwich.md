---
id: tenon-cinnamon-protein-sandwich
code: BLD-111
name: Tenon Cinnamon Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with cinnamon honey butter instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/butter
        qty: 15
        unit: g
      - ref: ingredient/honey
        qty: 15
        unit: g
      - ref: ingredient/cinnamon
        qty: 1.5
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Mash butter with honey and cinnamon. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [fork, spatula]
---

Remix of BLD-013 with cinnamon honey butter.
