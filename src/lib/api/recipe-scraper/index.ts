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
  NutrientUnit,
  AllergenPresenceTypeEnum,
  AllergenDataSourceEnum,

  // Core Models
  Quantity,
  Ingredient,
  RecipeStep,
  Recipe,
  WebRecipe,
  ConversionRatio,
  IngredientSubstitution,

  // Nutrition Types
  NutrientValue,
  Fats,
  Vitamins,
  Minerals,
  MacroNutrients,
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
  ErrorDetail,
  ErrorResponse,
  ValidationError,
  HTTPValidationError,

  // Allergen Types
  AllergenInfo,
  IngredientAllergenResponse,
  RecipeAllergenResponse,

  // Health Check Types
  HealthCheckItem,
  HealthCheckResponse,
} from '@/types/recipe-scraper';
