---
id: tenon-cocoa-protein-sandwich
code: BLD-113
name: Tenon Cocoa Protein Sandwich
version: 0.1.0
description: Protein-bread sandwich remix with cocoa honey yogurt instead of peanut butter. Derived from Tenon Peanut Butter Protein Sandwich.
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
      - ref: ingredient/greek-yogurt
        qty: 50
        unit: g
      - ref: ingredient/cocoa
        qty: 8
        unit: g
      - ref: ingredient/honey
        qty: 12
        unit: g
    steps:
      - op: 10
        action: Slice the chilled protein bread. Weigh two slices to about 80 g.
        equipment: [scale, knife]
      - op: 20
        action: Whisk Greek yogurt with cocoa and honey. Spread onto one slice, close the sandwich. Serve immediately.
        equipment: [spoon]
---

Remix of BLD-013 with cocoa yogurt.
