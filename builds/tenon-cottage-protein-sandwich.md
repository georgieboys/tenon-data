---
id: tenon-cottage-protein-sandwich
code: BLD-061
name: Tenon Cottage Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with cottage cheese instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/cottage-cheese
        qty: 80
        unit: g
      - ref: ingredient/salt
        qty: 0.3
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Spoon cottage cheese onto one slice, season with salt, close the sandwich. Serve immediately or wrap.
        equipment: [spoon]
---

Remix of BLD-013 with cottage cheese. Milk allergen remains; peanut allergen drops unless bread chain still carries tree_nut.
