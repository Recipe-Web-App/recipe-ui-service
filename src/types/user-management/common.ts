// Common types shared across user management service

export interface PaginationParams {
  limit?: number;
  offset?: number;
  countOnly?: boolean;
  [key: string]: unknown;
}

export type PaginatedResponse<T, K extends string = 'results'> = {
  totalCount: number;
  limit?: number;
  offset?: number;
} & {
  [P in K]?: T[];
};

export interface CountOnlyResponse {
  totalCount: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface OAuth2ScopeError {
  detail: string;
  errorCode: string;
  requiredScopes: string[];
  availableScopes: string[];
}

export interface SuccessResponse {
  message: string;
}

export interface HealthCheck {
  healthy: boolean;
  message: string;
}

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export type ReadinessStatus = 'READY' | 'DEGRADED' | 'NOT_READY';

// New UPPERCASE enum types per OpenAPI spec
export type ProfileVisibilityEnum = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
export type ThemeEnum = 'LIGHT' | 'DARK' | 'AUTO' | 'CUSTOM';

// Backward compatibility aliases (lowercase values - legacy)
export type ProfileVisibility = 'public' | 'followers_only' | 'private';
export type Theme = 'light' | 'dark' | 'system';

// New preference enums from OpenAPI spec
export type FontSizeEnum = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
export type ColorSchemeEnum = 'LIGHT' | 'DARK' | 'AUTO' | 'HIGH_CONTRAST';
export type LayoutDensityEnum = 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';
export type LanguageEnum =
  | 'EN'
  | 'ES'
  | 'FR'
  | 'DE'
  | 'IT'
  | 'PT'
  | 'ZH'
  | 'JA'
  | 'KO'
  | 'RU';

// Preference category type for path parameters
export type PreferenceCategory =
  | 'notification'
  | 'display'
  | 'privacy'
  | 'accessibility'
  | 'language'
  | 'security'
  | 'social'
  | 'sound'
  | 'theme';
