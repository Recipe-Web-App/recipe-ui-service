import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  AddIngredientCommentRequest,
  EditIngredientCommentRequest,
  DeleteIngredientCommentRequest,
} from '@/types/recipe-management';

interface ScaleIngredientsParams {
  quantity: number;
}

/**
 * Hook to fetch recipe ingredients
 */
export const useRecipeIngredients = (recipeId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS, recipeId],
    queryFn: () => ingredientsApi.getRecipeIngredients(recipeId),
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to scale recipe ingredients
 */
export const useScaleIngredients = (
  recipeId: number,
  params: ScaleIngredientsParams,
  enabled = true
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
      recipeId,
      'scale',
      params,
    ],
    queryFn: () => ingredientsApi.scaleIngredients(recipeId, params),
    enabled: enabled && !!recipeId && !!params.quantity,
    staleTime: 10 * 60 * 1000, // 10 minutes (scaling calculations don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to generate shopping list from recipe ingredients
 */
export const useShoppingList = (recipeId: number, enabled = true) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
      recipeId,
      'shopping-list',
    ],
    queryFn: () => ingredientsApi.generateShoppingList(recipeId),
    enabled: enabled && !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes (shopping lists may change based on inventory)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add comment to an ingredient
 */
export const useAddIngredientComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
      data,
    }: {
      recipeId: number;
      ingredientId: number;
      data: AddIngredientCommentRequest;
    }) => ingredientsApi.addIngredientComment(recipeId, ingredientId, data),
    onSuccess: (_, variables) => {
      // Invalidate ingredient-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
          variables.recipeId,
        ],
      });

      // Invalidate the specific ingredient comments if we have them cached
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.INGREDIENTS,
          variables.recipeId,
          variables.ingredientId,
          'comments',
        ],
      });
    },
  });
};

/**
 * Hook to edit an ingredient comment
 */
export const useEditIngredientComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
      data,
    }: {
      recipeId: number;
      ingredientId: number;
      data: EditIngredientCommentRequest;
    }) => ingredientsApi.editIngredientComment(recipeId, ingredientId, data),
    onSuccess: (_, variables) => {
      // Invalidate ingredient-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
          variables.recipeId,
        ],
      });

      // Invalidate the specific ingredient comments
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.INGREDIENTS,
          variables.recipeId,
          variables.ingredientId,
          'comments',
        ],
      });
    },
  });
};

/**
 * Hook to delete an ingredient comment
 */
export const useDeleteIngredientComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
      data,
    }: {
      recipeId: number;
      ingredientId: number;
      data: DeleteIngredientCommentRequest;
    }) => ingredientsApi.deleteIngredientComment(recipeId, ingredientId, data),
    onSuccess: (_, variables) => {
      // Invalidate ingredient-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
          variables.recipeId,
        ],
      });

      // Invalidate the specific ingredient comments
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.INGREDIENTS,
          variables.recipeId,
          variables.ingredientId,
          'comments',
        ],
      });
    },
  });
};

/**
 * Helper hook to invalidate all ingredient-related queries for a recipe
 * Useful when ingredients are modified outside of these hooks
 */
export const useInvalidateIngredients = () => {
  const queryClient = useQueryClient();

  return (recipeId: number) => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS, recipeId],
    });
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.INGREDIENTS, recipeId],
    });
  };
};
