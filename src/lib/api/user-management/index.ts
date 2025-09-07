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

// Re-export types for convenience
export type {
  // Common types
  PaginationParams,
  PaginatedResponse,
  CountOnlyResponse,
  ErrorResponse,
  HealthStatus,

  // User management types
  User,
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserSearchResponse,
  UserAccountDeleteRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
  UserPreferences,

  // Social types
  FollowResponse,
  GetFollowedUsersResponse,
  UserActivityResponse,
  UserActivityParams,

  // Notification types
  Notification,
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,

  // Admin types
  RedisSessionStatsResponse,
  ClearSessionsResponse,
  UserStatsResponse,
  SystemHealthResponse,
  ForceLogoutResponse,

  // Metrics types
  PerformanceMetrics,
  CacheMetrics,
  CacheClearRequest,
  CacheClearResponse,
  SystemMetrics,
  DetailedHealthMetrics,

  // Health types
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  HealthHistoryResponse,
} from '@/types/user-management';
