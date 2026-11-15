---
id: tenon-latte
code: BLD-003
name: Tenon Latte
version: 0.1.0
description: Double espresso over a high-protein milk base. No added sugar.
derived_from: null
vertical: coffee
slots:
  base:
    label: Milk base
    options:
      - prep/soy-protein-milk
      - prep/soy-whey-milk
      - prep/dairy-whey-milk
    default: prep/soy-whey-milk
formats:
  hot:
    inputs:
      - ref: ingredient/espresso
        qty: 60
        unit: g
        note: Double shot, weighed as liquid yield
      - slot: base
        qty: 220
        unit: g
        temp_c: 60
    steps:
      - op: 10
        action: Pull a double espresso into the cup. Weigh the liquid yield.
        equipment: [espresso machine, scale]
      - op: 20
        action: Steam the milk base to the target temperature with fine foam.
        equipment: [steam wand]
        temp_c: 60
      - op: 30
        action: Pour the milk base over the espresso.
  iced:
    inputs:
      - ref: ingredient/espresso
        qty: 60
        unit: g
        note: Double shot, weighed as liquid yield
      - slot: base
        qty: 180
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 120
        unit: g
    steps:
      - op: 10
        action: Pull a double espresso and cool briefly.
        equipment: [espresso machine, scale]
      - op: 20
        action: Fill the glass with ice.
      - op: 30
        action: Add the cold milk base.
        temp_c: 4
      - op: 40
        action: Pour the espresso over and stir once.
---

Espresso quantity is liquid yield, not dry dose. The dry coffee mass is discarded after extraction and must not appear in the bill of materials.
