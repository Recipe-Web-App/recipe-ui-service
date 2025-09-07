import type { HealthStatus } from './common';

// Redis Session Management
export interface RedisSessionStatsResponse {
  total_sessions?: number;
  active_sessions?: number;
  memory_usage?: string;
  ttl_info?: Record<string, unknown>;
}

export interface ClearSessionsResponse {
  success?: boolean;
  message?: string;
  sessions_cleared?: number;
}

// User Statistics
export interface UserStatsResponse {
  total_users?: number;
  active_users?: number;
  inactive_users?: number;
  new_users_today?: number;
  new_users_this_week?: number;
  new_users_this_month?: number;
}

// System Health
export interface SystemHealthResponse {
  status?: HealthStatus;
  database_status?: 'healthy' | 'unhealthy';
  redis_status?: 'healthy' | 'unhealthy';
  uptime_seconds?: number;
  version?: string;
}

// Force Logout
export interface ForceLogoutResponse {
  success?: boolean;
  message?: string;
  sessions_cleared?: number;
}
