// User Statistics - aligned with OpenAPI spec (camelCase)
export interface UserStatsResponse {
  totalUsers?: number;
  activeUsers?: number;
  inactiveUsers?: number;
  newUsersToday?: number;
  newUsersThisWeek?: number;
  newUsersThisMonth?: number;
}

// Cache Clear Request/Response - moved from metrics to admin
export interface CacheClearRequest {
  keyPattern?: string;
}

export interface CacheClearResponse {
  message?: string;
  pattern?: string;
  clearedCount?: number;
}
