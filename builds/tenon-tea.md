---
id: tenon-tea
code: BLD-004
name: Tenon Tea
version: 0.1.0
description: Strong black tea liquor over a high-protein milk base. No added sugar. Spices deferred to a later prep.
derived_from: null
vertical: tea
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
      - ref: ingredient/black-tea
        qty: 120
        unit: g
        note: Strong brew liquor, weighed as liquid yield
        temp_c: 95
      - slot: base
        qty: 160
        unit: g
        temp_c: 60
    steps:
      - op: 10
        action: Brew a strong black tea; weigh the liquor into the cup. Discard the leaf.
        equipment: [kettle, scale, strainer]
        temp_c: 95
      - op: 20
        action: Steam the milk base to the target temperature with fine foam.
        equipment: [steam wand]
        temp_c: 60
      - op: 30
        action: Pour the milk base into the tea and stir once.
  iced:
    inputs:
      - ref: ingredient/black-tea
        qty: 100
        unit: g
        note: Strong brew liquor, cooled
        temp_c: 4
      - slot: base
        qty: 140
        unit: g
        temp_c: 4
      - ref: ingredient/ice
        qty: 120
        unit: g
    steps:
      - op: 10
        action: Brew a strong black tea and cool. Weigh the liquor.
        equipment: [kettle, scale, strainer]
      - op: 20
        action: Fill the glass with ice.
      - op: 30
        action: Add the cold milk base.
        temp_c: 4
      - op: 40
        action: Pour the tea over and stir once.
---

Tea quantity is liquid yield, not dry leaf dose. A future spice prep (masala) will sit upstream of this build without changing the extraction rule.
