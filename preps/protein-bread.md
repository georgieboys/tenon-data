---
id: protein-bread
code: PRP-005
name: High-protein sandwich bread
version: 0.1.0
description: Cottage-cheese and almond-flour loaf with egg and whey. Gluten-free structure for café sandwiches. Carnivore-adjacent protein bread concept, published as a prep.
derived_from: null
inputs:
  - ref: ingredient/cottage-cheese
    qty: 250
    unit: g
  - ref: ingredient/egg
    qty: 150
    unit: g
    note: About three large eggs
  - ref: ingredient/almond-flour
    qty: 120
    unit: g
  - ref: ingredient/whey-concentrate
    qty: 30
    unit: g
  - ref: ingredient/baking-powder
    qty: 8
    unit: g
  - ref: ingredient/salt
    qty: 2
    unit: g
yield:
  method: sum
storage:
  temp_c: 4
  shelf_life_h: 72
  notes: Cool fully, wrap, refrigerate. Slice when cold. Freeze slices for longer holding.
steps:
  - op: 10
    action: Blend cottage cheese and eggs until completely smooth.
    equipment: [food processor]
    duration_s: 45
  - op: 20
    action: Fold in almond flour, whey, baking powder and salt until just combined.
    equipment: [bowl, spatula]
  - op: 30
    action: Pour into a lined loaf tin. Bake at 175 °C until a skewer comes out clean (about 35–45 min).
    equipment: [oven, loaf tin]
    temp_c: 175
  - op: 40
    action: Cool fully before slicing. Yield is input mass until baked mass is measured at the café.
---

Tree-nut, milk and egg allergens are inherited. Moisture loss on bake is not yet measured — nutrition is a lower-bound on concentration until `yield.method: measured`.
