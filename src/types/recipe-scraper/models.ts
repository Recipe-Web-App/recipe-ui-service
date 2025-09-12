import { IngredientUnitEnum } from './enums';

/**
 * Sub-schema for ingredient quantity.
 */
export interface Quantity {
  /** The numeric value of the ingredient quantity */
  amount: number;
  /** Measurement unit for the quantity */
  measurement?: IngredientUnitEnum;
}

/**
 * Common schema for ingredient data.
 */
export interface Ingredient {
  /** The ID of the ingredient */
  ingredientId: number;
  /** Name of the ingredient */
  name?: string | null;
  /** Quantity information */
  quantity?: Quantity | null;
}

/**
 * Represents a single step in the recipe preparation.
 */
export interface RecipeStep {
  /** Step number in the recipe */
  stepNumber: number;
  /** Instruction for this step */
  instruction: string;
  /** Whether this step is optional */
  optional?: boolean;
  /** Optional timer in seconds */
  timerSeconds?: number | null;
  /** Timestamp when the step was created */
  createdAt?: string | null;
}

/**
 * Represents a recipe with all relevant fields.
 */
export interface Recipe {
  /** Unique ID of the recipe */
  recipeId?: number;
  /** Title of the recipe */
  title: string;
  /** Description of the recipe */
  description?: string | null;
  /** Original source URL */
  originUrl?: string | null;
  /** Number of servings */
  servings?: number | null;
  /** Preparation time in minutes */
  preparationTime?: number | null;
  /** Cooking time in minutes */
  cookingTime?: number | null;
  /** Difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  /** List of ingredients */
  ingredients: Ingredient[];
  /** List of preparation steps */
  steps: RecipeStep[];
}

/**
 * Schema containing a recipe from the internet.
 */
export interface WebRecipe {
  /** The name of the recipe as found online */
  recipeName: string;
  /** The source URL where the recipe is located */
  url: string;
}

/**
 * Represents the conversion ratio between original and substitute ingredients.
 */
export interface ConversionRatio {
  /** The numeric conversion ratio from original to substitute */
  ratio: number;
  /** Measurement unit for the conversion */
  measurement: IngredientUnitEnum;
}

/**
 * Represents a single substitution recommendation for an ingredient.
 */
export interface IngredientSubstitution {
  /** The name of the suggested substitute ingredient */
  ingredient: string;
  /** The amount of the substitute ingredient to use */
  quantity?: Quantity | null;
  /** Conversion ratio information */
  conversionRatio: ConversionRatio;
}
