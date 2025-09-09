import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stepsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  StepCommentResponse,
  AddStepCommentRequest,
  EditStepCommentRequest,
  DeleteStepCommentRequest,
} from '@/types/recipe-management';

/**
 * Hook to fetch recipe steps
 */
export const useRecipeSteps = (recipeId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_STEPS, recipeId],
    queryFn: () => stepsApi.getRecipeSteps(recipeId),
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch comments for a specific step
 */
export const useStepComments = (recipeId: number, stepId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS, recipeId, stepId],
    queryFn: () => stepsApi.getStepComments(recipeId, stepId),
    enabled: !!recipeId && !!stepId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a comment to a step
 */
export const useAddStepComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      stepId,
      data,
    }: {
      recipeId: number;
      stepId: number;
      data: AddStepCommentRequest;
    }) => stepsApi.addStepComment(recipeId, stepId, data),
    onSuccess: (newComment, variables) => {
      // Optimistically update the step comments cache
      queryClient.setQueryData<StepCommentResponse>(
        [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          variables.recipeId,
          variables.stepId,
        ],
        oldData => {
          if (oldData) {
            return {
              ...oldData,
              comments: [...(oldData.comments ?? []), newComment],
            };
          }
          return {
            stepId: variables.stepId,
            comments: [newComment],
          };
        }
      );

      // Invalidate step comments query to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          variables.recipeId,
          variables.stepId,
        ],
      });

      // Also invalidate the recipe steps query in case it includes comment counts
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
 * Hook to edit a step comment
 */
export const useEditStepComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      stepId,
      data,
    }: {
      recipeId: number;
      stepId: number;
      data: EditStepCommentRequest;
    }) => stepsApi.editStepComment(recipeId, stepId, data),
    onSuccess: (updatedComment, variables) => {
      // Optimistically update the step comments cache
      queryClient.setQueryData<StepCommentResponse>(
        [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          variables.recipeId,
          variables.stepId,
        ],
        oldData => {
          if (oldData?.comments) {
            return {
              ...oldData,
              comments: oldData.comments.map(comment =>
                comment.commentId === variables.data.commentId
                  ? updatedComment
                  : comment
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          variables.recipeId,
          variables.stepId,
        ],
      });
    },
  });
};

/**
 * Hook to delete a step comment
 */
export const useDeleteStepComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      stepId,
      data,
    }: {
      recipeId: number;
      stepId: number;
      data: DeleteStepCommentRequest;
    }) => stepsApi.deleteStepComment(recipeId, stepId, data),
    onSuccess: (_, variables) => {
      // Optimistically remove the comment from cache
      queryClient.setQueryData<StepCommentResponse>(
        [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          variables.recipeId,
          variables.stepId,
        ],
        oldData => {
          if (oldData?.comments) {
            return {
              ...oldData,
              comments: oldData.comments.filter(
                comment => comment.commentId !== variables.data.commentId
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          variables.recipeId,
          variables.stepId,
        ],
      });

      // Also invalidate the recipe steps query in case it includes comment counts
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
 * Helper hook to invalidate all step-related queries for a recipe
 * Useful when steps are modified outside of these hooks
 */
export const useInvalidateSteps = () => {
  const queryClient = useQueryClient();

  return (recipeId: number, stepId?: number) => {
    // Invalidate all recipe steps
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_STEPS, recipeId],
    });

    if (stepId) {
      // Invalidate specific step comments
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS,
          recipeId,
          stepId,
        ],
      });
    } else {
      // Invalidate all step comments for the recipe
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_COMMENTS, recipeId],
      });
    }
  };
};
