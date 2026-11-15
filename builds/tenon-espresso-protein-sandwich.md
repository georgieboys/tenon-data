---
id: tenon-espresso-protein-sandwich
code: BLD-115
name: Tenon Espresso Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with espresso honey butter instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
        qty: 12
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
      - ref: ingredient/espresso
        qty: 15
        unit: g
        temp_c: 4
        note: Cooled espresso shot
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Mash butter with honey and cooled espresso. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [fork, spatula]
---

Remix of BLD-013 with espresso honey butter.
