import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  favoritesApi,
  type ListFavoriteMealPlansParams,
} from '@/lib/api/meal-plan-management';
import { QUERY_KEYS } from '@/constants';
import type {
  MealPlanFavoriteApiResponse,
  MealPlanFavoriteCheckApiResponse,
} from '@/types/meal-plan-management';

// Safe query keys to prevent TypeScript unsafe member access warnings
const FAVORITES = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .FAVORITES as readonly string[];
const FAVORITE = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.FAVORITE as readonly string[];

/**
 * Hook to fetch the authenticated user's favorite meal plans
 */
export const useFavoriteMealPlans = (params?: ListFavoriteMealPlansParams) => {
  return useQuery({
    queryKey: [...FAVORITES, params],
    queryFn: () => favoritesApi.listFavoriteMealPlans(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to check if a meal plan is favorited by the authenticated user
 */
export const useMealPlanFavoriteStatus = (
  mealPlanId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...FAVORITE, mealPlanId],
    queryFn: () => favoritesApi.checkMealPlanFavorite(mealPlanId),
    enabled: enabled && !!mealPlanId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to add a meal plan to the authenticated user's favorites
 */
export const useAddMealPlanToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mealPlanId: string) =>
      favoritesApi.addMealPlanToFavorites(mealPlanId),
    onSuccess: (response: MealPlanFavoriteApiResponse, mealPlanId) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: FAVORITES });

      // Update the favorite status cache
      queryClient.setQueryData([...FAVORITE, mealPlanId], {
        success: true,
        data: {
          isFavorited: true,
          favoritedAt: response.data.favoritedAt,
        },
      } as MealPlanFavoriteCheckApiResponse);
    },
  });
};

/**
 * Hook to remove a meal plan from the authenticated user's favorites
 */
export const useRemoveMealPlanFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mealPlanId: string) =>
      favoritesApi.removeMealPlanFromFavorites(mealPlanId),
    onSuccess: (_, mealPlanId) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: FAVORITES });

      // Update the favorite status cache
      queryClient.setQueryData([...FAVORITE, mealPlanId], {
        success: true,
        data: {
          isFavorited: false,
          favoritedAt: null,
        },
      } as MealPlanFavoriteCheckApiResponse);
    },
  });
};

/**
 * Hook to toggle a meal plan's favorite status
 * Provides a convenient way to add/remove favorites without tracking state
 */
export const useToggleMealPlanFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealPlanId,
      isFavorited,
    }: {
      mealPlanId: string;
      isFavorited: boolean;
    }) => {
      if (isFavorited) {
        await favoritesApi.removeMealPlanFromFavorites(mealPlanId);
      } else {
        await favoritesApi.addMealPlanToFavorites(mealPlanId);
      }
    },
    onSuccess: (_, { mealPlanId, isFavorited }) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: FAVORITES });

      // Update the favorite status cache
      queryClient.setQueryData([...FAVORITE, mealPlanId], {
        success: true,
        data: {
          isFavorited: !isFavorited,
          favoritedAt: isFavorited ? null : new Date().toISOString(),
        },
      } as MealPlanFavoriteCheckApiResponse);
    },
  });
};

/**
 * Hook to invalidate favorite queries
 * Useful for manual cache invalidation
 */
export const useInvalidateFavorites = () => {
  const queryClient = useQueryClient();

  return {
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: FAVORITES }),
    invalidateStatus: (mealPlanId: string) =>
      queryClient.invalidateQueries({ queryKey: [...FAVORITE, mealPlanId] }),
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES });
      queryClient.invalidateQueries({ queryKey: FAVORITE });
    },
  };
};
