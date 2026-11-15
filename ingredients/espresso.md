---
id: espresso
code: ING-009
name: Espresso, brewed
version: 0.1.0
description: Restaurant-style espresso as the extracted liquid. Not dry coffee grounds — extraction discards most of the solid.
category: coffee
supplier:
  name: TBD
basis: per_100g
density_g_per_ml: 0.99
default_source: usda_fdc
sources:
  usda_fdc:
    type: usda_fdc
    ref: "FDC 171891 · Beverages, coffee, espresso, restaurant-prepared (SR Legacy). Proxy until Tenon dials in and analyses its own shot."
nutrition:
  energy_kcal: 9
  protein_g: 0.12
  fat_g: 0.18
  saturated_fat_g: 0.092
  carbohydrate_g: 1.67
  sugars_g: 0
  fibre_g: 0
  sodium_mg: 14
  calcium_mg: 2
  iron_mg: 0.13
  magnesium_mg: 80
  potassium_mg: 115
  zinc_mg: 0.05
  vitamin_a_ug: 0
  vitamin_c_mg: 0
  vitamin_d_ug: 0
  vitamin_k_ug: 0.1
  vitamin_b12_ug: 0
  folate_ug: 1
  caffeine_mg: 212
allergens: []
diet:
  plant_based: true
  vegetarian: true
---

Espresso is an **extraction**. Do not inherit nutrition from dry grounds. When the café locks a recipe (dose, yield, pressure, time), replace this panel with `lab_analysis` of that shot.
