---
id: unisoy
code: ING-003
name: UniSoy soy milk
version: 0.2.0
description: Reconstituted UniSoy Nutritious Soy Milk Powder (No Cane Sugar Added). Base for the soy milk preps.
category: plant_milk
supplier:
  name: UniSoy
  product: Nutritious Soy Milk Powder "No Cane Sugar Added" (SKU 8885004610316)
basis: per_100ml
density_g_per_ml: 1.03
default_source: manufacturer_label
sources:
  manufacturer_label:
    type: manufacturer_label
    ref: "UniSoy Nutritious Soy Milk Powder No Cane Sugar Added, nutrition as prepared per 100 ml (retailer label transcription, 2026-11-15). Ingredients: organic non-GMO soya bean, fructooligosaccharide, soya bean lecithin, calcium carbonate."
nutrition:
  energy_kcal: 51
  protein_g: 2.6
  fat_g: 1.4
  saturated_fat_g: 0.2
  carbohydrate_g: 7
  sugars_g: 4
  fibre_g: 0
  sodium_mg: 1
  calcium_mg: 95.8
  iron_mg: 0.4
  magnesium_mg: null
  potassium_mg: null
  zinc_mg: null
  vitamin_a_ug: null
  vitamin_c_mg: null
  vitamin_d_ug: null
  vitamin_k_ug: null
  vitamin_b12_ug: null
  folate_ug: null
  caffeine_mg: 0
allergens: [soy]
diet:
  plant_based: true
  vegetarian: true
---

Prepared drink values from the published No Cane Sugar Added powder label (213 kJ ≈ 51 kcal per 100 ml). Micros not on the label stay `null`. If the café switches to a ready-to-drink UniSoy carton, replace this panel with that pack’s values and bump the version.
