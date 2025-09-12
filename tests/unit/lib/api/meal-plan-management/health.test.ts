import { healthApi } from '@/lib/api/meal-plan-management/health';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';
import type {
  HealthCheckResult,
  VersionInfo,
} from '@/types/meal-plan-management';

// Mock the client
jest.mock('@/lib/api/meal-plan-management/client', () => ({
  mealPlanManagementClient: {
    get: jest.fn(),
  },
  handleMealPlanManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = mealPlanManagementClient as jest.Mocked<
  typeof mealPlanManagementClient
>;

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHealthResult: HealthCheckResult = {
    status: 'ok',
    info: {
      database: { status: 'up' },
      memory_heap: { status: 'up' },
    },
    error: {},
    details: {
      database: { status: 'up' },
      memory_heap: { status: 'up' },
    },
  };

  const mockVersionInfo: VersionInfo = {
    version: '1.0.0',
    environment: 'development',
    timestamp: '2024-01-15T10:30:00Z',
  };

  describe('getHealth', () => {
    it('should get health status successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockHealthResult });

      const result = await healthApi.getHealth();

      expect(mockedClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockHealthResult);
    });

    it('should handle get health error', async () => {
      const error = new Error('Health check failed');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getHealth()).rejects.toThrow(error);
    });
  });

  describe('getReadiness', () => {
    it('should get readiness status successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockHealthResult });

      const result = await healthApi.getReadiness();

      expect(mockedClient.get).toHaveBeenCalledWith('/health/ready');
      expect(result).toEqual(mockHealthResult);
    });

    it('should handle get readiness error', async () => {
      const error = new Error('Readiness check failed');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getReadiness()).rejects.toThrow(error);
    });
  });

  describe('getLiveness', () => {
    it('should get liveness status successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockHealthResult });

      const result = await healthApi.getLiveness();

      expect(mockedClient.get).toHaveBeenCalledWith('/health/live');
      expect(result).toEqual(mockHealthResult);
    });

    it('should handle get liveness error', async () => {
      const error = new Error('Liveness check failed');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getLiveness()).rejects.toThrow(error);
    });
  });

  describe('getVersion', () => {
    it('should get version info successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockVersionInfo });

      const result = await healthApi.getVersion();

      expect(mockedClient.get).toHaveBeenCalledWith('/health/version');
      expect(result).toEqual(mockVersionInfo);
    });

    it('should handle get version error', async () => {
      const error = new Error('Version check failed');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getVersion()).rejects.toThrow(error);
    });
  });
});
