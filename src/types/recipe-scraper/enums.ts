/**
 * Units of measurement for recipe ingredients.
 */
export enum IngredientUnitEnum {
  G = 'G',
  KG = 'KG',
  OZ = 'OZ',
  LB = 'LB',
  ML = 'ML',
  L = 'L',
  CUP = 'CUP',
  TBSP = 'TBSP',
  TSP = 'TSP',
  PIECE = 'PIECE',
  CLOVE = 'CLOVE',
  SLICE = 'SLICE',
  PINCH = 'PINCH',
  CAN = 'CAN',
  BOTTLE = 'BOTTLE',
  PACKET = 'PACKET',
  UNIT = 'UNIT',
}

/**
 * Enumeration of common allergens.
 */
export enum AllergenEnum {
  MILK = 'MILK',
  EGGS = 'EGGS',
  FISH = 'FISH',
  SHELLFISH = 'SHELLFISH',
  TREE_NUTS = 'TREE_NUTS',
  PEANUTS = 'PEANUTS',
  WHEAT = 'WHEAT',
  SOYBEANS = 'SOYBEANS',
  SESAME = 'SESAME',
  CELERY = 'CELERY',
  MUSTARD = 'MUSTARD',
  LUPIN = 'LUPIN',
  SULPHITES = 'SULPHITES',
  ALMONDS = 'ALMONDS',
  CASHEWS = 'CASHEWS',
  HAZELNUTS = 'HAZELNUTS',
  WALNUTS = 'WALNUTS',
  GLUTEN = 'GLUTEN',
  COCONUT = 'COCONUT',
  CORN = 'CORN',
  YEAST = 'YEAST',
  GELATIN = 'GELATIN',
  KIWI = 'KIWI',
  PORK = 'PORK',
  BEEF = 'BEEF',
  ALCOHOL = 'ALCOHOL',
  SULFUR_DIOXIDE = 'SULFUR_DIOXIDE',
  PHENYLALANINE = 'PHENYLALANINE',
  NONE = 'NONE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Units of measurement for nutrient values.
 */
export enum NutrientUnit {
  GRAM = 'GRAM',
  MILLIGRAM = 'MILLIGRAM',
  MICROGRAM = 'MICROGRAM',
  KILOCALORIE = 'KILOCALORIE',
}

/**
 * Allergen presence type classification.
 */
export enum AllergenPresenceTypeEnum {
  CONTAINS = 'CONTAINS',
  MAY_CONTAIN = 'MAY_CONTAIN',
  TRACES = 'TRACES',
}

/**
 * Data source for allergen information.
 */
export enum AllergenDataSourceEnum {
  USDA = 'USDA',
  OPEN_FOOD_FACTS = 'OPEN_FOOD_FACTS',
  LLM_INFERRED = 'LLM_INFERRED',
  MANUAL = 'MANUAL',
}
