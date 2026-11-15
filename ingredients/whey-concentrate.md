---
id: whey-concentrate
code: ING-004
name: Whey protein concentrate
version: 0.1.1
description: Unflavoured whey protein concentrate (around 80% protein).
category: protein_powder
supplier:
  name: TBD
basis: per_100g
default_source: usda_fdc
sources:
  usda_fdc:
    type: usda_fdc
    ref: "FDC 173180 · Beverages, Protein powder whey based (SR Legacy). Proxy until the café supplier specification is entered."
nutrition:
  energy_kcal: 352
  protein_g: 78.13
  fat_g: 1.56
  saturated_fat_g: 0.781
  carbohydrate_g: 6.25
  sugars_g: 0
  fibre_g: 3.1
  sodium_mg: 156
  calcium_mg: 469
  iron_mg: 1.13
  magnesium_mg: 195
  potassium_mg: 500
  zinc_mg: 6.18
  vitamin_a_ug: 0
  vitamin_c_mg: 0
  vitamin_d_ug: 0
  vitamin_k_ug: 0
  vitamin_b12_ug: 2.45
  folate_ug: 33
  caffeine_mg: 0
allergens: [milk]
diet:
  plant_based: false
  vegetarian: true
---

USDA SR Legacy “Protein powder whey based” is used as a stand-in for unflavoured whey concentrate until the exact supplier lot is labelled in. Replace with `manufacturer_label` when the café SKU is confirmed.
