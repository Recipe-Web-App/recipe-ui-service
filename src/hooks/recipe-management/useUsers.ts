import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type { SearchRecipesResponse } from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

// Safe query key to prevent TypeScript unsafe member access warnings
const MY_RECIPES = QUERY_KEYS.RECIPE_MANAGEMENT.MY_RECIPES as readonly string[];

/**
 * Hook to fetch all recipes owned by the authenticated user
 */
export const useMyRecipes = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...MY_RECIPES, params],
    queryFn: (): Promise<SearchRecipesResponse> => {
      return usersApi.getMyRecipes(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
