---
id: dairy-whey-milk
code: PRP-003
name: High-protein dairy milk
version: 0.1.0
description: Full-fat cow's milk fortified with whey concentrate. Conventional dairy mouthfeel with added protein.
derived_from: null
inputs:
  - ref: ingredient/full-fat-milk
    qty: 1000
    unit: ml
  - ref: ingredient/whey-concentrate
    qty: 40
    unit: g
yield:
  method: sum
density_g_per_ml: 1.04
storage:
  temp_c: 4
  shelf_life_h: 48
steps:
  - op: 10
    action: Weigh the whey concentrate into a jug.
    equipment: [scale]
  - op: 20
    action: Add about 200 g of the milk and blend to a smooth slurry.
    equipment: [immersion blender]
    duration_s: 30
  - op: 30
    action: Add the remaining milk and blend on low to combine.
    equipment: [immersion blender]
    duration_s: 20
  - op: 40
    action: Transfer to a labelled bottle and chill.
    temp_c: 4
---

Yield is taken as the sum of inputs until measured at the bar.
