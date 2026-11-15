---
id: black-tea
code: ING-010
name: Black tea, brewed
version: 0.1.0
description: Black tea as the extracted liquid. Not dry leaf — steeping discards the leaf mass.
category: tea
supplier:
  name: TBD
basis: per_100g
density_g_per_ml: 1.0
default_source: usda_fdc
sources:
  usda_fdc:
    type: usda_fdc
    ref: "FDC 173227 · Beverages, tea, black, brewed, prepared with tap water (SR Legacy). Proxy until Tenon locks brew strength and analyses its own liquor."
nutrition:
  energy_kcal: 1
  protein_g: 0
  fat_g: 0
  saturated_fat_g: 0.002
  carbohydrate_g: 0.3
  sugars_g: 0
  fibre_g: 0
  sodium_mg: 3
  calcium_mg: 0
  iron_mg: 0.02
  magnesium_mg: 3
  potassium_mg: 37
  zinc_mg: 0.02
  vitamin_a_ug: 0
  vitamin_c_mg: 0
  vitamin_d_ug: 0
  vitamin_k_ug: 0
  vitamin_b12_ug: 0
  folate_ug: 5
  caffeine_mg: 20
allergens: []
diet:
  plant_based: true
  vegetarian: true
---

Black tea is an **extraction**. Do not inherit nutrition from dry leaf. When the café locks leaf grade, water ratio, time and temperature, replace this panel with `lab_analysis` of that liquor. Spiced masala chai will layer a separate spice prep on top of this base.
