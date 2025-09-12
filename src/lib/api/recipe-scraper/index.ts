// Base client and utilities
export {
  recipeScraperClient,
  RecipeScraperApiError,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';

// Recipe Scraper APIs
export * from './health';
export * from './recipes';
export * from './nutrition';
export * from './ingredients';
export * from './pairing';
export * from './shopping';
export * from './admin';

// Re-export types for convenience
export type {
  // Enums
  IngredientUnitEnum,
  AllergenEnum,
  FoodGroupEnum,

  // Core Models
  Quantity,
  Ingredient,
  RecipeStep,
  Recipe,
  WebRecipe,
  ConversionRatio,
  IngredientSubstitution,

  // Nutrition Types
  Sugars,
  Fats,
  Fibers,
  Vitamins,
  Minerals,
  MacroNutrients,
  IngredientClassification,
  IngredientNutritionalInfoResponse,

  // Request Types
  CreateRecipeRequest,

  // Response Types
  CreateRecipeResponse,
  PopularRecipesResponse,
  RecipeNutritionalInfoResponse,
  RecommendedSubstitutionsResponse,
  PairingSuggestionsResponse,
  IngredientShoppingInfoResponse,
  RecipeShoppingInfoResponse,
  ErrorResponse,
  ValidationError,
  HTTPValidationError,

  // Health Check Types
  HealthCheckItem,
  HealthCheckResponse,
} from '@/types/recipe-scraper';
