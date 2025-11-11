import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api/recipe-management/favorites';
import { QUERY_KEYS } from '@/constants';
import type {
  FavoriteRecipesResponse,
  GetFavoriteRecipesParams,
} from '@/types/recipe-management/favorite';

// Safe query keys to prevent TypeScript unsafe member access warnings
const FAVORITES = QUERY_KEYS.RECIPE_MANAGEMENT.FAVORITES as readonly string[];
const USER_FAVORITES = QUERY_KEYS.RECIPE_MANAGEMENT
  .USER_FAVORITES as readonly string[];
const RECIPE_FAVORITE_STATUS = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_FAVORITE_STATUS as readonly string[];
const RECIPE = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE as readonly string[];
const RECIPES = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES as readonly string[];

/**
 * Hook to fetch favorite recipes for a user
 * @param params - Optional parameters including userId and pagination
 * @returns Query result with paginated favorite recipes
 */
export const useFavoriteRecipes = (params?: GetFavoriteRecipesParams) => {
  return useQuery({
    queryKey: params?.userId
      ? [...USER_FAVORITES, params.userId, params]
      : [...FAVORITES, params],
    queryFn: (): Promise<FavoriteRecipesResponse> => {
      return favoritesApi.getFavoriteRecipes(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (user-specific data that may change)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to check if a recipe is favorited by the authenticated user
 * @param recipeId - Recipe identifier
 * @returns Query result with boolean favorite status
 */
export const useIsRecipeFavorited = (recipeId: number) => {
  return useQuery({
    queryKey: [...RECIPE_FAVORITE_STATUS, recipeId],
    queryFn: (): Promise<boolean> => {
      return favoritesApi.isRecipeFavorited(recipeId);
    },
    enabled: !!recipeId,
    staleTime: 1 * 60 * 1000, // 1 minute (frequently checked)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a recipe to the authenticated user's favorites
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useFavoriteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => favoritesApi.favoriteRecipe(recipeId),
    onSuccess: (newFavorite, recipeId) => {
      // Set favorite status cache to true for instant UI feedback
      queryClient.setQueryData([...RECIPE_FAVORITE_STATUS, recipeId], true);

      // Invalidate all favorites queries to show the new favorite
      queryClient.invalidateQueries({
        queryKey: FAVORITES,
      });

      // Invalidate user-specific favorites
      queryClient.invalidateQueries({
        queryKey: USER_FAVORITES,
      });

      // Invalidate the specific recipe query (RecipeDto includes favorites array)
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, recipeId],
      });

      // Invalidate recipes list (may show favorite indicators)
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });
    },
  });
};

/**
 * Hook to remove a recipe from the authenticated user's favorites
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useUnfavoriteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => favoritesApi.unfavoriteRecipe(recipeId),
    onSuccess: (_, recipeId) => {
      // Set favorite status cache to false for instant UI feedback
      queryClient.setQueryData([...RECIPE_FAVORITE_STATUS, recipeId], false);

      // Invalidate all favorites queries to remove the unfavorited recipe
      queryClient.invalidateQueries({
        queryKey: FAVORITES,
      });

      // Invalidate user-specific favorites
      queryClient.invalidateQueries({
        queryKey: USER_FAVORITES,
      });

      // Invalidate the specific recipe query (RecipeDto includes favorites array)
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, recipeId],
      });

      // Invalidate recipes list (may show favorite indicators)
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });
    },
  });
};
