---
id: tenon-pistachio-protein-sandwich
code: BLD-083
name: Tenon Pistachio Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with chopped pistachios and honey instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/pistachio
        qty: 30
        unit: g
        note: Shelled, chopped
      - ref: ingredient/honey
        qty: 15
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread honey, scatter chopped pistachios, close the sandwich. Serve immediately.
        equipment: [spatula]
---

Remix of BLD-013 with pistachio and honey. Tree_nut explicit; peanut drops.
