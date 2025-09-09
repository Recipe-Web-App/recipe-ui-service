import { AllergenEnum, FoodGroupEnum } from './enums';
import { Quantity } from './models';

/**
 * Contains sugar information for an ingredient.
 */
export interface Sugars {
  /** Sugar content in grams */
  sugarG?: string | null;
  /** Added sugars in grams */
  addedSugarsG?: string | null;
}

/**
 * Contains fat information for an ingredient.
 */
export interface Fats {
  /** Fat content in grams */
  fatG?: string | null;
  /** Saturated fat content in grams */
  saturatedFatG?: string | null;
  /** Monounsaturated fat content in grams */
  monounsaturatedFatG?: string | null;
  /** Polyunsaturated fat content in grams */
  polyunsaturatedFatG?: string | null;
  /** Omega-3 fat content in grams */
  omega3FatG?: string | null;
  /** Omega-6 fat content in grams */
  omega6FatG?: string | null;
  /** Omega-9 fat content in grams */
  omega9FatG?: string | null;
  /** Trans fat content in grams */
  transFatG?: string | null;
}

/**
 * Contains fiber information for an ingredient.
 */
export interface Fibers {
  /** Total fiber content in grams */
  fiberG?: string | null;
  /** Soluble fiber in grams */
  solubleFiberG?: string | null;
  /** Insoluble fiber in grams */
  insolubleFiberG?: string | null;
}

/**
 * Contains vitamin information for an ingredient.
 */
export interface Vitamins {
  /** Vitamin A in milligrams */
  vitaminAMg?: string | null;
  /** Vitamin B6 in milligrams */
  vitaminB6Mg?: string | null;
  /** Vitamin B12 in milligrams */
  vitaminB12Mg?: string | null;
  /** Vitamin C in milligrams */
  vitaminCMg?: string | null;
  /** Vitamin D in milligrams */
  vitaminDMg?: string | null;
  /** Vitamin E in milligrams */
  vitaminEMg?: string | null;
  /** Vitamin K in milligrams */
  vitaminKMg?: string | null;
}

/**
 * Contains mineral information for an ingredient.
 */
export interface Minerals {
  /** Calcium in milligrams */
  calciumMg?: string | null;
  /** Iron in milligrams */
  ironMg?: string | null;
  /** Magnesium in milligrams */
  magnesiumMg?: string | null;
  /** Potassium in milligrams */
  potassiumMg?: string | null;
  /** Sodium in milligrams */
  sodiumMg?: string | null;
  /** Zinc in milligrams */
  zincMg?: string | null;
}

/**
 * Contains macro-nutrient information for an ingredient.
 */
export interface MacroNutrients {
  /** Total calories per serving */
  calories?: number | null;
  /** Carbohydrate content in grams */
  carbsG?: string | null;
  /** Cholesterol content in milligrams */
  cholesterolMg?: string | null;
  /** Protein content in grams */
  proteinG?: string | null;
  /** Sugar information */
  sugars?: Sugars;
  /** Fat information */
  fats?: Fats;
  /** Fiber information */
  fibers?: Fibers;
}

/**
 * Contains meta and classification information for an ingredient.
 */
export interface IngredientClassification {
  /** List of allergens associated with the ingredient */
  allergies?: AllergenEnum[] | null;
  /** Food groups this ingredient belongs to */
  foodGroups?: FoodGroupEnum[] | null;
  /** Nutri-Score value (-15 very healthy to +40 unhealthy) */
  nutriscoreScore?: number | null;
  /** Nutri-Score letter grade (A-E) */
  nutriscoreGrade?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  /** Product name from nutritional database */
  productName?: string | null;
  /** Brand information from nutritional database */
  brands?: string | null;
  /** Product categories from nutritional database */
  categories?: string | null;
}

/**
 * Contains overall nutritional information for an ingredient.
 */
export interface IngredientNutritionalInfoResponse {
  /** Quantity information */
  quantity: Quantity;
  /** Classification information */
  classification?: IngredientClassification;
  /** Macro-nutrient information */
  macroNutrients?: MacroNutrients;
  /** Vitamin information */
  vitamins?: Vitamins;
  /** Mineral information */
  minerals?: Minerals;
}
