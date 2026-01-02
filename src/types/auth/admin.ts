/**
 * Admin API types for auth service
 * Includes session management, cache operations, and user admin functions
 */

// Session Statistics Types
export interface SessionTtlPolicyStats {
  policyName: string;
  configuredTtl: number;
  unit?: string;
  activeCount: number;
}

export interface TtlDistributionBucket {
  rangeStart: string;
  rangeEnd: string;
  sessionCount: number;
}

export interface TtlSummary {
  averageRemainingSeconds?: number;
  oldestSessionAgeSeconds?: number;
  totalSessionsWithTtl?: number;
}

export interface SessionTtlInfo {
  ttlPolicyUsage?: SessionTtlPolicyStats[];
  ttlDistribution?: TtlDistributionBucket[];
  ttlSummary?: TtlSummary;
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  memoryUsage: string;
  ttlInfo?: SessionTtlInfo;
}

export interface SessionStatsParams {
  includeTtlPolicy?: boolean;
  includeTtlDistribution?: boolean;
  includeTtlSummary?: boolean;
}

// Cache Management Types
export interface ClearSessionsResponse {
  success: boolean;
  message: string;
  sessionsCleared: number;
}

export interface ClearAllCachesResponse {
  success: boolean;
  message: string;
  cachesCleared: Record<string, number>;
  totalKeysCleared: number;
}

// Force Logout Types
export interface ForceLogoutResponse {
  success: boolean;
  message: string;
  userId: string;
}
