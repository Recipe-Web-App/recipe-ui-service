import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type { MediaUploadRequest } from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

/**
 * Hook to fetch recipe media
 */
export const useRecipeMedia = (
  recipeId: number,
  params?: Pick<PaginationParams, 'page' | 'size'>
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_MEDIA, recipeId, params],
    queryFn: () => mediaApi.getRecipeMedia(recipeId, params),
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch ingredient media
 */
export const useIngredientMedia = (
  recipeId: number,
  ingredientId: number,
  params?: Pick<PaginationParams, 'page' | 'size'>
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA,
      'ingredient',
      recipeId,
      ingredientId,
      params,
    ],
    queryFn: () => mediaApi.getIngredientMedia(recipeId, ingredientId, params),
    enabled: !!recipeId && !!ingredientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch step media
 */
export const useStepMedia = (
  recipeId: number,
  stepId: number,
  params?: Pick<PaginationParams, 'page' | 'size'>
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA,
      'step',
      recipeId,
      stepId,
      params,
    ],
    queryFn: () => mediaApi.getStepMedia(recipeId, stepId, params),
    enabled: !!recipeId && !!stepId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to upload recipe media
 */
export const useUploadRecipeMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number;
      data: MediaUploadRequest;
    }) => mediaApi.uploadRecipeMedia(recipeId, data),
    onSuccess: (response, variables) => {
      // Invalidate recipe media queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_MEDIA,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query as it might include media information
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list as it might include media preview information
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });
    },
  });
};

/**
 * Hook to upload ingredient media
 */
export const useUploadIngredientMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
      data,
    }: {
      recipeId: number;
      ingredientId: number;
      data: MediaUploadRequest;
    }) => mediaApi.uploadIngredientMedia(recipeId, ingredientId, data),
    onSuccess: (response, variables) => {
      // Invalidate ingredient media queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA,
          'ingredient',
          variables.recipeId,
          variables.ingredientId,
        ],
      });

      // Invalidate ingredient-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
          variables.recipeId,
        ],
      });
    },
  });
};

/**
 * Hook to upload step media
 */
export const useUploadStepMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      stepId,
      data,
    }: {
      recipeId: number;
      stepId: number;
      data: MediaUploadRequest;
    }) => mediaApi.uploadStepMedia(recipeId, stepId, data),
    onSuccess: (response, variables) => {
      // Invalidate step media queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA,
          'step',
          variables.recipeId,
          variables.stepId,
        ],
      });

      // Invalidate step-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_STEPS,
          variables.recipeId,
        ],
      });
    },
  });
};

/**
 * Hook to delete recipe media
 */
export const useDeleteRecipeMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      mediaId,
    }: {
      recipeId: number;
      mediaId: number;
    }) => mediaApi.deleteRecipeMedia(recipeId, mediaId),
    onSuccess: (response, variables) => {
      // Invalidate recipe media queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_MEDIA,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });
    },
  });
};

/**
 * Hook to delete ingredient media
 */
export const useDeleteIngredientMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      ingredientId,
      mediaId,
    }: {
      recipeId: number;
      ingredientId: number;
      mediaId: number;
    }) => mediaApi.deleteIngredientMedia(recipeId, ingredientId, mediaId),
    onSuccess: (response, variables) => {
      // Invalidate ingredient media queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA,
          'ingredient',
          variables.recipeId,
          variables.ingredientId,
        ],
      });

      // Invalidate ingredient-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_INGREDIENTS,
          variables.recipeId,
        ],
      });
    },
  });
};

/**
 * Hook to delete step media
 */
export const useDeleteStepMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      stepId,
      mediaId,
    }: {
      recipeId: number;
      stepId: number;
      mediaId: number;
    }) => mediaApi.deleteStepMedia(recipeId, stepId, mediaId),
    onSuccess: (response, variables) => {
      // Invalidate step media queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA,
          'step',
          variables.recipeId,
          variables.stepId,
        ],
      });

      // Invalidate step-related queries
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_STEPS,
          variables.recipeId,
        ],
      });
    },
  });
};

/**
 * Hook to manage all media operations for different components
 * Provides upload and delete operations with loading states
 */
export const useMediaManager = () => {
  const uploadRecipeMutation = useUploadRecipeMedia();
  const uploadIngredientMutation = useUploadIngredientMedia();
  const uploadStepMutation = useUploadStepMedia();
  const deleteRecipeMutation = useDeleteRecipeMedia();
  const deleteIngredientMutation = useDeleteIngredientMedia();
  const deleteStepMutation = useDeleteStepMedia();

  const uploadMedia = (
    type: 'recipe' | 'ingredient' | 'step',
    recipeId: number,
    data: MediaUploadRequest,
    componentId?: number
  ) => {
    switch (type) {
      case 'recipe':
        return uploadRecipeMutation.mutateAsync({ recipeId, data });
      case 'ingredient':
        if (!componentId) throw new Error('ingredientId is required');
        return uploadIngredientMutation.mutateAsync({
          recipeId,
          ingredientId: componentId,
          data,
        });
      case 'step':
        if (!componentId) throw new Error('stepId is required');
        return uploadStepMutation.mutateAsync({
          recipeId,
          stepId: componentId,
          data,
        });
      default:
        throw new Error(`Unsupported media type: ${type}`);
    }
  };

  const deleteMedia = (
    type: 'recipe' | 'ingredient' | 'step',
    recipeId: number,
    mediaId: number,
    componentId?: number
  ) => {
    switch (type) {
      case 'recipe':
        return deleteRecipeMutation.mutateAsync({ recipeId, mediaId });
      case 'ingredient':
        if (!componentId) throw new Error('ingredientId is required');
        return deleteIngredientMutation.mutateAsync({
          recipeId,
          ingredientId: componentId,
          mediaId,
        });
      case 'step':
        if (!componentId) throw new Error('stepId is required');
        return deleteStepMutation.mutateAsync({
          recipeId,
          stepId: componentId,
          mediaId,
        });
      default:
        throw new Error(`Unsupported media type: ${type}`);
    }
  };

  const isUploading =
    uploadRecipeMutation.isPending ??
    uploadIngredientMutation.isPending ??
    uploadStepMutation.isPending;

  const isDeleting =
    deleteRecipeMutation.isPending ??
    deleteIngredientMutation.isPending ??
    deleteStepMutation.isPending;

  const error =
    uploadRecipeMutation.error ??
    uploadIngredientMutation.error ??
    uploadStepMutation.error ??
    deleteRecipeMutation.error ??
    deleteIngredientMutation.error ??
    deleteStepMutation.error;

  return {
    uploadMedia,
    deleteMedia,
    isUploading,
    isDeleting,
    isLoading: isUploading || isDeleting,
    error,
  };
};

/**
 * Helper hook to invalidate all media-related queries for a recipe
 */
export const useInvalidateMedia = () => {
  const queryClient = useQueryClient();

  return (recipeId: number) => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_MEDIA, recipeId],
    });
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA, 'ingredient', recipeId],
    });
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.MEDIA, 'step', recipeId],
    });
  };
};
