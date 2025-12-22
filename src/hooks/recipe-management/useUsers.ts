import { useQuery } from '@tanstack/react-query';
import {
  usersApi,
  type MyCollectionsParams,
} from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  SearchRecipesResponse,
  PageCollectionDto,
} from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

// Safe query keys to prevent TypeScript unsafe member access warnings
const MY_RECIPES = QUERY_KEYS.RECIPE_MANAGEMENT.MY_RECIPES as readonly string[];
const MY_COLLECTIONS = QUERY_KEYS.RECIPE_MANAGEMENT
  .MY_COLLECTIONS as readonly string[];

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

/**
 * Hook to fetch all collections owned by the authenticated user
 *
 * @param params - Optional pagination and filter parameters
 * @param params.page - Page number (0-based)
 * @param params.size - Number of items per page
 * @param params.sort - Sort field and direction
 * @param params.includeCollaborations - Include collections where user is a collaborator
 * @returns Query result with user's collections
 *
 * @example
 * ```tsx
 * // Fetch only owned collections
 * const { data, isLoading } = useMyCollections({ page: 0, size: 12 });
 *
 * // Include collections where user is a collaborator
 * const { data } = useMyCollections({ includeCollaborations: true });
 * ```
 */
export const useMyCollections = (params?: MyCollectionsParams) => {
  return useQuery({
    queryKey: [...MY_COLLECTIONS, params],
    queryFn: (): Promise<PageCollectionDto> => {
      return usersApi.getMyCollections(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
