import { useMutation } from '@tanstack/react-query';
import { recipeNotificationsApi } from '@/lib/api/notification';
import type {
  RecipePublishedRequest,
  RecipeLikedRequest,
  RecipeCommentedRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Recipe Notifications Hooks
 *
 * React hooks for sending recipe-related notifications.
 * Used to notify users about recipe publishing, likes, and comments.
 */

/**
 * Hook to notify followers when a recipe is published
 *
 * Sends notifications to all followers of the recipe author.
 */
export const useNotifyRecipePublished = () => {
  return useMutation<BatchNotificationResponse, Error, RecipePublishedRequest>({
    mutationFn: data => recipeNotificationsApi.notifyRecipePublished(data),
  });
};

/**
 * Hook to notify recipe author when someone likes their recipe
 */
export const useNotifyRecipeLiked = () => {
  return useMutation<BatchNotificationResponse, Error, RecipeLikedRequest>({
    mutationFn: data => recipeNotificationsApi.notifyRecipeLiked(data),
  });
};

/**
 * Hook to notify recipe author when someone comments on their recipe
 */
export const useNotifyRecipeCommented = () => {
  return useMutation<BatchNotificationResponse, Error, RecipeCommentedRequest>({
    mutationFn: data => recipeNotificationsApi.notifyRecipeCommented(data),
  });
};
