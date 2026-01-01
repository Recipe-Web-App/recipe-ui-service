import { userManagementClient, handleUserManagementApiError } from './client';
import type {
  UserStatsResponse,
  CacheClearRequest,
  CacheClearResponse,
} from '@/types/user-management';

/**
 * Administrative API functions - ALL REQUIRE 'admin' OAuth2 scope
 * These endpoints provide system administration capabilities.
 *
 * Note: Per OpenAPI spec update, the following endpoints were removed:
 * - GET /admin/redis/session-stats
 * - GET /admin/health
 * - DELETE /admin/users/{userId}/force-logout
 * - DELETE /admin/redis/sessions
 *
 * Cache clear was moved from /metrics/cache/clear to /admin/cache/clear
 */
export const adminApi = {
  /**
   * Get comprehensive user statistics
   * Provides analytics on user counts, activity levels, and growth metrics
   * Requires: admin scope
   */
  async getUserStats(): Promise<UserStatsResponse> {
    try {
      const response = await userManagementClient.get('/admin/users/stats');
      return response.data as UserStatsResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Clear cache by pattern
   * Selective cache clearing with optional pattern matching
   * Requires: admin scope
   * Moved from /metrics/cache/clear per OpenAPI spec
   */
  async clearCache(request?: CacheClearRequest): Promise<CacheClearResponse> {
    try {
      const response = await userManagementClient.post(
        '/admin/cache/clear',
        request ?? {}
      );
      return response.data as CacheClearResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Clear all cache entries
   * Nuclear cache clear operation
   * Requires: admin scope
   */
  async clearAllCache(): Promise<CacheClearResponse> {
    return this.clearCache({ keyPattern: '*' });
  },

  /**
   * Clear cache for specific entity types
   * Targeted cache clearing for specific data types
   * Requires: admin scope
   */
  async clearCacheByEntity(
    entityType: 'users' | 'notifications' | 'sessions'
  ): Promise<CacheClearResponse> {
    const patterns: Record<string, string> = {
      users: 'user:*',
      notifications: 'notification:*',
      sessions: 'session:*',
    };

    const pattern = Object.prototype.hasOwnProperty.call(patterns, entityType)
      ? // eslint-disable-next-line security/detect-object-injection
        patterns[entityType]
      : undefined;
    if (!pattern) {
      throw new Error(`Unknown entity type: ${entityType}`);
    }

    return this.clearCache({ keyPattern: pattern });
  },
};
