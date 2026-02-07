import { useQuery } from '@tanstack/react-query';
import { ingredientsApi, shoppingApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type {
  RecommendedSubstitutionsResponse,
  IngredientShoppingInfoResponse,
  IngredientUnitEnum,
} from '@/types/recipe-scraper';

/**
 * Hook to get recommended substitutions for an ingredient
 * GET /api/recipe-scraper/ingredients/{ingredient_id}/substitutions
 *
 * @param ingredientId - The ID of the ingredient (must be > 0)
 * @param params.limit - Maximum number of substitutions to return (1-100, default: 50)
 * @param params.offset - Number of substitutions to skip for pagination (default: 0)
 * @param params.countOnly - If true, return only the total count (default: false)
 * @param params.amount - Quantity amount for conversion calculations
 * @param params.measurement - Measurement unit for quantity
 */
export const useIngredientSubstitutions = (
  ingredientId: number,
  params?: {
    limit?: number;
    offset?: number;
    countOnly?: boolean;
    amount?: number;
    measurement?: IngredientUnitEnum;
  }
) => {
  return useQuery<RecommendedSubstitutionsResponse>({
    queryKey: [
      ...QUERY_KEYS.RECIPE_SCRAPER.INGREDIENT_SUBSTITUTIONS,
      ingredientId,
      params,
    ],
    queryFn: () =>
      ingredientsApi.getRecommendedSubstitutions(ingredientId, params),
    enabled: ingredientId > 0,
  });
};

/**
 * Hook to get shopping information for a specific ingredient
 * GET /api/recipe-scraper/ingredients/{ingredient_id}/shopping-info
 *
 * @param ingredientId - The ID of the ingredient (must be > 0)
 * @param params.amount - Quantity amount for price calculation
 * @param params.measurement - Measurement unit for the quantity
 */
export const useIngredientShoppingInfo = (
  ingredientId: number,
  params?: {
    amount?: number;
    measurement?: IngredientUnitEnum;
  }
) => {
  return useQuery<IngredientShoppingInfoResponse>({
    queryKey: [
      ...QUERY_KEYS.RECIPE_SCRAPER.INGREDIENT_SHOPPING,
      ingredientId,
      params,
    ],
    queryFn: () => shoppingApi.getIngredientShoppingInfo(ingredientId, params),
    enabled: ingredientId > 0,
  });
};
