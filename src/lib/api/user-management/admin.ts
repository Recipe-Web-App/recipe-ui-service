import {
  userManagementClient,
  handleUserManagementApiError,
  buildQueryParams,
} from './client';
import type {
  RedisSessionStatsResponse,
  ClearSessionsResponse,
  UserStatsResponse,
  SystemHealthResponse,
  ForceLogoutResponse,
} from '@/types/user-management';

/**
 * Administrative API functions - ALL REQUIRE 'admin' OAuth2 scope
 * These endpoints provide system administration capabilities including
 * user management, session control, and system monitoring.
 */
export const adminApi = {
  /**
   * Get Redis session statistics
   * Provides insights into active sessions, memory usage, and TTL info
   * Requires: admin scope
   */
  async getRedisSessionStats(): Promise<RedisSessionStatsResponse> {
    try {
      const response = await userManagementClient.get(
        '/admin/redis/session-stats'
      );
      return response.data as RedisSessionStatsResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

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
   * Get system health status
   * Provides overall system health including database and Redis status
   * Requires: admin scope
   */
  async getSystemHealth(): Promise<SystemHealthResponse> {
    try {
      const response = await userManagementClient.get('/admin/health');
      return response.data as SystemHealthResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Force logout a specific user
   * Terminates all active sessions for the specified user
   * Requires: admin scope
   */
  async forceUserLogout(userId: string): Promise<ForceLogoutResponse> {
    try {
      const response = await userManagementClient.delete(
        `/admin/users/${userId}/force-logout`
      );
      return response.data as ForceLogoutResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Clear Redis sessions
   * Mass session cleanup operation with optional pattern filtering
   * Requires: admin scope
   */
  async clearRedisSession(params?: {
    pattern?: string; // Optional pattern to filter sessions (e.g., 'user:*')
    confirm?: boolean; // Safety confirmation parameter
  }): Promise<ClearSessionsResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/admin/redis/sessions?${queryString}`
        : '/admin/redis/sessions';

      const response = await userManagementClient.delete(url);
      return response.data as ClearSessionsResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Clear all Redis sessions
   * Nuclear option - clears ALL user sessions
   * Requires: admin scope + explicit confirmation
   */
  async clearAllSessions(): Promise<ClearSessionsResponse> {
    return this.clearRedisSession({
      pattern: '*',
      confirm: true,
    });
  },

  /**
   * Clear sessions for a specific user
   * More targeted session clearing for individual users
   * Requires: admin scope
   */
  async clearUserSessions(userId: string): Promise<ClearSessionsResponse> {
    return this.clearRedisSession({
      pattern: `user:${userId}:*`,
    });
  },

  /**
   * Get user activity summary for admin dashboard
   * Enhanced user statistics with administrative insights
   * Requires: admin scope
   */
  async getUserActivitySummary(): Promise<{
    userStats: UserStatsResponse;
    sessionStats: RedisSessionStatsResponse;
    systemHealth: SystemHealthResponse;
  }> {
    try {
      // Fetch all administrative data in parallel
      const [userStats, sessionStats, systemHealth] = await Promise.all([
        this.getUserStats(),
        this.getRedisSessionStats(),
        this.getSystemHealth(),
      ]);

      return {
        userStats,
        sessionStats,
        systemHealth,
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Perform user account administrative actions
   * Helper method for common user management tasks
   * Requires: admin scope
   */
  async performUserAction(
    userId: string,
    action: 'force_logout' | 'clear_sessions'
  ): Promise<ForceLogoutResponse | ClearSessionsResponse> {
    switch (action) {
      case 'force_logout':
        return this.forceUserLogout(userId);
      case 'clear_sessions':
        return this.clearUserSessions(userId);
      default:
        throw new Error(`Unknown user action: ${action}`);
    }
  },

  /**
   * Get system status dashboard data
   * Comprehensive system overview for admin dashboard
   * Requires: admin scope
   */
  async getSystemDashboard(): Promise<{
    health: SystemHealthResponse;
    userStats: UserStatsResponse;
    sessionStats: RedisSessionStatsResponse;
    timestamp: string;
  }> {
    try {
      const [health, userStats, sessionStats] = await Promise.all([
        this.getSystemHealth(),
        this.getUserStats(),
        this.getRedisSessionStats(),
      ]);

      return {
        health,
        userStats,
        sessionStats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Emergency session clearing with safety checks
   * High-impact operation with multiple confirmation steps
   * Requires: admin scope
   */
  async emergencySessionClear(params: {
    pattern: string;
    reason: string;
    confirmToken: string; // Additional security token
  }): Promise<ClearSessionsResponse> {
    try {
      // Add safety parameters to the request
      const response = await userManagementClient.delete(
        '/admin/redis/sessions',
        {
          data: {
            pattern: params.pattern,
            reason: params.reason,
            confirm_token: params.confirmToken,
            emergency: true,
          },
        }
      );
      return response.data as ClearSessionsResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Batch force logout multiple users
   * Mass user session termination
   * Requires: admin scope
   */
  async batchForceLogout(userIds: string[]): Promise<{
    successful: string[];
    failed: { userId: string; error: string }[];
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  }> {
    const results = await Promise.allSettled(
      userIds.map(userId =>
        this.forceUserLogout(userId).then(() => ({ userId, success: true }))
      )
    );

    const successful: string[] = [];
    const failed: { userId: string; error: string }[] = [];

    results.forEach((result, index) => {
      // eslint-disable-next-line security/detect-object-injection
      const userId = userIds[index];
      if (result.status === 'fulfilled') {
        successful.push(userId);
      } else {
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason) || 'Unknown error';
        failed.push({
          userId: String(userId), // Ensure userId is a string to avoid object injection
          error: errorMessage,
        });
      }
    });

    return {
      successful,
      failed,
      summary: {
        total: userIds.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  },
};
