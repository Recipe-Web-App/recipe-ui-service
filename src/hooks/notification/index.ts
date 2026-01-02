/**
 * Notification Service Hooks
 *
 * React hooks for the notification service API.
 */

// User Notifications Hooks (inbox, read/unread, delete)
export {
  useMyNotifications,
  useAllNotifications,
  useUnreadNotifications,
  useUnreadNotificationCount,
  useHasNewNotifications,
  useUserNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteNotifications,
  useClearReadNotifications,
} from './useUserNotifications';

// Recipe Notifications Hooks
export {
  useNotifyRecipePublished,
  useNotifyRecipeLiked,
  useNotifyRecipeCommented,
} from './useRecipeNotifications';

// Social Notifications Hooks
export {
  useNotifyNewFollower,
  useNotifyMention,
  useShareRecipeNotification,
  useNotifyRecipeCollected,
} from './useSocialNotifications';

// Activity Notifications Hooks
export {
  useNotifyRecipeRated,
  useNotifyRecipeFeatured,
  useNotifyRecipeTrending,
} from './useActivityNotifications';

// System Notifications Hooks
export {
  useNotifyPasswordReset,
  useNotifyWelcome,
  useNotifyEmailChanged,
  useNotifyPasswordChanged,
  useNotifyMaintenance,
} from './useSystemNotifications';

// Notification Status Hooks
export {
  useNotificationStatus,
  useNotificationStatusOnce,
} from './useNotificationStatus';

// Admin Hooks
export {
  useNotificationStats,
  useRetryStatus,
  useNotificationTemplates,
  useRetryFailedNotifications,
  useRetryNotification,
  useAdminDeleteNotification,
} from './useNotificationAdmin';

// Health Hooks
export {
  useNotificationReadiness,
  useNotificationLiveness,
} from './useNotificationHealth';
