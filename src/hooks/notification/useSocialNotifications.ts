import { useMutation } from '@tanstack/react-query';
import { socialNotificationsApi } from '@/lib/api/notification';
import type {
  NewFollowerRequest,
  MentionRequest,
  ShareRecipeRequest,
  RecipeCollectedRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Social Notifications Hooks
 *
 * React hooks for sending social interaction notifications.
 * Used for followers, mentions, shares, and collection updates.
 */

/**
 * Hook to notify user when someone follows them
 */
export const useNotifyNewFollower = () => {
  return useMutation<BatchNotificationResponse, Error, NewFollowerRequest>({
    mutationFn: data => socialNotificationsApi.notifyNewFollower(data),
  });
};

/**
 * Hook to notify users when mentioned in a comment
 */
export const useNotifyMention = () => {
  return useMutation<BatchNotificationResponse, Error, MentionRequest>({
    mutationFn: data => socialNotificationsApi.notifyMention(data),
  });
};

/**
 * Hook to share a recipe with users
 *
 * Sends dual notifications:
 * 1. To recipients - Share notification with recipe preview
 * 2. To recipe author - Notification that their recipe was shared
 */
export const useShareRecipeNotification = () => {
  return useMutation<BatchNotificationResponse, Error, ShareRecipeRequest>({
    mutationFn: data => socialNotificationsApi.shareRecipe(data),
  });
};

/**
 * Hook to notify recipe author when their recipe is added to a collection
 */
export const useNotifyRecipeCollected = () => {
  return useMutation<BatchNotificationResponse, Error, RecipeCollectedRequest>({
    mutationFn: data => socialNotificationsApi.notifyRecipeCollected(data),
  });
};
