import { authAdminApi } from '@/lib/api/auth/admin';
import { authClient } from '@/lib/api/auth/client';
import type {
  SessionStats,
  ClearSessionsResponse,
  ClearAllCachesResponse,
  ForceLogoutResponse,
} from '@/types/auth';

// Mock the auth client
jest.mock('@/lib/api/auth/client', () => ({
  authClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
  handleAuthApiError: jest.fn().mockImplementation(error => {
    throw new Error(error.message || 'API Error');
  }),
}));

const mockedAuthClient = authClient as jest.Mocked<typeof authClient>;

describe('Auth Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSessionStats', () => {
    it('should get session statistics without params', async () => {
      const mockStats: SessionStats = {
        totalSessions: 100,
        activeSessions: 75,
        memoryUsage: '15.2MB',
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockStats });

      const result = await authAdminApi.getSessionStats();

      expect(mockedAuthClient.get).toHaveBeenCalledWith(
        '/admin/cache/sessions/stats',
        { params: undefined }
      );
      expect(result).toEqual(mockStats);
    });

    it('should get session statistics with TTL params', async () => {
      const mockStats: SessionStats = {
        totalSessions: 100,
        activeSessions: 75,
        memoryUsage: '15.2MB',
        ttlInfo: {
          ttlPolicyUsage: [
            {
              policyName: 'Default',
              configuredTtl: 86400,
              unit: 'seconds',
              activeCount: 75,
            },
          ],
          ttlDistribution: [
            { rangeStart: '0m', rangeEnd: '15m', sessionCount: 10 },
            { rangeStart: '15m', rangeEnd: '1h', sessionCount: 25 },
          ],
          ttlSummary: {
            averageRemainingSeconds: 43200,
            oldestSessionAgeSeconds: 82800,
            totalSessionsWithTtl: 75,
          },
        },
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockStats });

      const result = await authAdminApi.getSessionStats({
        includeTtlPolicy: true,
        includeTtlDistribution: true,
        includeTtlSummary: true,
      });

      expect(mockedAuthClient.get).toHaveBeenCalledWith(
        '/admin/cache/sessions/stats',
        {
          params: {
            includeTtlPolicy: true,
            includeTtlDistribution: true,
            includeTtlSummary: true,
          },
        }
      );
      expect(result).toEqual(mockStats);
    });

    it('should handle session stats error', async () => {
      const error = new Error('Unauthorized');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(authAdminApi.getSessionStats()).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('clearSessions', () => {
    it('should clear all sessions', async () => {
      const mockResponse: ClearSessionsResponse = {
        success: true,
        message: 'Successfully cleared 42 sessions',
        sessionsCleared: 42,
      };

      mockedAuthClient.delete.mockResolvedValue({ data: mockResponse });

      const result = await authAdminApi.clearSessions();

      expect(mockedAuthClient.delete).toHaveBeenCalledWith(
        '/admin/cache/sessions'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle clear sessions error', async () => {
      const error = new Error('Forbidden');
      mockedAuthClient.delete.mockRejectedValue(error);

      await expect(authAdminApi.clearSessions()).rejects.toThrow('Forbidden');
    });
  });

  describe('clearAllCaches', () => {
    it('should clear all caches', async () => {
      const mockResponse: ClearAllCachesResponse = {
        success: true,
        message: 'Successfully cleared 156 keys from all caches',
        cachesCleared: {
          sessions: 42,
          access_tokens: 38,
          refresh_tokens: 35,
          authorization_codes: 2,
          blacklist: 5,
          clients: 8,
          users: 20,
          password_resets: 6,
        },
        totalKeysCleared: 156,
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authAdminApi.clearAllCaches();

      expect(mockedAuthClient.post).toHaveBeenCalledWith('/admin/cache/clear');
      expect(result).toEqual(mockResponse);
    });

    it('should handle clear all caches error', async () => {
      const error = new Error('Internal server error');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(authAdminApi.clearAllCaches()).rejects.toThrow(
        'Internal server error'
      );
    });
  });

  describe('forceLogout', () => {
    it('should force logout a user', async () => {
      const mockResponse: ForceLogoutResponse = {
        success: true,
        message: 'User successfully logged out',
        userId: '550e8400-e29b-41d4-a716-446655440000',
      };

      mockedAuthClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authAdminApi.forceLogout(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(mockedAuthClient.post).toHaveBeenCalledWith(
        '/admin/user-management/550e8400-e29b-41d4-a716-446655440000/force-logout'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle force logout error for non-existent user', async () => {
      const error = new Error('User not found');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(
        authAdminApi.forceLogout('non-existent-user-id')
      ).rejects.toThrow('User not found');
    });

    it('should handle force logout unauthorized error', async () => {
      const error = new Error('Forbidden');
      mockedAuthClient.post.mockRejectedValue(error);

      await expect(
        authAdminApi.forceLogout('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('Forbidden');
    });
  });
});
