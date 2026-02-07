import { NutrientUnit } from './enums';
import { Quantity } from './models';

/**
 * A nutrient measurement with amount and unit.
 */
export interface NutrientValue {
  /** Nutrient amount (minimum 0) */
  amount?: number | null;
  /** Unit of measurement */
  measurement: NutrientUnit;
}

/**
 * Contains fat information for an ingredient.
 */
export interface Fats {
  /** Total fat */
  total?: NutrientValue | null;
  /** Saturated fat */
  saturated?: NutrientValue | null;
  /** Monounsaturated fat */
  monounsaturated?: NutrientValue | null;
  /** Polyunsaturated fat */
  polyunsaturated?: NutrientValue | null;
  /** Trans fat */
  trans?: NutrientValue | null;
}

/**
 * Contains vitamin information for an ingredient.
 */
export interface Vitamins {
  /** Vitamin A */
  vitaminA?: NutrientValue | null;
  /** Vitamin B6 */
  vitaminB6?: NutrientValue | null;
  /** Vitamin B12 */
  vitaminB12?: NutrientValue | null;
  /** Vitamin C */
  vitaminC?: NutrientValue | null;
  /** Vitamin D */
  vitaminD?: NutrientValue | null;
  /** Vitamin E */
  vitaminE?: NutrientValue | null;
  /** Vitamin K */
  vitaminK?: NutrientValue | null;
}

/**
 * Contains mineral information for an ingredient.
 */
export interface Minerals {
  /** Calcium */
  calcium?: NutrientValue | null;
  /** Iron */
  iron?: NutrientValue | null;
  /** Magnesium */
  magnesium?: NutrientValue | null;
  /** Potassium */
  potassium?: NutrientValue | null;
  /** Zinc */
  zinc?: NutrientValue | null;
}

/**
 * Contains macro-nutrient information for an ingredient.
 */
export interface MacroNutrients {
  /** Total calories per serving */
  calories?: NutrientValue | null;
  /** Carbohydrate content */
  carbs?: NutrientValue | null;
  /** Cholesterol content */
  cholesterol?: NutrientValue | null;
  /** Protein content */
  protein?: NutrientValue | null;
  /** Sugar content */
  sugar?: NutrientValue | null;
  /** Added sugar content */
  addedSugar?: NutrientValue | null;
  /** Fat information */
  fats?: Fats;
  /** Fiber content */
  fiber?: NutrientValue | null;
  /** Sodium content */
  sodium?: NutrientValue | null;
}

/**
 * Contains overall nutritional information for an ingredient.
 */
export interface IngredientNutritionalInfoResponse {
  /** Quantity information */
  quantity: Quantity;
  /** Macro-nutrient information */
  macroNutrients?: MacroNutrients;
  /** Vitamin information */
  vitamins?: Vitamins;
  /** Mineral information */
  minerals?: Minerals;
  /** USDA food description for the matched ingredient */
  usdaFoodDescription?: string | null;
}
