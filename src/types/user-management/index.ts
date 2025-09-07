// Common Types - Foundation
export type {
  PaginationParams,
  PaginatedResponse,
  CountOnlyResponse,
  ErrorResponse,
  OAuth2ScopeError,
  SuccessResponse,
  HealthCheck,
  HealthStatus,
  ReadinessStatus,
  ProfileVisibility,
  Theme,
} from './common';

// User Management - Core User Types
export type {
  User,
  UserSearchResult,
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserSearchResponse,
  UserAccountDeleteRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
  UserPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  DisplayPreferences,
  UserPreferenceResponse,
  UpdateUserPreferenceRequest,
} from './user';

// Social Features - Following System & Activity
export type {
  FollowResponse,
  GetFollowedUsersResponse,
  RecipeSummary,
  UserSummary,
  ReviewSummary,
  FavoriteSummary,
  UserActivityResponse,
  UserActivityParams,
} from './social';

// Notifications - User Communication
export type {
  Notification,
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
} from './notifications';

// Admin Operations - Management & Statistics
export type {
  RedisSessionStatsResponse,
  ClearSessionsResponse,
  UserStatsResponse,
  SystemHealthResponse,
  ForceLogoutResponse,
} from './admin';

// Metrics & Monitoring - Performance & System Health
export type {
  PerformanceMetrics,
  CacheMetrics,
  CacheClearRequest,
  CacheClearResponse,
  SystemMetrics,
  DetailedHealthMetrics,
} from './metrics';

// Health Monitoring - Service Status & Diagnostics
export type {
  HealthCheckResponse,
  ServiceStatus,
  DatabaseHealth,
  RedisHealth,
  ExternalServiceHealth,
  ComprehensiveHealthResponse,
  HealthHistoryEntry,
  HealthHistoryResponse,
} from './health';
