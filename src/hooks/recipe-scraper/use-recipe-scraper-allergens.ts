import { useQuery } from '@tanstack/react-query';
import { allergensApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type {
  IngredientAllergenResponse,
  RecipeAllergenResponse,
} from '@/types/recipe-scraper';

/**
 * Hook to get allergen information for a specific ingredient
 * GET /api/recipe-scraper/ingredients/{ingredient_id}/allergens
 *
 * @param ingredientId - The ID of the ingredient (must be > 0)
 */
export const useIngredientAllergens = (ingredientId: number) => {
  return useQuery<IngredientAllergenResponse>({
    queryKey: [...QUERY_KEYS.RECIPE_SCRAPER.INGREDIENT_ALLERGENS, ingredientId],
    queryFn: () => allergensApi.getIngredientAllergens(ingredientId),
    enabled: ingredientId > 0,
  });
};

/**
 * Hook to get allergen information for a recipe
 * GET /api/recipe-scraper/recipes/{recipe_id}/allergens
 *
 * @param recipeId - The ID of the recipe (must be > 0)
 * @param params.includeIngredientDetails - Include per-ingredient allergen breakdown
 */
export const useRecipeAllergens = (
  recipeId: number,
  params?: {
    includeIngredientDetails?: boolean;
  }
) => {
  return useQuery<RecipeAllergenResponse>({
    queryKey: [...QUERY_KEYS.RECIPE_SCRAPER.RECIPE_ALLERGENS, recipeId, params],
    queryFn: () => allergensApi.getRecipeAllergens(recipeId, params),
    enabled: recipeId > 0,
  });
};
