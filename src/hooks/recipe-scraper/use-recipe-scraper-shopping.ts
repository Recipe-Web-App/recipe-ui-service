import { useQuery } from '@tanstack/react-query';
import { shoppingApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type { RecipeShoppingInfoResponse } from '@/types/recipe-scraper';

/**
 * Hook to get comprehensive shopping information for all ingredients in a recipe
 * GET /api/recipe-scraper/recipes/{recipe_id}/shopping-info
 *
 * @param recipeId - The ID of the recipe (must be > 0)
 */
export const useRecipeShoppingInfo = (recipeId: number) => {
  return useQuery<RecipeShoppingInfoResponse>({
    queryKey: [...QUERY_KEYS.RECIPE_SCRAPER.RECIPE_SHOPPING, recipeId],
    queryFn: () => shoppingApi.getRecipeShoppingInfo(recipeId),
    enabled: recipeId > 0,
  });
};
