---
id: tenon-date-protein-sandwich
code: BLD-082
name: Tenon Date Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with mashed dates instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/dates
        qty: 40
        unit: g
        note: Pitted, mashed
      - ref: ingredient/butter
        qty: 8
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Mash dates with butter into a soft paste. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [fork, spatula]
---

Remix of BLD-013 with dates and butter.
