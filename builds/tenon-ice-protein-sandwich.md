---
id: tenon-ice-protein-sandwich
code: BLD-357
name: Tenon Ice Protein Sandwich
version: 0.1.0
description: PB protein sandwich remix with ice shards. Derived from Tenon PB Protein Sandwich.
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
        qty: 32
        unit: g
      - ref: ingredient/ice
        qty: 30
        unit: g
        note: Thin ice shards between slices
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spread peanut butter on both slices. Nest thin ice shards on one side.
        equipment: [knife]
      - op: 30
        action: Close the sandwich. Serve immediately while the ice still bites.
---

Remix of BLD-013 with ice shards.
