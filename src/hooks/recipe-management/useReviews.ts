import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  ReviewResponse,
  AddReviewRequest,
  EditReviewRequest,
} from '@/types/recipe-management';

/**
 * Hook to fetch recipe reviews
 */
export const useRecipeReviews = (recipeId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS, recipeId],
    queryFn: () => reviewsApi.getRecipeReviews(recipeId),
    enabled: !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes (reviews can change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a recipe review
 */
export const useAddRecipeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number;
      data: AddReviewRequest;
    }) => reviewsApi.addRecipeReview(recipeId, data),
    onSuccess: (newReview, variables) => {
      // Optimistically update the reviews cache
      queryClient.setQueryData<ReviewResponse>(
        [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS, variables.recipeId],
        oldData => {
          if (oldData) {
            return {
              ...oldData,
              reviews: [...(oldData.reviews ?? []), newReview],
              reviewCount: (oldData.reviewCount ?? 0) + 1,
            };
          }
          return {
            recipeId: variables.recipeId,
            reviews: [newReview],
            reviewCount: 1,
          };
        }
      );

      // Invalidate reviews to ensure server consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query as it might include review statistics
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list as it might include rating information
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });
    },
  });
};

/**
 * Hook to edit a recipe review
 */
export const useEditRecipeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      reviewId,
      data,
    }: {
      recipeId: number;
      reviewId: number;
      data: EditReviewRequest;
    }) => reviewsApi.editRecipeReview(recipeId, reviewId, data),
    onSuccess: (updatedReview, variables) => {
      // Optimistically update the reviews cache
      queryClient.setQueryData<ReviewResponse>(
        [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS, variables.recipeId],
        oldData => {
          if (oldData?.reviews) {
            const updatedReviews = oldData.reviews.map(review =>
              review.reviewId === variables.reviewId ? updatedReview : review
            );

            // Recalculate average rating
            const newAverageRating =
              updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
              updatedReviews.length;

            return {
              ...oldData,
              reviews: updatedReviews,
              averageRating: newAverageRating,
            };
          }
          return oldData;
        }
      );

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query as rating statistics might have changed
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list as rating information might have changed
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });
    },
  });
};

/**
 * Hook to delete a recipe review
 */
export const useDeleteRecipeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      reviewId,
    }: {
      recipeId: number;
      reviewId: number;
    }) => reviewsApi.deleteRecipeReview(recipeId, reviewId),
    onSuccess: (_, variables) => {
      // Optimistically remove the review from cache
      queryClient.setQueryData<ReviewResponse>(
        [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS, variables.recipeId],
        oldData => {
          if (oldData?.reviews) {
            const remainingReviews = oldData.reviews.filter(
              review => review.reviewId !== variables.reviewId
            );

            // Recalculate average rating
            const newAverageRating =
              remainingReviews.length > 0
                ? remainingReviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / remainingReviews.length
                : 0;

            return {
              ...oldData,
              reviews: remainingReviews,
              reviewCount: Math.max(0, (oldData.reviewCount ?? 0) - 1),
              averageRating: newAverageRating,
            };
          }
          return oldData;
        }
      );

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS,
          variables.recipeId,
        ],
      });

      // Invalidate the main recipe query as rating statistics changed
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipeId],
      });

      // Invalidate recipes list as rating information changed
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES,
      });
    },
  });
};

/**
 * Hook to manage multiple review operations for a recipe
 * Provides add, edit, and delete operations with loading states
 */
export const useRecipeReviewManager = (recipeId: number) => {
  const addReviewMutation = useAddRecipeReview();
  const editReviewMutation = useEditRecipeReview();
  const deleteReviewMutation = useDeleteRecipeReview();

  const addReview = (reviewData: AddReviewRequest) => {
    return addReviewMutation.mutateAsync({ recipeId, data: reviewData });
  };

  const editReview = (reviewId: number, reviewData: EditReviewRequest) => {
    return editReviewMutation.mutateAsync({
      recipeId,
      reviewId,
      data: reviewData,
    });
  };

  const deleteReview = (reviewId: number) => {
    return deleteReviewMutation.mutateAsync({ recipeId, reviewId });
  };

  const isLoading =
    addReviewMutation.isPending ??
    editReviewMutation.isPending ??
    deleteReviewMutation.isPending;

  const error =
    addReviewMutation.error ??
    editReviewMutation.error ??
    deleteReviewMutation.error;

  return {
    addReview,
    editReview,
    deleteReview,
    isLoading,
    error,
    isAddingReview: addReviewMutation.isPending,
    isEditingReview: editReviewMutation.isPending,
    isDeletingReview: deleteReviewMutation.isPending,
    addReviewError: addReviewMutation.error,
    editReviewError: editReviewMutation.error,
    deleteReviewError: deleteReviewMutation.error,
  };
};

/**
 * Helper hook to invalidate all review-related queries for a recipe
 * Useful when reviews are modified outside of these hooks
 */
export const useInvalidateReviews = () => {
  const queryClient = useQueryClient();

  return (recipeId: number) => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVIEWS, recipeId],
    });
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.REVIEWS, recipeId],
    });
  };
};
