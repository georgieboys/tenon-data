---
id: tenon-full-fat-milk-protein-sandwich
code: BLD-295
name: Tenon Full Fat Milk Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with full-fat milk honey butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
        qty: 10
        unit: g
      - ref: ingredient/full-fat-milk
        qty: 25
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Mash butter with full-fat milk and honey. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [fork, spatula]
---

Remix of BLD-013 with full-fat milk honey butter.
