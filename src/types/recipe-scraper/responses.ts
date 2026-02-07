import {
  Recipe,
  WebRecipe,
  Ingredient,
  IngredientSubstitution,
  Quantity,
} from './models';
import { IngredientNutritionalInfoResponse } from './nutrition';

/**
 * Response model returned after a recipe is successfully created.
 */
export interface CreateRecipeResponse {
  /** The created recipe */
  recipe: Recipe;
}

/**
 * Response schema representing a list of popular recipes from the internet.
 */
export interface PopularRecipesResponse {
  /** Paginated recipes list */
  recipes: WebRecipe[];
  /** Max number of recipes returned */
  limit: number;
  /** Start index of recipes */
  offset: number;
  /** Total number of available recipes */
  count: number;
}

/**
 * Response schema representing nutritional information for a recipe.
 */
export interface RecipeNutritionalInfoResponse {
  /** Nutritional information for each ingredient in the recipe */
  ingredients?: Record<string, IngredientNutritionalInfoResponse> | null;
  /** List of ingredient IDs for which nutritional information could not be retrieved */
  missingIngredients?: number[] | null;
  /** Total aggregated nutritional information for the recipe */
  total?: IngredientNutritionalInfoResponse | null;
}

/**
 * Response schema representing a list of substitutions for an ingredient.
 */
export interface RecommendedSubstitutionsResponse {
  /** The ingredient being evaluated */
  ingredient: Ingredient;
  /** List of recommended substitution options */
  recommendedSubstitutions: IngredientSubstitution[];
  /** The maximum number of substitutions to return */
  limit?: number;
  /** The starting index for pagination of results */
  offset?: number;
  /** The total number of substitution recommendations available */
  count?: number;
}

/**
 * Response model for pairing suggestions.
 */
export interface PairingSuggestionsResponse {
  /** The ID of the recipe being evaluated for pairing */
  recipeId: number;
  /** A list of recommended pairing recipes */
  pairingSuggestions: WebRecipe[];
  /** The maximum number of items returned */
  limit: number;
  /** The offset used for pagination */
  offset: number;
  /** The total number of available suggestions */
  count: number;
}

/**
 * Response schema representing shopping information for an ingredient.
 */
export interface IngredientShoppingInfoResponse {
  /** The name of the ingredient */
  ingredientName: string;
  /** Quantity information */
  quantity: Quantity;
  /** The estimated price of the ingredient (None if unavailable) */
  estimatedPrice?: string | null;
}

/**
 * Response schema representing shopping information for a recipe.
 */
export interface RecipeShoppingInfoResponse {
  /** The unique identifier of the recipe */
  recipeId: number;
  /** Dictionary mapping ingredient names to their shopping information */
  ingredients: Record<string, IngredientShoppingInfoResponse>;
  /** The total estimated cost for all ingredients */
  totalEstimatedCost: string;
}

/**
 * Structured error detail for validation or field-level errors.
 */
export interface ErrorDetail {
  /** Error code identifying the specific error */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Field that caused the error, if applicable */
  field?: string | null;
}

/**
 * Standard error response schema.
 */
export interface ErrorResponse {
  /** Error code for programmatic handling */
  error: string;
  /** Human-readable error message */
  message: string;
  /** Detailed error information */
  details?: ErrorDetail[] | null;
  /** Request identifier for tracing */
  requestId?: string | null;
}

/**
 * Pydantic validation error schema.
 */
export interface ValidationError {
  /** Location of the validation error */
  loc: (string | number)[];
  /** Validation error message */
  msg: string;
  /** Validation error type */
  type: string;
}

/**
 * HTTP validation error response.
 */
export interface HTTPValidationError {
  /** List of validation errors */
  detail?: ValidationError[];
}
