// User Profile Management Hooks
export {
  useUser,
  useCurrentUser,
  useSearchUsers,
  useUpdateCurrentUser,
  useRequestAccountDeletion,
  useConfirmAccountDeletion,
} from './useUser';

// Social Features Hooks
export {
  useFollowing,
  useFollowers,
  useCurrentUserFollowing,
  useCurrentUserFollowers,
  useFollowUser,
  useUnfollowUser,
  useToggleFollowUser,
  useIsFollowing,
  useMutualFollows,
  useFollowStats,
  useUserActivity,
  useCurrentUserActivity,
} from './useSocial';

// Notification Management Hooks
export {
  useNotifications,
  useAllNotifications,
  useUnreadNotifications,
  useReadNotifications,
  useNotificationsByType,
  useUnreadNotificationCount,
  useHasNewNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteNotifications,
  useClearReadNotifications,
} from './useNotifications';

// User Preferences Hooks
export {
  useUserPreferences,
  useNotificationPreferences,
  useDisplayPreferences,
  usePrivacyPreferences,
  useUpdateUserPreferences,
  useUpdateNotificationPreferences,
  useToggleNotificationSetting,
  useUpdateDisplayPreferences,
  useUpdatePrivacyPreferences,
} from './useUserPreferences';

// Admin Operations Hooks
export {
  useUserStats,
  useForceLogout,
  useBatchForceLogout,
  useHealthCheck,
  useComprehensiveHealth,
  usePerformanceMetrics,
  useHealthMonitor,
  useHealthSummary,
} from './useAdmin';

// Type exports for convenience
export type {
  User,
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserSearchResponse,
  PaginationParams,
  GetFollowedUsersResponse,
  FollowResponse,
  UserActivityResponse,
  UserActivityParams,
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteResponse,
  UserPreferences,
  NotificationPreferences,
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  PerformanceMetrics,
  UserStatsResponse,
} from '@/types/user-management';
