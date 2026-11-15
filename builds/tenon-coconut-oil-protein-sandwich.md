---
id: tenon-coconut-oil-protein-sandwich
code: BLD-548
name: Tenon Coconut Oil Protein Sandwich
version: 0.1.0
description: PB protein sandwich remix with coconut oil. Derived from Tenon PB Protein Sandwich.
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
      - ref: ingredient/peanut-butter
        qty: 24
        unit: g
      - ref: ingredient/coconut-oil
        qty: 10
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter and coconut oil across the slices.
        equipment: [knife, spoon]
      - op: 30
        action: Close the sandwich. Serve immediately or wrap for later.
---

Remix of BLD-013 with coconut oil.
