// Common types shared across user management service

export interface PaginationParams {
  limit?: number;
  offset?: number;
  count_only?: boolean;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  results: T[];
  totalCount: number;
  limit: number;
  offset: number;
}

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
  error_code: string;
  required_scopes: string[];
  available_scopes: string[];
}

export interface SuccessResponse {
  message: string;
}

export interface HealthCheck {
  healthy: boolean;
  message: string;
}

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export type ReadinessStatus = 'ready' | 'degraded' | 'not_ready';
export type ProfileVisibility = 'public' | 'followers_only' | 'private';
export type Theme = 'light' | 'dark' | 'auto';
