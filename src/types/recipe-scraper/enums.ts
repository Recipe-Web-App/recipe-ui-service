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
 * Food group classifications for nutritional analysis.
 */
export enum FoodGroupEnum {
  VEGETABLES = 'VEGETABLES',
  FRUITS = 'FRUITS',
  GRAINS = 'GRAINS',
  LEGUMES = 'LEGUMES',
  NUTS_SEEDS = 'NUTS_SEEDS',
  MEAT = 'MEAT',
  POULTRY = 'POULTRY',
  SEAFOOD = 'SEAFOOD',
  DAIRY = 'DAIRY',
  BEVERAGES = 'BEVERAGES',
  PROCESSED_FOODS = 'PROCESSED_FOODS',
  UNKNOWN = 'UNKNOWN',
}
