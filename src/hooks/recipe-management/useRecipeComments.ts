import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeCommentsApi } from '@/lib/api/recipe-management/comments';
import { QUERY_KEYS } from '@/constants';
import type {
  RecipeCommentsResponse,
  AddRecipeCommentRequest,
  EditRecipeCommentRequest,
} from '@/types/recipe-management/comment';

// Safe query keys to prevent TypeScript unsafe member access warnings
const RECIPE_COMMENTS = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_COMMENTS as readonly string[];
const RECIPE = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE as readonly string[];

/**
 * Hook to fetch all comments for a recipe
 * @param recipeId - Recipe identifier
 * @returns Query result with comments data
 */
export const useRecipeComments = (recipeId: number) => {
  return useQuery({
    queryKey: [...RECIPE_COMMENTS, recipeId],
    queryFn: (): Promise<RecipeCommentsResponse> => {
      return recipeCommentsApi.getRecipeComments(recipeId);
    },
    enabled: !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes (frequently updated content)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a new comment to a recipe
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useAddRecipeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number;
      data: AddRecipeCommentRequest;
    }) => recipeCommentsApi.addRecipeComment(recipeId, data),
    onSuccess: (newComment, variables) => {
      // Update comments list cache optimistically
      queryClient.setQueryData<RecipeCommentsResponse>(
        [...RECIPE_COMMENTS, variables.recipeId],
        oldData => {
          if (oldData) {
            return {
              ...oldData,
              comments: [...oldData.comments, newComment],
            };
          }
          return {
            recipeId: variables.recipeId,
            comments: [newComment],
          };
        }
      );

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_COMMENTS, variables.recipeId],
      });

      // Invalidate recipe query (since RecipeDto can include comments)
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, variables.recipeId],
      });
    },
  });
};

/**
 * Hook to edit an existing recipe comment
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useEditRecipeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      commentId,
      data,
    }: {
      recipeId: number;
      commentId: number;
      data: EditRecipeCommentRequest;
    }) => recipeCommentsApi.editRecipeComment(recipeId, commentId, data),
    onSuccess: (updatedComment, variables) => {
      // Update the specific comment in the comments list cache
      queryClient.setQueryData<RecipeCommentsResponse>(
        [...RECIPE_COMMENTS, variables.recipeId],
        oldData => {
          if (oldData) {
            return {
              ...oldData,
              comments: oldData.comments.map(comment =>
                comment.commentId === variables.commentId
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
        queryKey: [...RECIPE_COMMENTS, variables.recipeId],
      });

      // Invalidate recipe query (since RecipeDto can include comments)
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, variables.recipeId],
      });
    },
  });
};

/**
 * Hook to delete a recipe comment
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useDeleteRecipeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      commentId,
    }: {
      recipeId: number;
      commentId: number;
    }) => recipeCommentsApi.deleteRecipeComment(recipeId, commentId),
    onSuccess: (_, variables) => {
      // Remove the comment from the comments list cache
      queryClient.setQueryData<RecipeCommentsResponse>(
        [...RECIPE_COMMENTS, variables.recipeId],
        oldData => {
          if (oldData) {
            return {
              ...oldData,
              comments: oldData.comments.filter(
                comment => comment.commentId !== variables.commentId
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_COMMENTS, variables.recipeId],
      });

      // Invalidate recipe query (since RecipeDto can include comments)
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, variables.recipeId],
      });
    },
  });
};
