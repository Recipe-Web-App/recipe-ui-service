import { healthApi } from '@/lib/api/user-management/health';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  HealthHistoryResponse,
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
    // Reset timers for timeout tests
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getHealthCheck', () => {
    it('should get basic health check successfully', async () => {
      const mockResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
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

  describe('getLivenessCheck', () => {
    it('should get liveness check successfully', async () => {
      const mockResponse = { status: 'ok' };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getLivenessCheck();

      expect(mockClient.get).toHaveBeenCalledWith('/live');
      expect(result).toEqual(mockResponse);
    });

    it('should handle liveness check error', async () => {
      mockClient.get.mockRejectedValue(new Error('Liveness probe failed'));

      await expect(healthApi.getLivenessCheck()).rejects.toThrow();
    });
  });

  describe('getComprehensiveHealth', () => {
    it('should get comprehensive health check successfully', async () => {
      const mockResponse: ComprehensiveHealthResponse = {
        overall_status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 7200,
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 8.5,
            connection_pool: {
              active_connections: 12,
              idle_connections: 8,
              max_connections: 20,
            },
          },
          redis: {
            status: 'healthy',
            response_time_ms: 2.1,
            memory: { used_memory_human: '45.6MB' },
            connectivity: {
              connected_clients: 15,
            },
            performance: { hit_rate_percent: 94.2 },
          },
        },
        system_resources: {
          cpu_usage_percent: 35.2,
          memory_usage_percent: 68.5,
          disk_usage_percent: 42.1,
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

  describe('getHealthHistory', () => {
    it('should get health history without parameters', async () => {
      const mockResponse: HealthHistoryResponse = {
        entries: [
          {
            timestamp: '2023-01-01T00:00:00Z',
            overall_status: 'healthy',
            metrics: {
              response_time_ms: 120.5,
            },
          },
          {
            timestamp: '2023-01-01T01:00:00Z',
            overall_status: 'healthy',
            metrics: {
              response_time_ms: 115.2,
            },
          },
        ],
        period_start: '2023-01-01T00:00:00Z',
        period_end: '2023-01-01T02:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealthHistory();

      expect(mockClient.get).toHaveBeenCalledWith('/health/history');
      expect(result).toEqual(mockResponse);
    });

    it('should get health history with parameters', async () => {
      const mockResponse: HealthHistoryResponse = {
        entries: [
          {
            timestamp: '2023-01-01T12:00:00Z',
            overall_status: 'healthy',
            metrics: {
              response_time_ms: 110.0,
            },
          },
        ],
        period_start: '2023-01-01T12:00:00Z',
        period_end: '2023-01-01T13:00:00Z',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealthHistory({
        period_start: '2023-01-01T12:00:00Z',
        period_end: '2023-01-01T13:00:00Z',
        limit: 50,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/health/history?period_start=2023-01-01T12%3A00%3A00Z&period_end=2023-01-01T13%3A00%3A00Z&limit=50'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle health history error', async () => {
      mockClient.get.mockRejectedValue(new Error('History data unavailable'));

      await expect(healthApi.getHealthHistory()).rejects.toThrow();
    });
  });

  describe('getReadinessCheck', () => {
    it('should return ready status when health check is healthy', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getReadinessCheck();

      expect(mockClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual({
        status: 'ready',
        checks: {
          database: 'pass',
          redis: 'pass',
          external_services: 'pass',
        },
      });
    });

    it('should return not ready status when health check is unhealthy', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'unhealthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getReadinessCheck();

      expect(result).toEqual({
        status: 'not_ready',
        checks: {
          database: 'fail',
          redis: 'fail',
          external_services: 'fail',
        },
      });
    });

    it('should return not ready status on health check error', async () => {
      mockClient.get.mockRejectedValue(new Error('Health check failed'));

      const result = await healthApi.getReadinessCheck();

      expect(result).toEqual({
        status: 'not_ready',
        checks: {
          database: 'fail',
          redis: 'fail',
          external_services: 'fail',
        },
      });
    });
  });

  describe('getUptime', () => {
    it('should return uptime information', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 7265, // 2 hours, 1 minute, 5 seconds
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getUptime();

      expect(mockClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual({
        uptime_seconds: 7265,
        uptime_human: '2h 1m',
      });
    });

    it('should handle uptime calculation for days', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 269700, // 3 days, 2 hours, 55 minutes
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getUptime();

      expect(result).toEqual({
        uptime_seconds: 269700,
        uptime_human: '3d 2h 55m',
      });
    });

    it('should handle uptime less than a minute', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 45,
      };

      mockClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getUptime();

      expect(result).toEqual({
        uptime_seconds: 45,
        uptime_human: '< 1m',
      });
    });

    it('should return unknown uptime on error', async () => {
      mockClient.get.mockRejectedValue(new Error('Uptime unavailable'));

      const result = await healthApi.getUptime();

      expect(result).toEqual({
        uptime_seconds: 0,
        uptime_human: 'Unknown',
      });
    });
  });

  describe('monitorHealth', () => {
    it('should return healthy status on first attempt', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
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

      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
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
      const mockBasicHealth: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
      };

      const mockUptime = {
        uptime_seconds: 3600,
        uptime_human: '1h',
      };

      const mockReadiness = {
        status: 'ready' as const,
        checks: {
          database: 'pass' as const,
          redis: 'pass' as const,
          external_services: 'pass' as const,
        },
      };

      // Mock the health check calls made by getUptime and getReadinessCheck
      mockClient.get
        .mockResolvedValueOnce({ data: mockBasicHealth }) // getHealthCheck in getHealthSummary
        .mockResolvedValueOnce({ data: mockBasicHealth }) // getHealthCheck in getUptime
        .mockResolvedValueOnce({ data: mockBasicHealth }) // getHealthCheck in getReadinessCheck
        .mockRejectedValueOnce(new Error('Access denied')); // getComprehensiveHealth

      const result = await healthApi.getHealthSummary();

      expect(result).toEqual({
        basic: mockBasicHealth,
        detailed: undefined,
        uptime: mockUptime,
        readiness: mockReadiness,
      });
    });

    it('should get health summary with detailed health (admin permissions)', async () => {
      const mockBasicHealth: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
      };

      const mockDetailedHealth: ComprehensiveHealthResponse = {
        overall_status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 5.5,
            connection_pool: {
              active_connections: 10,
              idle_connections: 5,
              max_connections: 15,
            },
          },
          redis: {
            status: 'healthy',
            response_time_ms: 1.2,
            memory: { used_memory_human: '30.5MB' },
            connectivity: { connected_clients: 12 },
            performance: { hit_rate_percent: 95.5 },
          },
        },
        system_resources: {
          cpu_usage_percent: 25.0,
          memory_usage_percent: 60.0,
          disk_usage_percent: 35.0,
        },
      };

      // Mock calls in order they are made
      mockClient.get
        .mockResolvedValueOnce({ data: mockBasicHealth }) // getHealthCheck in getHealthSummary
        .mockResolvedValueOnce({ data: mockBasicHealth }) // getHealthCheck in getUptime
        .mockResolvedValueOnce({ data: mockBasicHealth }) // getHealthCheck in getReadinessCheck
        .mockResolvedValueOnce({ data: mockDetailedHealth }); // getComprehensiveHealth

      const result = await healthApi.getHealthSummary();

      expect(result.basic).toEqual(mockBasicHealth);
      expect(result.detailed).toEqual(mockDetailedHealth);
      expect(result.uptime).toEqual({
        uptime_seconds: 3600,
        uptime_human: '1h',
      });
      expect(result.readiness.status).toBe('ready');
    });

    it('should handle health summary error', async () => {
      mockClient.get.mockRejectedValue(new Error('Health summary unavailable'));

      await expect(healthApi.getHealthSummary()).rejects.toThrow();
    });
  });

  describe('checkServiceComponent', () => {
    it('should check database component successfully', async () => {
      const mockDetailedHealth: ComprehensiveHealthResponse = {
        overall_status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 8.5,
            connection_pool: {
              active_connections: 12,
              idle_connections: 8,
              max_connections: 20,
            },
          },
          redis: {
            status: 'healthy',
            response_time_ms: 2.1,
            memory: { used_memory_human: '45.6MB' },
            connectivity: {
              connected_clients: 15,
            },
            performance: { hit_rate_percent: 94.2 },
          },
        },
        system_resources: {
          cpu_usage_percent: 35.2,
          memory_usage_percent: 68.5,
          disk_usage_percent: 42.1,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockDetailedHealth });

      const result = await healthApi.checkServiceComponent('database');

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result).toEqual({
        component: 'database',
        status: 'healthy',
        response_time_ms: 8.5,
        details: mockDetailedHealth.services?.database,
      });
    });

    it('should check redis component successfully', async () => {
      const mockDetailedHealth: ComprehensiveHealthResponse = {
        overall_status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 8.5,
            connection_pool: {
              active_connections: 12,
              idle_connections: 8,
              max_connections: 20,
            },
          },
          redis: {
            status: 'healthy',
            response_time_ms: 2.1,
            memory: { used_memory_human: '45.6MB' },
            connectivity: {
              connected_clients: 15,
            },
            performance: { hit_rate_percent: 94.2 },
          },
        },
        system_resources: {},
      };

      mockClient.get.mockResolvedValue({ data: mockDetailedHealth });

      const result = await healthApi.checkServiceComponent('redis');

      expect(result).toEqual({
        component: 'redis',
        status: 'healthy',
        response_time_ms: 2.1,
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
        overall_status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
        services: {},
        system_resources: {},
      };

      mockClient.get.mockResolvedValue({ data: mockDetailedHealth });

      const result = await healthApi.checkServiceComponent('database');

      expect(result).toEqual({
        component: 'database',
        status: 'unhealthy',
        response_time_ms: undefined,
        details: undefined,
      });
    });
  });

  describe('getHealthCheckWithTimeout', () => {
    it('should return health check within timeout', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        uptime_seconds: 3600,
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
