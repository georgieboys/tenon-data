---
id: matcha
code: ING-006
name: Ceremonial matcha
version: 0.1.1
description: Stone-ground shade-grown green tea. Consumed whole, so its full composition carries into the drink.
category: tea
supplier:
  name: TBD
basis: per_100g
default_source: literature
sources:
  literature:
    type: literature
    ref: "Japanese Food Composition Database reference values for matcha (green tea powder), as commonly published for edible powder per 100 g. Replace with the café supplier certificate of analysis when confirmed."
nutrition:
  energy_kcal: 324
  protein_g: 29.6
  fat_g: 5.3
  saturated_fat_g: 0.68
  carbohydrate_g: 39.5
  sugars_g: 0.5
  fibre_g: 38.5
  sodium_mg: 6
  calcium_mg: 420
  iron_mg: 17
  magnesium_mg: 230
  potassium_mg: 2700
  zinc_mg: 6.3
  vitamin_a_ug: 2400
  vitamin_c_mg: 60
  vitamin_d_ug: 0
  vitamin_k_ug: 2900
  vitamin_b12_ug: 0
  folate_ug: 1200
  caffeine_mg: 3200
allergens: []
diet:
  plant_based: true
  vegetarian: true
---

Matcha is consumed whole; do not model it as an extraction. Grade and origin vary — this panel is a published food-composition reference until the café lot’s CoA is entered as `lab_analysis` or `manufacturer_label`.
