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
  // New preference enums per OpenAPI spec
  FontSizeEnum,
  ColorSchemeEnum,
  LayoutDensityEnum,
  ProfileVisibilityEnum,
  LanguageEnum,
  ThemeEnum,
  PreferenceCategory,
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

// Notifications - User Communication (kept for now per user request)
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
// Updated: Removed types for deleted endpoints per OpenAPI spec
export type {
  UserStatsResponse,
  CacheClearRequest,
  CacheClearResponse,
} from './admin';

// Metrics & Monitoring - Performance & System Health
export type {
  PerformanceMetrics,
  CacheMetrics,
  SystemMetrics,
  DetailedHealthMetrics,
} from './metrics';

// Health Monitoring - Service Status & Diagnostics
// Updated: Added ReadinessResponse, LivenessResponse per OpenAPI spec
export type {
  HealthCheckResponse,
  ServiceStatus,
  DatabaseHealth,
  RedisHealth,
  ComprehensiveHealthResponse,
  ReadinessResponse,
  LivenessResponse,
} from './health';

// Preferences - New 9-category preference system per OpenAPI spec
export type {
  // Base preference types (NEW schema with camelCase properties)
  NotificationPreferences,
  DisplayPreferences,
  PrivacyPreferences,
  AccessibilityPreferences,
  LanguagePreferences,
  SecurityPreferences,
  SocialPreferences,
  SoundPreferences,
  ThemePreferences,
  // Response and Update types
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
} from './preferences';
