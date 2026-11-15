---
id: masala-spice
code: PRP-004
name: Masala spice blend
version: 0.1.0
description: Dry chai spice mix — cinnamon, ginger, cardamom and clove. Transparent ratios; no sugar.
derived_from: null
inputs:
  - ref: ingredient/cinnamon
    qty: 40
    unit: g
  - ref: ingredient/ginger
    qty: 40
    unit: g
  - ref: ingredient/cardamom
    qty: 15
    unit: g
  - ref: ingredient/cloves
    qty: 5
    unit: g
yield:
  method: sum
storage:
  temp_c: 20
  shelf_life_h: 2160
  notes: Airtight jar, cool and dry. About 90 days.
steps:
  - op: 10
    action: Weigh each spice into a bowl.
    equipment: [scale]
  - op: 20
    action: Whisk until uniform in colour. Store labelled.
    equipment: [whisk]
---

One hundred grams of blend. A drink uses a few grams; the rest keeps. Black pepper and fresh ginger can join later as optional rows without breaking the model.
