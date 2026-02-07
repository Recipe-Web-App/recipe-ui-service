import {
  AllergenEnum,
  AllergenPresenceTypeEnum,
  AllergenDataSourceEnum,
} from './enums';

/**
 * Information about a specific allergen detected in a food item.
 */
export interface AllergenInfo {
  /** The allergen type */
  allergen: AllergenEnum;
  /** How the allergen is present */
  presenceType: AllergenPresenceTypeEnum;
  /** Confidence score from 0 to 1 */
  confidenceScore?: number | null;
  /** Notes about the data source or detection */
  sourceNotes?: string | null;
}

/**
 * Allergen information for a specific ingredient.
 */
export interface IngredientAllergenResponse {
  /** Ingredient identifier */
  ingredientId?: number | null;
  /** Ingredient name */
  ingredientName?: string | null;
  /** USDA food description for the matched ingredient */
  usdaFoodDescription?: string | null;
  /** List of allergens detected */
  allergens: AllergenInfo[];
  /** Source of the allergen data */
  dataSource?: AllergenDataSourceEnum | null;
  /** Overall confidence score from 0 to 1 */
  overallConfidence?: number | null;
}

/**
 * Allergen information for a complete recipe.
 */
export interface RecipeAllergenResponse {
  /** Allergens confirmed present in the recipe */
  contains?: AllergenEnum[];
  /** Allergens that may be present */
  mayContain?: AllergenEnum[];
  /** Detailed allergen information */
  allergens?: AllergenInfo[];
  /** Per-ingredient allergen breakdown */
  ingredientDetails?: Record<string, IngredientAllergenResponse> | null;
  /** Ingredient IDs for which allergen data could not be retrieved */
  missingIngredients?: number[];
}
