// Base client and utilities
export {
  userManagementClient,
  UserManagementApiError,
  handleUserManagementApiError,
  createFormData,
  buildQueryParams,
} from './client';

// User management APIs
export * from './users';
export * from './social';
export * from './notifications';
export * from './admin';
export * from './metrics';
export * from './health';
export * from './preferences';

// Re-export types for convenience
export type {
  // Common types
  PaginationParams,
  PaginatedResponse,
  CountOnlyResponse,
  ErrorResponse,
  HealthStatus,
  PreferenceCategory,

  // User management types
  User,
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserSearchResponse,
  UserAccountDeleteRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,

  // Social types
  FollowResponse,
  GetFollowedUsersResponse,
  UserActivityResponse,
  UserActivityParams,

  // Notification types (kept for now per user request)
  Notification,
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,

  // Admin types - Updated per OpenAPI spec
  UserStatsResponse,
  CacheClearRequest,
  CacheClearResponse,

  // Metrics types
  PerformanceMetrics,
  CacheMetrics,
  SystemMetrics,
  DetailedHealthMetrics,

  // Health types - Updated per OpenAPI spec
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  ReadinessResponse,
  LivenessResponse,

  // Preferences types - New per OpenAPI spec
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
