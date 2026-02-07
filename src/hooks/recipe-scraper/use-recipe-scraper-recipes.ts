import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type {
  CreateRecipeRequest,
  CreateRecipeResponse,
  PopularRecipesResponse,
} from '@/types/recipe-scraper';

/**
 * Hook to create a new recipe from a URL
 * POST /api/recipe-scraper/recipes
 */
export const useCreateRecipeFromUrl = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateRecipeResponse, Error, CreateRecipeRequest>({
    mutationFn: (data: CreateRecipeRequest) => recipesApi.createRecipe(data),
    onSuccess: () => {
      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_SCRAPER.RECIPES,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_SCRAPER.POPULAR_RECIPES,
      });
    },
  });
};

/**
 * Hook to get popular recipes from the internet
 * GET /api/recipe-scraper/recipes/popular
 *
 * @param params.limit - Maximum number of recipes to return (default: 10, max: 100)
 * @param params.offset - Number of recipes to skip for pagination (default: 0)
 * @param params.countOnly - If true, return only the total count of recipes
 */
export const usePopularRecipes = (params?: {
  limit?: number;
  offset?: number;
  countOnly?: boolean;
}) => {
  return useQuery<PopularRecipesResponse>({
    queryKey: [...QUERY_KEYS.RECIPE_SCRAPER.POPULAR_RECIPES, params],
    queryFn: () => recipesApi.getPopularRecipes(params),
  });
};
