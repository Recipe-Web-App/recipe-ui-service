// User Profile Management Hooks
export {
  useUser,
  useCurrentUser,
  useSearchUsers,
  useSuggestedUsers,
  useUpdateCurrentUser,
  useRequestAccountDeletion,
  useConfirmAccountDeletion,
} from './useUser';

// Social Features Hooks
// Updated: Removed "me" hooks and useToggleFollowUser per OpenAPI spec
export {
  useFollowing,
  useFollowers,
  useFollowUser,
  useUnfollowUser,
  useIsFollowing,
  useMutualFollows,
  useFollowStats,
  useUserActivity,
} from './useSocial';

// Preferences Hooks - 9 category system per OpenAPI spec
export {
  useUserPreferences,
  useCurrentUserPreferences,
  useUpdateUserPreferences,
  usePreferenceCategory,
  useNotificationPreferences,
  useDisplayPreferences,
  usePrivacyPreferences,
  useAccessibilityPreferences,
  useLanguagePreferences,
  useSecurityPreferences,
  useSocialPreferences,
  useSoundPreferences,
  useThemePreferences,
  useUpdateNotificationPreferences,
  useUpdateDisplayPreferences,
  useUpdatePrivacyPreferences,
  useUpdateAccessibilityPreferences,
  useUpdateLanguagePreferences,
  useUpdateSecurityPreferences,
  useUpdateSocialPreferences,
  useUpdateSoundPreferences,
  useUpdateThemePreferences,
  useResetPreferenceCategory,
  useAllPreferencesFlat,
} from './usePreferences';

// Admin Operations Hooks
// Updated: Removed hooks for deleted endpoints, added useClearCache and useReadinessCheck
export {
  useUserStats,
  useClearCache,
  useHealthCheck,
  useReadinessCheck,
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
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  ReadinessResponse,
  LivenessResponse,
  PerformanceMetrics,
  UserStatsResponse,
  CacheClearRequest,
  CacheClearResponse,
  // New preference types
  PreferenceCategory,
  UserPreferencesResponse,
  UserPreferencesUpdateRequest,
  PreferenceCategoryResponse,
  NotificationPreferencesUpdate,
  DisplayPreferencesUpdate,
  PrivacyPreferencesUpdate,
  AccessibilityPreferencesUpdate,
  LanguagePreferencesUpdate,
  SecurityPreferencesUpdate,
  SocialPreferencesUpdate,
  SoundPreferencesUpdate,
  ThemePreferencesUpdate,
} from '@/types/user-management';
