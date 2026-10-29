---
id: soy-protein-milk
code: PRP-001
name: High-protein soy milk
version: 0.1.0
description: UniSoy fortified with soy protein isolate. Fully plant-based.
derived_from: null
inputs:
  - ref: ingredient/unisoy
    qty: 1000
    unit: ml
  - ref: ingredient/soy-protein-isolate
    qty: 35
    unit: g
yield:
  method: measured
  mass_g: 1060
density_g_per_ml: 1.04
storage:
  temp_c: 4
  shelf_life_h: 48
  notes: Shake before use. Isolate may settle.
steps:
  - op: 10
    action: Weigh the soy protein isolate into a jug.
    equipment: [scale]
  - op: 20
    action: Add about 200 g of the soy milk and blend to a smooth slurry with no dry pockets.
    equipment: [immersion blender]
    duration_s: 30
  - op: 30
    action: Add the remaining soy milk and blend on low to combine without whipping in air.
    equipment: [immersion blender]
    duration_s: 20
  - op: 40
    action: Rest so the foam settles, then transfer to a labelled bottle and chill.
    duration_s: 600
    temp_c: 4
---

Measured yield is slightly below the input mass because some slurry stays on the jug and blender.

Soy isolate gives a thinner body than whey at the same protein level, which affects microfoam. Texture notes to be added after bar testing.
