import { healthApi } from '@/lib/api/notification/health';
import { notificationClient } from '@/lib/api/notification/client';
import type { HealthResponse, LivenessResponse } from '@/types/notification';

// Mock the client module
jest.mock('@/lib/api/notification/client', () => ({
  notificationClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleNotificationApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockClient = notificationClient as jest.Mocked<typeof notificationClient>;

describe('Notification Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkReadiness', () => {
    it('should return healthy status when all dependencies are up', async () => {
      const mockResponse: HealthResponse = {
        status: 'healthy',
        checks: {
          database: 'ok',
          redis: 'ok',
          smtp: 'ok',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.checkReadiness();

      expect(mockClient.get).toHaveBeenCalledWith('/health/ready');
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('healthy');
    });

    it('should return degraded status when some dependencies are slow', async () => {
      const mockResponse: HealthResponse = {
        status: 'degraded',
        checks: {
          database: 'ok',
          redis: 'degraded',
          smtp: 'ok',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.checkReadiness();

      expect(result.status).toBe('degraded');
      expect(result.checks.redis).toBe('degraded');
    });

    it('should return unhealthy status when critical dependencies are down', async () => {
      const mockResponse: HealthResponse = {
        status: 'unhealthy',
        checks: {
          database: 'failed',
          redis: 'ok',
          smtp: 'ok',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.checkReadiness();

      expect(result.status).toBe('unhealthy');
      expect(result.checks.database).toBe('failed');
    });

    it('should handle service unavailable error', async () => {
      const error = new Error('Service unavailable');
      mockClient.get.mockRejectedValue(error);

      await expect(healthApi.checkReadiness()).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.get.mockRejectedValue(error);

      await expect(healthApi.checkReadiness()).rejects.toThrow('Network error');
    });

    it('should handle timeout error', async () => {
      const error = new Error('Request timeout');
      mockClient.get.mockRejectedValue(error);

      await expect(healthApi.checkReadiness()).rejects.toThrow(
        'Request timeout'
      );
    });
  });

  describe('checkLiveness', () => {
    it('should return alive status when service is running', async () => {
      const mockResponse: LivenessResponse = {
        status: 'alive',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.checkLiveness();

      expect(mockClient.get).toHaveBeenCalledWith('/health/live');
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('alive');
    });

    it('should handle service unavailable when dead', async () => {
      // Liveness endpoint returns error when service is not alive
      const error = new Error('Service unavailable');
      mockClient.get.mockRejectedValue(error);

      await expect(healthApi.checkLiveness()).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');
      mockClient.get.mockRejectedValue(error);

      await expect(healthApi.checkLiveness()).rejects.toThrow('Network error');
    });

    it('should handle connection refused error', async () => {
      const error = new Error('Connection refused');
      mockClient.get.mockRejectedValue(error);

      await expect(healthApi.checkLiveness()).rejects.toThrow(
        'Connection refused'
      );
    });
  });
});
