import { adminApi } from '@/lib/api/user-management/admin';
import {
  userManagementClient,
  buildQueryParams,
} from '@/lib/api/user-management/client';
import type {
  RedisSessionStatsResponse,
  ClearSessionsResponse,
  UserStatsResponse,
  SystemHealthResponse,
  ForceLogoutResponse,
} from '@/types/user-management';

// Mock the client module
jest.mock('@/lib/api/user-management/client', () => ({
  userManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleUserManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/user-management/client')
    .buildQueryParams,
}));

const mockClient = userManagementClient as jest.Mocked<
  typeof userManagementClient
>;

describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRedisSessionStats', () => {
    it('should get Redis session stats successfully', async () => {
      const mockResponse: RedisSessionStatsResponse = {
        total_sessions: 1247,
        active_sessions: 892,
        memory_usage: '45.2MB',
        ttl_info: {
          avg_ttl_minutes: 120,
          expired_sessions: 355,
          session_keys_by_pattern: {
            'user:*': 892,
            'admin:*': 12,
            'temp:*': 43,
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getRedisSessionStats();

      expect(mockClient.get).toHaveBeenCalledWith('/admin/redis/session-stats');
      expect(result).toEqual(mockResponse);
    });

    it('should handle Redis session stats error', async () => {
      mockClient.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(adminApi.getRedisSessionStats()).rejects.toThrow();
    });
  });

  describe('getUserStats', () => {
    it('should get user statistics successfully', async () => {
      const mockResponse: UserStatsResponse = {
        total_users: 15420,
        active_users: 12890,
        inactive_users: 2530,
        new_users_today: 45,
        new_users_this_week: 287,
        new_users_this_month: 1205,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getUserStats();

      expect(mockClient.get).toHaveBeenCalledWith('/admin/users/stats');
      expect(result).toEqual(mockResponse);
    });

    it('should handle user stats error', async () => {
      mockClient.get.mockRejectedValue(new Error('Access denied'));

      await expect(adminApi.getUserStats()).rejects.toThrow();
    });
  });

  describe('getSystemHealth', () => {
    it('should get system health successfully', async () => {
      const mockResponse: SystemHealthResponse = {
        status: 'healthy',
        database_status: 'healthy',
        redis_status: 'healthy',
        uptime_seconds: 3600,
        version: '1.0.0',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.getSystemHealth();

      expect(mockClient.get).toHaveBeenCalledWith('/admin/health');
      expect(result).toEqual(mockResponse);
    });

    it('should handle system health error', async () => {
      mockClient.get.mockRejectedValue(new Error('Health check failed'));

      await expect(adminApi.getSystemHealth()).rejects.toThrow();
    });
  });

  describe('forceUserLogout', () => {
    it('should force user logout successfully', async () => {
      const mockResponse: ForceLogoutResponse = {
        success: true,
        sessions_cleared: 3,
        message: 'User successfully logged out from all sessions',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.forceUserLogout('user123');

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/users/user123/force-logout'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle force logout error', async () => {
      mockClient.delete.mockRejectedValue(new Error('User not found'));

      await expect(adminApi.forceUserLogout('user123')).rejects.toThrow();
    });
  });

  describe('clearRedisSession', () => {
    it('should clear Redis sessions without parameters', async () => {
      const mockResponse: ClearSessionsResponse = {
        success: true,
        sessions_cleared: 150,
        message: 'Sessions cleared successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearRedisSession();

      expect(mockClient.delete).toHaveBeenCalledWith('/admin/redis/sessions');
      expect(result).toEqual(mockResponse);
    });

    it('should clear Redis sessions with pattern parameter', async () => {
      const mockResponse: ClearSessionsResponse = {
        success: true,
        sessions_cleared: 25,
        message: 'User sessions cleared successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearRedisSession({
        pattern: 'user:*',
        confirm: true,
      });

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/redis/sessions?pattern=user%3A*&confirm=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle clear Redis sessions error', async () => {
      mockClient.delete.mockRejectedValue(new Error('Operation failed'));

      await expect(adminApi.clearRedisSession()).rejects.toThrow();
    });
  });

  describe('clearAllSessions', () => {
    it('should clear all sessions with confirmation', async () => {
      const mockResponse: ClearSessionsResponse = {
        sessions_cleared: 892,
        message: 'All sessions cleared successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearAllSessions();

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/redis/sessions?pattern=*&confirm=true'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('clearUserSessions', () => {
    it('should clear sessions for specific user', async () => {
      const mockResponse: ClearSessionsResponse = {
        sessions_cleared: 3,
        message: 'User sessions cleared successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearUserSessions('user123');

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/redis/sessions?pattern=user%3Auser123%3A*'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserActivitySummary', () => {
    it('should get user activity summary successfully', async () => {
      const mockUserStats: UserStatsResponse = {
        total_users: 15420,
        active_users: 12890,
        inactive_users: 2530,
        new_users_today: 45,
        new_users_this_week: 287,
        new_users_this_month: 1205,
      };

      const mockSessionStats: RedisSessionStatsResponse = {
        total_sessions: 1247,
        active_sessions: 892,
        memory_usage: '45.2MB',
        ttl_info: {
          avg_ttl_minutes: 120,
          expired_sessions: 355,
          session_keys_by_pattern: {},
        },
      };

      const mockSystemHealth: SystemHealthResponse = {
        status: 'healthy',
        database_status: 'healthy',
        redis_status: 'healthy',
        uptime_seconds: 3600,
        version: '1.0.0',
      };

      mockClient.get
        .mockResolvedValueOnce({ data: mockUserStats })
        .mockResolvedValueOnce({ data: mockSessionStats })
        .mockResolvedValueOnce({ data: mockSystemHealth });

      const result = await adminApi.getUserActivitySummary();

      expect(mockClient.get).toHaveBeenCalledTimes(3);
      expect(mockClient.get).toHaveBeenCalledWith('/admin/users/stats');
      expect(mockClient.get).toHaveBeenCalledWith('/admin/redis/session-stats');
      expect(mockClient.get).toHaveBeenCalledWith('/admin/health');
      expect(result).toEqual({
        userStats: mockUserStats,
        sessionStats: mockSessionStats,
        systemHealth: mockSystemHealth,
      });
    });

    it('should handle user activity summary error', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(adminApi.getUserActivitySummary()).rejects.toThrow();
    });
  });

  describe('performUserAction', () => {
    it('should perform force logout action', async () => {
      const mockResponse: ForceLogoutResponse = {
        success: true,
        sessions_cleared: 2,
        message: 'User logged out successfully',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.performUserAction(
        'user123',
        'force_logout'
      );

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/users/user123/force-logout'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should perform clear sessions action', async () => {
      const mockResponse: ClearSessionsResponse = {
        sessions_cleared: 2,
        message: 'User sessions cleared',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.performUserAction(
        'user123',
        'clear_sessions'
      );

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/redis/sessions?pattern=user%3Auser123%3A*'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for unknown action', async () => {
      await expect(
        adminApi.performUserAction('user123', 'invalid_action' as any)
      ).rejects.toThrow('Unknown user action: invalid_action');
    });
  });

  describe('getSystemDashboard', () => {
    it('should get system dashboard data successfully', async () => {
      const mockHealth: SystemHealthResponse = {
        status: 'healthy',
        database_status: 'healthy',
        redis_status: 'healthy',
        uptime_seconds: 7200,
        version: '1.0.0',
      };

      const mockUserStats: UserStatsResponse = {
        total_users: 10000,
        active_users: 8500,
        inactive_users: 1500,
        new_users_today: 20,
        new_users_this_week: 150,
        new_users_this_month: 600,
      };

      const mockSessionStats: RedisSessionStatsResponse = {
        total_sessions: 850,
        active_sessions: 650,
        memory_usage: '40.0MB',
        ttl_info: {
          expired_sessions: 200,
          avg_ttl_minutes: 90,
          session_keys_by_pattern: {},
        },
      };

      mockClient.get
        .mockResolvedValueOnce({ data: mockHealth })
        .mockResolvedValueOnce({ data: mockUserStats })
        .mockResolvedValueOnce({ data: mockSessionStats });

      const result = await adminApi.getSystemDashboard();

      expect(mockClient.get).toHaveBeenCalledTimes(3);
      expect(result.health).toEqual(mockHealth);
      expect(result.userStats).toEqual(mockUserStats);
      expect(result.sessionStats).toEqual(mockSessionStats);
      expect(result.timestamp).toBeTruthy();
    });

    it('should handle system dashboard error', async () => {
      mockClient.get.mockRejectedValue(new Error('Dashboard data unavailable'));

      await expect(adminApi.getSystemDashboard()).rejects.toThrow();
    });
  });

  describe('emergencySessionClear', () => {
    it('should perform emergency session clear successfully', async () => {
      const mockResponse: ClearSessionsResponse = {
        sessions_cleared: 500,
        message: 'Emergency session clear completed',
      };

      mockClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.emergencySessionClear({
        pattern: '*',
        reason: 'Security breach detected',
        confirmToken: 'emergency-token-123',
      });

      expect(mockClient.delete).toHaveBeenCalledWith('/admin/redis/sessions', {
        data: {
          pattern: '*',
          reason: 'Security breach detected',
          confirm_token: 'emergency-token-123',
          emergency: true,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle emergency session clear error', async () => {
      mockClient.delete.mockRejectedValue(
        new Error('Emergency operation failed')
      );

      await expect(
        adminApi.emergencySessionClear({
          pattern: '*',
          reason: 'Test',
          confirmToken: 'test-token',
        })
      ).rejects.toThrow();
    });
  });

  describe('batchForceLogout', () => {
    it('should perform batch force logout successfully', async () => {
      const mockResponse1: ForceLogoutResponse = {
        success: true,
        sessions_cleared: 2,
        message: 'User logged out',
      };

      const mockResponse2: ForceLogoutResponse = {
        success: true,
        sessions_cleared: 1,
        message: 'User logged out',
      };

      mockClient.delete
        .mockResolvedValueOnce({ data: mockResponse1 })
        .mockResolvedValueOnce({ data: mockResponse2 });

      const result = await adminApi.batchForceLogout(['user1', 'user2']);

      expect(mockClient.delete).toHaveBeenCalledTimes(2);
      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/users/user1/force-logout'
      );
      expect(mockClient.delete).toHaveBeenCalledWith(
        '/admin/users/user2/force-logout'
      );
      expect(result).toEqual({
        successful: ['user1', 'user2'],
        failed: [],
        summary: {
          total: 2,
          successful: 2,
          failed: 0,
        },
      });
    });

    it('should handle partial failures in batch logout', async () => {
      const mockResponse: ForceLogoutResponse = {
        success: true,
        sessions_cleared: 1,
        message: 'User logged out',
      };

      mockClient.delete
        .mockResolvedValueOnce({ data: mockResponse })
        .mockRejectedValueOnce(new Error('User not found'));

      const result = await adminApi.batchForceLogout(['user1', 'user2']);

      expect(result).toEqual({
        successful: ['user1'],
        failed: [{ userId: 'user2', error: 'User not found' }],
        summary: {
          total: 2,
          successful: 1,
          failed: 1,
        },
      });
    });

    it('should handle all failures in batch logout', async () => {
      mockClient.delete
        .mockRejectedValueOnce(new Error('Service unavailable'))
        .mockRejectedValueOnce(new Error('Timeout'));

      const result = await adminApi.batchForceLogout(['user1', 'user2']);

      expect(result).toEqual({
        successful: [],
        failed: [
          { userId: 'user1', error: 'Service unavailable' },
          { userId: 'user2', error: 'Timeout' },
        ],
        summary: {
          total: 2,
          successful: 0,
          failed: 2,
        },
      });
    });

    it('should handle unknown error types', async () => {
      mockClient.delete.mockRejectedValueOnce('Unknown error');

      const result = await adminApi.batchForceLogout(['user1']);

      expect(result.failed[0].error).toBe('Unknown error');
    });
  });
});
