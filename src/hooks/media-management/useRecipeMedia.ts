/**
 * Recipe media integration hooks for media management
 * Handles media associations with recipes, ingredients, and steps
 */

import { useQuery } from '@tanstack/react-query';
import { mediaApi } from '@/lib/api/media-management';
import { QUERY_KEYS } from '@/constants';
import type { MediaId } from '@/types/media-management';

/**
 * Hook to get media IDs associated with a recipe
 * Maps to GET /media/recipe/{recipe_id} endpoint
 */
export const useRecipeMedia = (recipeId: number, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.RECIPE_MEDIA, recipeId],
    queryFn: () => mediaApi.getMediaByRecipe(recipeId),
    enabled,
  });
};

/**
 * Hook to get media IDs associated with a specific ingredient in a recipe
 * Maps to GET /media/recipe/{recipe_id}/ingredient/{ingredient_id} endpoint
 */
export const useIngredientMedia = (
  recipeId: number,
  ingredientId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.MEDIA_MANAGEMENT.INGREDIENT_MEDIA,
      recipeId,
      ingredientId,
    ],
    queryFn: () => mediaApi.getMediaByIngredient(recipeId, ingredientId),
    enabled,
  });
};

/**
 * Hook to get media IDs associated with a specific step in a recipe
 * Maps to GET /media/recipe/{recipe_id}/step/{step_id} endpoint
 */
export const useStepMedia = (
  recipeId: number,
  stepId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.STEP_MEDIA, recipeId, stepId],
    queryFn: () => mediaApi.getMediaByStep(recipeId, stepId),
    enabled,
  });
};

/**
 * Hook to get all media for a recipe (recipe + ingredients + steps)
 * Combines data from multiple endpoints
 */
export const useAllRecipeMedia = (recipeId: number, enabled = true) => {
  const recipeMediaQuery = useRecipeMedia(recipeId, enabled);

  return {
    ...recipeMediaQuery,
    recipeMedia: recipeMediaQuery.data,
    // Note: This hook only returns the main recipe media
    // Individual ingredient/step media should be fetched separately when needed
  };
};

/**
 * Utility hook for managing media associations
 * Provides common patterns for recipe media operations
 */
export const useRecipeMediaManager = () => {
  return {
    // Helper to generate query key for recipe media
    getRecipeMediaQueryKey: (recipeId: number) => [
      ...QUERY_KEYS.MEDIA_MANAGEMENT.RECIPE_MEDIA,
      recipeId,
    ],

    // Helper to generate query key for ingredient media
    getIngredientMediaQueryKey: (recipeId: number, ingredientId: number) => [
      ...QUERY_KEYS.MEDIA_MANAGEMENT.INGREDIENT_MEDIA,
      recipeId,
      ingredientId,
    ],

    // Helper to generate query key for step media
    getStepMediaQueryKey: (recipeId: number, stepId: number) => [
      ...QUERY_KEYS.MEDIA_MANAGEMENT.STEP_MEDIA,
      recipeId,
      stepId,
    ],

    // Helper to check if a media ID list is empty
    hasMedia: (mediaIds: MediaId[] | undefined) => {
      return Array.isArray(mediaIds) && mediaIds.length > 0;
    },
  };
};
