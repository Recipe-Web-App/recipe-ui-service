import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  AddTagRequest,
  RemoveTagRequest,
} from '@/types/recipe-management';

/**
 * Hook to fetch recipe tags
 */
export const useRecipeTags = (recipeId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_TAGS, recipeId],
    queryFn: () => tagsApi.getRecipeTags(recipeId),
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a tag to a recipe
 */
export const useAddTagToRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number;
      data: AddTagRequest;
    }) => tagsApi.addTagToRecipe(recipeId, data),
    onSuccess: (response, variables) => {
      // Update the recipe tags cache with the new response
      queryClient.setQueryData(
        [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_TAGS, variables.recipeId],
        response
      );

      // Invalidate recipe tags to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_TAGS,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query as it might include tag information
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list as it might include tag counts or filters
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });

      // Invalidate search results as tag changes might affect search
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH,
      });
    },
  });
};

/**
 * Hook to remove a tag from a recipe
 */
export const useRemoveTagFromRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number;
      data: RemoveTagRequest;
    }) => tagsApi.removeTagFromRecipe(recipeId, data),
    onSuccess: (response, variables) => {
      // Update the recipe tags cache with the new response
      queryClient.setQueryData(
        [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_TAGS, variables.recipeId],
        response
      );

      // Invalidate recipe tags to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_TAGS,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query as it might include tag information
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list as it might include tag counts or filters
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });

      // Invalidate search results as tag changes might affect search
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH,
      });
    },
  });
};

/**
 * Hook to manage multiple tags for a recipe
 * Provides both add and remove operations with optimistic updates
 */
export const useRecipeTagManager = (recipeId: number) => {
  const addTagMutation = useAddTagToRecipe();
  const removeTagMutation = useRemoveTagFromRecipe();

  const addTag = (tagData: AddTagRequest) => {
    return addTagMutation.mutateAsync({ recipeId, data: tagData });
  };

  const removeTag = (tagData: RemoveTagRequest) => {
    return removeTagMutation.mutateAsync({ recipeId, data: tagData });
  };

  const isLoading = addTagMutation.isPending || removeTagMutation.isPending;
  const error = addTagMutation.error ?? removeTagMutation.error;

  return {
    addTag,
    removeTag,
    isLoading,
    error,
    isAddingTag: addTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
    addTagError: addTagMutation.error,
    removeTagError: removeTagMutation.error,
  };
};

/**
 * Helper hook to invalidate all tag-related queries for a recipe
 * Useful when tags are modified outside of these hooks
 */
export const useInvalidateTags = () => {
  const queryClient = useQueryClient();

  return (recipeId: number) => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_TAGS, recipeId],
    });
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.TAGS, recipeId],
    });
  };
};
