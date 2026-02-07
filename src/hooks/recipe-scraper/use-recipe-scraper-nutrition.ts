import { useQuery } from '@tanstack/react-query';
import { nutritionApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type {
  RecipeNutritionalInfoResponse,
  IngredientNutritionalInfoResponse,
  IngredientUnitEnum,
} from '@/types/recipe-scraper';

/**
 * Hook to get nutritional information for a recipe
 * GET /api/recipe-scraper/recipes/{recipe_id}/nutritional-info
 *
 * @param recipeId - The ID of the recipe (must be > 0)
 * @param params.includeTotal - Include total nutritional info for the recipe (default: true)
 * @param params.includeIngredients - Include nutritional info for each ingredient (default: false)
 */
export const useRecipeNutritionalInfo = (
  recipeId: number,
  params?: {
    includeTotal?: boolean;
    includeIngredients?: boolean;
  }
) => {
  return useQuery<RecipeNutritionalInfoResponse>({
    queryKey: [...QUERY_KEYS.RECIPE_SCRAPER.RECIPE_NUTRITION, recipeId, params],
    queryFn: () => nutritionApi.getRecipeNutritionalInfo(recipeId, params),
    enabled: recipeId > 0,
  });
};

/**
 * Hook to get nutritional information for a specific ingredient
 * GET /api/recipe-scraper/ingredients/{ingredient_id}/nutritional-info
 *
 * @param ingredientId - The ID of the ingredient (must be > 0)
 * @param params.amount - Quantity amount for the ingredient
 * @param params.measurement - Measurement unit for the quantity
 */
export const useIngredientNutritionalInfo = (
  ingredientId: number,
  params?: {
    amount?: number;
    measurement?: IngredientUnitEnum;
  }
) => {
  return useQuery<IngredientNutritionalInfoResponse>({
    queryKey: [
      ...QUERY_KEYS.RECIPE_SCRAPER.INGREDIENT_NUTRITION,
      ingredientId,
      params,
    ],
    queryFn: () =>
      nutritionApi.getIngredientNutritionalInfo(ingredientId, params),
    enabled: ingredientId > 0,
  });
};
