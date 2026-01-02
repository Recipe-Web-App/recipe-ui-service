import { useMutation } from '@tanstack/react-query';
import { activityNotificationsApi } from '@/lib/api/notification';
import type {
  RecipeRatedRequest,
  RecipeFeaturedRequest,
  RecipeTrendingRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Activity Notifications Hooks
 *
 * React hooks for sending recipe activity and engagement notifications.
 * Used for ratings, featured recipes, and trending notifications.
 */

/**
 * Hook to notify recipe author when someone rates their recipe
 */
export const useNotifyRecipeRated = () => {
  return useMutation<BatchNotificationResponse, Error, RecipeRatedRequest>({
    mutationFn: data => activityNotificationsApi.notifyRecipeRated(data),
  });
};

/**
 * Hook to notify recipe author when their recipe is featured
 *
 * Typically triggered by admin/platform action.
 */
export const useNotifyRecipeFeatured = () => {
  return useMutation<BatchNotificationResponse, Error, RecipeFeaturedRequest>({
    mutationFn: data => activityNotificationsApi.notifyRecipeFeatured(data),
  });
};

/**
 * Hook to notify recipe author when their recipe is trending
 *
 * Typically triggered by platform analytics detecting trending content.
 */
export const useNotifyRecipeTrending = () => {
  return useMutation<BatchNotificationResponse, Error, RecipeTrendingRequest>({
    mutationFn: data => activityNotificationsApi.notifyRecipeTrending(data),
  });
};
