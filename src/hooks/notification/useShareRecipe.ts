import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shareApi } from '@/lib/api/notification';
import { QUERY_KEYS } from '@/constants';
import type {
  ShareRecipeRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Hook to share a recipe with users
 *
 * Sends dual notifications:
 * 1. To recipients: Share notification with recipe preview
 * 2. To recipe author: Notification that their recipe was shared
 *
 * Returns 202 Accepted - notifications are queued for async processing
 */
export const useShareRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation<BatchNotificationResponse, Error, ShareRecipeRequest>({
    mutationFn: (data: ShareRecipeRequest) => shareApi.shareRecipe(data),
    onSuccess: (response, variables) => {
      // Invalidate recipe queries to potentially refresh share counts
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, variables.recipe_id],
      });

      // Invalidate user activity if tracking shares
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.ACTIVITY],
      });
    },
  });
};
