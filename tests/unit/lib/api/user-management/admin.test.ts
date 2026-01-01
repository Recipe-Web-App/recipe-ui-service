import { adminApi } from '@/lib/api/user-management/admin';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  UserStatsResponse,
  CacheClearRequest,
  CacheClearResponse,
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

  describe('getUserStats', () => {
    it('should get user statistics successfully', async () => {
      const mockResponse: UserStatsResponse = {
        totalUsers: 15420,
        activeUsers: 12890,
        inactiveUsers: 2530,
        newUsersToday: 45,
        newUsersThisWeek: 287,
        newUsersThisMonth: 1205,
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

  describe('clearCache', () => {
    it('should clear cache with pattern successfully', async () => {
      const mockRequest: CacheClearRequest = {
        keyPattern: 'user:*',
      };

      const mockResponse: CacheClearResponse = {
        message: 'Cache cleared successfully',
        pattern: 'user:*',
        clearedCount: 150,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache(mockRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/admin/cache/clear',
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should clear cache without parameters', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'Cache cleared successfully',
        clearedCount: 500,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCache();

      expect(mockClient.post).toHaveBeenCalledWith('/admin/cache/clear', {});
      expect(result).toEqual(mockResponse);
    });

    it('should handle cache clear error', async () => {
      mockClient.post.mockRejectedValue(new Error('Unauthorized'));

      await expect(adminApi.clearCache()).rejects.toThrow();
    });
  });

  describe('clearAllCache', () => {
    it('should clear all cache entries', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'All cache cleared',
        pattern: '*',
        clearedCount: 892,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearAllCache();

      expect(mockClient.post).toHaveBeenCalledWith('/admin/cache/clear', {
        keyPattern: '*',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle clear all cache error', async () => {
      mockClient.post.mockRejectedValue(new Error('Operation failed'));

      await expect(adminApi.clearAllCache()).rejects.toThrow();
    });
  });

  describe('clearCacheByEntity', () => {
    it('should clear cache for users entity type', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'User cache cleared',
        pattern: 'user:*',
        clearedCount: 100,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCacheByEntity('users');

      expect(mockClient.post).toHaveBeenCalledWith('/admin/cache/clear', {
        keyPattern: 'user:*',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should clear cache for notifications entity type', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'Notification cache cleared',
        pattern: 'notification:*',
        clearedCount: 50,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCacheByEntity('notifications');

      expect(mockClient.post).toHaveBeenCalledWith('/admin/cache/clear', {
        keyPattern: 'notification:*',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should clear cache for sessions entity type', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'Session cache cleared',
        pattern: 'session:*',
        clearedCount: 200,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await adminApi.clearCacheByEntity('sessions');

      expect(mockClient.post).toHaveBeenCalledWith('/admin/cache/clear', {
        keyPattern: 'session:*',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for unknown entity type', async () => {
      await expect(
        adminApi.clearCacheByEntity('invalid' as any)
      ).rejects.toThrow('Unknown entity type: invalid');
    });
  });
});
