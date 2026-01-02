import { healthApi } from '@/lib/api/user-management/health';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  LivenessResponse,
  ReadinessResponse,
  ComprehensiveHealthResponse,
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

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getHealthCheck', () => {
    it('should get basic health/liveness check successfully', async () => {
      const mockResponse: LivenessResponse = {
        status: 'UP',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealthCheck();

      expect(mockClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse);
    });

    it('should handle health check error', async () => {
      mockClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(healthApi.getHealthCheck()).rejects.toThrow();
    });
  });

  describe('getReadinessCheck', () => {
    it('should get readiness check successfully', async () => {
      const mockResponse: ReadinessResponse = {
        status: 'READY',
        database: {
          status: 'healthy',
        },
        redis: {
          status: 'healthy',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getReadinessCheck();

      expect(mockClient.get).toHaveBeenCalledWith('/ready');
      expect(result).toEqual(mockResponse);
    });

    it('should handle degraded readiness status', async () => {
      const mockResponse: ReadinessResponse = {
        status: 'DEGRADED',
        database: {
          status: 'unhealthy',
          message: 'Database connection failed',
        },
        redis: {
          status: 'healthy',
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getReadinessCheck();

      expect(result.status).toBe('DEGRADED');
    });

    it('should handle readiness check error', async () => {
      mockClient.get.mockRejectedValue(new Error('Readiness probe failed'));

      await expect(healthApi.getReadinessCheck()).rejects.toThrow();
    });
  });

  describe('getComprehensiveHealth', () => {
    it('should get comprehensive health check successfully', async () => {
      const mockResponse: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 7200,
        version: '1.0.0',
        environment: 'production',
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 8.5,
            activeConnections: 12,
            maxConnections: 20,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 2.1,
            memoryUsage: '45.6MB',
            connectedClients: 15,
            hitRatePercent: 94.2,
          },
        },
        systemResources: {
          cpuUsagePercent: 35.2,
          memoryUsagePercent: 68.5,
          diskUsagePercent: 42.1,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getComprehensiveHealth();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result).toEqual(mockResponse);
    });

    it('should handle comprehensive health check error', async () => {
      mockClient.get.mockRejectedValue(new Error('Unauthorized access'));

      await expect(healthApi.getComprehensiveHealth()).rejects.toThrow();
    });
  });

  describe('getUptime', () => {
    it('should return uptime information', async () => {
      const mockHealthResponse: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 7265, // 2 hours, 1 minute, 5 seconds
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getUptime();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result).toEqual({
        uptimeSeconds: 7265,
        uptimeHuman: '2h 1m',
      });
    });

    it('should handle uptime calculation for days', async () => {
      const mockHealthResponse: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 269700, // 3 days, 2 hours, 55 minutes
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getUptime();

      expect(result).toEqual({
        uptimeSeconds: 269700,
        uptimeHuman: '3d 2h 55m',
      });
    });

    it('should handle uptime less than a minute', async () => {
      const mockHealthResponse: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 45,
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getUptime();

      expect(result).toEqual({
        uptimeSeconds: 45,
        uptimeHuman: '< 1m',
      });
    });

    it('should return unknown uptime on error', async () => {
      mockClient.get.mockRejectedValue(new Error('Uptime unavailable'));

      const result = await healthApi.getUptime();

      expect(result).toEqual({
        uptimeSeconds: 0,
        uptimeHuman: 'Unknown',
      });
    });
  });

  describe('monitorHealth', () => {
    it('should return healthy status on first attempt', async () => {
      const mockHealthResponse: LivenessResponse = {
        status: 'UP',
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.monitorHealth();

      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        isHealthy: true,
        health: mockHealthResponse,
        attempts: 1,
      });
    });

    it('should retry on failure and eventually succeed', async () => {
      jest.useRealTimers(); // Use real timers for this test

      const mockHealthResponse: LivenessResponse = {
        status: 'UP',
      };

      mockClient.get
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockRejectedValueOnce(new Error('Second attempt failed'))
        .mockResolvedValueOnce({ data: mockHealthResponse });

      const result = await healthApi.monitorHealth({
        retries: 3,
        retryDelay: 1,
      });

      expect(mockClient.get).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        isHealthy: true,
        health: mockHealthResponse,
        attempts: 3,
      });

      jest.useFakeTimers(); // Switch back to fake timers
    });

    it('should return failure after all retries exhausted', async () => {
      jest.useRealTimers(); // Use real timers for this test

      mockClient.get.mockRejectedValue(new Error('Health check failed'));

      const result = await healthApi.monitorHealth({
        retries: 2,
        retryDelay: 1,
      });

      expect(mockClient.get).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(result).toEqual({
        isHealthy: false,
        health: null,
        attempts: 3,
        lastError: 'Health check failed',
      });

      jest.useFakeTimers(); // Switch back to fake timers
    });

    it('should handle non-Error exceptions', async () => {
      mockClient.get.mockRejectedValue('String error');

      const result = await healthApi.monitorHealth({ retries: 0 });

      expect(result).toEqual({
        isHealthy: false,
        health: null,
        attempts: 1,
        lastError: 'Unknown error',
      });
    });
  });

  describe('getHealthSummary', () => {
    it('should get health summary without detailed health (no admin permissions)', async () => {
      const mockLiveness: LivenessResponse = {
        status: 'UP',
      };

      const mockReadiness: ReadinessResponse = {
        status: 'READY',
        database: {
          status: 'healthy',
        },
        redis: {
          status: 'healthy',
        },
      };

      const mockComprehensive: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 3600,
      };

      // Mock calls in order
      mockClient.get
        .mockResolvedValueOnce({ data: mockLiveness }) // getHealthCheck
        .mockResolvedValueOnce({ data: mockReadiness }) // getReadinessCheck
        .mockResolvedValueOnce({ data: mockComprehensive }) // getUptime -> getComprehensiveHealth
        .mockRejectedValueOnce(new Error('Access denied')); // getComprehensiveHealth for detailed

      const result = await healthApi.getHealthSummary();

      expect(result.liveness).toEqual(mockLiveness);
      expect(result.readiness).toEqual(mockReadiness);
      expect(result.uptime).toEqual({
        uptimeSeconds: 3600,
        uptimeHuman: '1h',
      });
      expect(result.detailed).toBeUndefined();
    });

    it('should get health summary with detailed health (admin permissions)', async () => {
      const mockLiveness: LivenessResponse = {
        status: 'UP',
      };

      const mockReadiness: ReadinessResponse = {
        status: 'READY',
        database: {
          status: 'healthy',
        },
        redis: {
          status: 'healthy',
        },
      };

      const mockComprehensive: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 3600,
        version: '1.0.0',
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 5.5,
            activeConnections: 10,
            maxConnections: 15,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 1.2,
            memoryUsage: '30.5MB',
            connectedClients: 12,
            hitRatePercent: 95.5,
          },
        },
      };

      // Mock calls in order
      mockClient.get
        .mockResolvedValueOnce({ data: mockLiveness }) // getHealthCheck
        .mockResolvedValueOnce({ data: mockReadiness }) // getReadinessCheck
        .mockResolvedValueOnce({ data: mockComprehensive }) // getUptime -> getComprehensiveHealth
        .mockResolvedValueOnce({ data: mockComprehensive }); // getComprehensiveHealth for detailed

      const result = await healthApi.getHealthSummary();

      expect(result.liveness).toEqual(mockLiveness);
      expect(result.readiness).toEqual(mockReadiness);
      expect(result.detailed).toEqual(mockComprehensive);
      expect(result.uptime).toEqual({
        uptimeSeconds: 3600,
        uptimeHuman: '1h',
      });
    });

    it('should handle health summary error', async () => {
      mockClient.get.mockRejectedValue(new Error('Health summary unavailable'));

      await expect(healthApi.getHealthSummary()).rejects.toThrow();
    });
  });

  describe('checkServiceComponent', () => {
    it('should check database component successfully', async () => {
      const mockDetailedHealth: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 3600,
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 8.5,
            activeConnections: 12,
            maxConnections: 20,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 2.1,
            memoryUsage: '45.6MB',
            connectedClients: 15,
            hitRatePercent: 94.2,
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockDetailedHealth });

      const result = await healthApi.checkServiceComponent('database');

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result).toEqual({
        component: 'database',
        status: 'healthy',
        responseTimeMs: 8.5,
        details: mockDetailedHealth.services?.database,
      });
    });

    it('should check redis component successfully', async () => {
      const mockDetailedHealth: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 3600,
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 8.5,
            activeConnections: 12,
            maxConnections: 20,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 2.1,
            memoryUsage: '45.6MB',
            connectedClients: 15,
            hitRatePercent: 94.2,
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockDetailedHealth });

      const result = await healthApi.checkServiceComponent('redis');

      expect(result).toEqual({
        component: 'redis',
        status: 'healthy',
        responseTimeMs: 2.1,
        details: mockDetailedHealth.services?.redis,
      });
    });

    it('should return unhealthy status when component check fails', async () => {
      mockClient.get.mockRejectedValue(new Error('Component check failed'));

      const result = await healthApi.checkServiceComponent('database');

      expect(result).toEqual({
        component: 'database',
        status: 'unhealthy',
        details: { error: 'Unable to check component health' },
      });
    });

    it('should handle missing component data', async () => {
      const mockDetailedHealth: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptimeSeconds: 3600,
        services: {},
      };

      mockClient.get.mockResolvedValue({ data: mockDetailedHealth });

      const result = await healthApi.checkServiceComponent('database');

      expect(result).toEqual({
        component: 'database',
        status: 'unhealthy',
        responseTimeMs: undefined,
        details: undefined,
      });
    });
  });

  describe('getHealthCheckWithTimeout', () => {
    it('should return health check within timeout', async () => {
      const mockHealthResponse: LivenessResponse = {
        status: 'UP',
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getHealthCheckWithTimeout(5000);

      expect(mockClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockHealthResponse);
    });

    it('should timeout if health check takes too long', async () => {
      // Mock a slow response
      mockClient.get.mockImplementation(
        () =>
          new Promise(resolve => setTimeout(() => resolve({ data: {} }), 10000))
      );

      const promise = healthApi.getHealthCheckWithTimeout(1000);

      // Advance time past the timeout
      jest.advanceTimersByTime(1001);

      await expect(promise).rejects.toThrow('Health check timeout');
    });

    it('should use default timeout of 5000ms', async () => {
      mockClient.get.mockImplementation(
        () =>
          new Promise(resolve => setTimeout(() => resolve({ data: {} }), 6000))
      );

      const promise = healthApi.getHealthCheckWithTimeout();

      // Advance time past the default timeout
      jest.advanceTimersByTime(5001);

      await expect(promise).rejects.toThrow('Health check timeout');
    });

    it('should handle health check error before timeout', async () => {
      mockClient.get.mockRejectedValue(new Error('Health check failed'));

      await expect(healthApi.getHealthCheckWithTimeout()).rejects.toThrow(
        'Health check failed'
      );
    });
  });
});
