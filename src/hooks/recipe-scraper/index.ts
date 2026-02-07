// Health hooks
export {
  useRecipeScraperRoot,
  useRecipeScraperMetrics,
  useRecipeScraperReadiness,
  useRecipeScraperHealth,
} from './use-recipe-scraper-health';

// Recipe hooks
export {
  useCreateRecipeFromUrl,
  usePopularRecipes,
} from './use-recipe-scraper-recipes';

// Nutrition hooks
export {
  useRecipeNutritionalInfo,
  useIngredientNutritionalInfo,
} from './use-recipe-scraper-nutrition';

// Ingredient hooks
export {
  useIngredientSubstitutions,
  useIngredientShoppingInfo,
} from './use-recipe-scraper-ingredients';

// Pairing hooks
export { useRecipePairings } from './use-recipe-scraper-pairing';

// Shopping hooks
export { useRecipeShoppingInfo } from './use-recipe-scraper-shopping';

// Allergen hooks
export {
  useIngredientAllergens,
  useRecipeAllergens,
} from './use-recipe-scraper-allergens';

// Admin hooks
export { useClearRecipeScraperCache } from './use-recipe-scraper-admin';
