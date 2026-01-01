import { metricsApi } from '@/lib/api/user-management/metrics';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  PerformanceMetrics,
  CacheMetrics,
  SystemMetrics,
  DetailedHealthMetrics,
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

describe('Metrics API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPerformanceMetrics', () => {
    it('should get performance metrics successfully', async () => {
      const mockResponse: PerformanceMetrics = {
        responseTimes: {
          averageMs: 145.2,
          p50Ms: 120.0,
          p95Ms: 280.5,
          p99Ms: 450.1,
        },
        requestCounts: {
          totalRequests: 125847,
        },
        errorRates: {
          totalErrors: 2391,
          errorRatePercent: 1.9,
          '4xxErrors': 1856,
          '5xxErrors': 535,
        },
        database: {
          activeConnections: 15,
          maxConnections: 100,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.getPerformanceMetrics();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/performance');
      expect(result).toEqual(mockResponse);
    });

    it('should handle performance metrics error', async () => {
      mockClient.get.mockRejectedValue(new Error('Unauthorized access'));

      await expect(metricsApi.getPerformanceMetrics()).rejects.toThrow();
    });
  });

  describe('getCacheMetrics', () => {
    it('should get cache metrics successfully', async () => {
      const mockResponse: CacheMetrics = {
        memoryUsage: '256.7MB',
        memoryUsageHuman: '256.7MB',
        keysCount: 15420,
        hitRate: 0.94,
        connectedClients: 23,
        evictedKeys: 456,
        expiredKeys: 2341,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.getCacheMetrics();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/cache');
      expect(result).toEqual(mockResponse);
    });

    it('should handle cache metrics error', async () => {
      mockClient.get.mockRejectedValue(new Error('Cache service unavailable'));

      await expect(metricsApi.getCacheMetrics()).rejects.toThrow();
    });
  });

  describe('getSystemMetrics', () => {
    it('should get system metrics successfully', async () => {
      const mockResponse: SystemMetrics = {
        system: {
          cpuUsagePercent: 45.2,
          memoryTotalGb: 16,
          memoryUsedGb: 11,
          memoryUsagePercent: 68.7,
          diskTotalGb: 500,
          diskUsedGb: 210,
          diskUsagePercent: 42.1,
        },
        process: {
          memoryRssMb: 512.3,
          cpuPercent: 12.5,
          numThreads: 24,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.getSystemMetrics();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/system');
      expect(result).toEqual(mockResponse);
    });

    it('should handle system metrics error', async () => {
      mockClient.get.mockRejectedValue(new Error('System metrics unavailable'));

      await expect(metricsApi.getSystemMetrics()).rejects.toThrow();
    });
  });

  describe('getDetailedHealthMetrics', () => {
    it('should get detailed health metrics successfully', async () => {
      const mockResponse: DetailedHealthMetrics = {
        overallStatus: 'healthy',
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

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.getDetailedHealthMetrics();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result).toEqual(mockResponse);
    });

    it('should handle detailed health metrics error', async () => {
      mockClient.get.mockRejectedValue(
        new Error('Health metrics access denied')
      );

      await expect(metricsApi.getDetailedHealthMetrics()).rejects.toThrow();
    });
  });

  describe('getMetricsDashboard', () => {
    it('should get comprehensive metrics dashboard successfully', async () => {
      const mockPerformance: PerformanceMetrics = {
        responseTimes: {
          averageMs: 150,
          p50Ms: 120,
          p95Ms: 280,
          p99Ms: 450,
        },
        requestCounts: {
          totalRequests: 100000,
        },
        errorRates: {
          errorRatePercent: 2.0,
          totalErrors: 2000,
          '4xxErrors': 1500,
          '5xxErrors': 500,
        },
        database: {
          activeConnections: 10,
          maxConnections: 100,
        },
      };

      const mockCache: CacheMetrics = {
        memoryUsage: '200MB',
        memoryUsageHuman: '200MB',
        hitRate: 0.95,
        keysCount: 10000,
        expiredKeys: 500,
        evictedKeys: 100,
        connectedClients: 20,
      };

      const mockSystem: SystemMetrics = {
        system: {
          cpuUsagePercent: 40,
          memoryTotalGb: 8,
          memoryUsedGb: 5,
          memoryUsagePercent: 61,
          diskTotalGb: 100,
          diskUsedGb: 40,
          diskUsagePercent: 40,
        },
        process: {
          memoryRssMb: 256,
          cpuPercent: 10,
          numThreads: 12,
        },
      };

      const mockHealth: DetailedHealthMetrics = {
        overallStatus: 'healthy',
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 5,
            activeConnections: 8,
            maxConnections: 20,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 1,
            memoryUsage: '30MB',
            connectedClients: 10,
            hitRatePercent: 95,
          },
        },
      };

      mockClient.get
        .mockResolvedValueOnce({ data: mockPerformance })
        .mockResolvedValueOnce({ data: mockCache })
        .mockResolvedValueOnce({ data: mockSystem })
        .mockResolvedValueOnce({ data: mockHealth });

      const result = await metricsApi.getMetricsDashboard();

      expect(mockClient.get).toHaveBeenCalledTimes(4);
      expect(mockClient.get).toHaveBeenCalledWith('/metrics/performance');
      expect(mockClient.get).toHaveBeenCalledWith('/metrics/cache');
      expect(mockClient.get).toHaveBeenCalledWith('/metrics/system');
      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result.performance).toEqual(mockPerformance);
      expect(result.cache).toEqual(mockCache);
      expect(result.system).toEqual(mockSystem);
      expect(result.health).toEqual(mockHealth);
      expect(result.timestamp).toBeTruthy();
    });

    it('should handle metrics dashboard error', async () => {
      mockClient.get.mockRejectedValue(new Error('Dashboard data unavailable'));

      await expect(metricsApi.getMetricsDashboard()).rejects.toThrow();
    });
  });

  describe('getHealthTrends', () => {
    it('should get health trends with healthy status', async () => {
      const mockHealth: DetailedHealthMetrics = {
        overallStatus: 'healthy',
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 5,
            activeConnections: 8,
            maxConnections: 20,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 1,
            memoryUsage: '30MB',
            connectedClients: 10,
            hitRatePercent: 95,
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockHealth });

      const result = await metricsApi.getHealthTrends();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/health/detailed');
      expect(result).toEqual({
        current: mockHealth,
        status: 'healthy',
        alerts: [],
      });
    });

    it('should get health trends with alerts for unhealthy services', async () => {
      const mockHealth: DetailedHealthMetrics = {
        overallStatus: 'degraded',
        services: {
          database: {
            status: 'unhealthy',
            responseTimeMs: 500,
            activeConnections: 20,
            maxConnections: 20,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 1,
            memoryUsage: '30MB',
            connectedClients: 10,
            hitRatePercent: 45,
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockHealth });

      const result = await metricsApi.getHealthTrends();

      expect(result).toEqual({
        current: mockHealth,
        status: 'degraded',
        alerts: [
          'Database service is unhealthy',
          'Low Redis hit rate detected',
        ],
      });
    });

    it('should handle health trends error', async () => {
      mockClient.get.mockRejectedValue(new Error('Health data unavailable'));

      await expect(metricsApi.getHealthTrends()).rejects.toThrow();
    });
  });

  describe('getPerformanceAlerts', () => {
    it('should get performance alerts with high response time and error rate', async () => {
      const mockMetrics: PerformanceMetrics = {
        responseTimes: {
          averageMs: 1500,
          p50Ms: 1200,
          p95Ms: 2800,
          p99Ms: 4500,
        },
        requestCounts: {
          totalRequests: 100000,
        },
        errorRates: {
          errorRatePercent: 10,
          totalErrors: 10000,
          '4xxErrors': 8000,
          '5xxErrors': 2000,
        },
        database: {
          activeConnections: 85,
          maxConnections: 100,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await metricsApi.getPerformanceAlerts();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/performance');
      expect(result.metrics).toEqual(mockMetrics);
      expect(result.alerts).toHaveLength(3);
      expect(result.alerts).toContainEqual({
        severity: 'high',
        message: 'High average response time detected',
        metric: 'averageResponseTime',
        value: 1500,
      });
      expect(result.alerts).toContainEqual({
        severity: 'high',
        message: 'High error rate detected',
        metric: 'errorRate',
        value: 10,
      });
      expect(result.alerts).toContainEqual({
        severity: 'medium',
        message: 'High database connection utilization',
        metric: 'dbConnectionUtilization',
        value: 85,
      });
    });

    it('should get performance alerts with no alerts for healthy metrics', async () => {
      const mockMetrics: PerformanceMetrics = {
        responseTimes: {
          averageMs: 100,
          p50Ms: 80,
          p95Ms: 200,
          p99Ms: 350,
        },
        requestCounts: {
          totalRequests: 100000,
        },
        errorRates: {
          errorRatePercent: 0.5,
          totalErrors: 500,
          '4xxErrors': 400,
          '5xxErrors': 100,
        },
        database: {
          activeConnections: 50,
          maxConnections: 100,
        },
      };

      mockClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await metricsApi.getPerformanceAlerts();

      expect(result.alerts).toHaveLength(0);
    });

    it('should handle performance alerts error', async () => {
      mockClient.get.mockRejectedValue(
        new Error('Performance data unavailable')
      );

      await expect(metricsApi.getPerformanceAlerts()).rejects.toThrow();
    });
  });

  describe('getCachePerformanceSummary', () => {
    it('should get excellent cache performance summary', async () => {
      const mockMetrics: CacheMetrics = {
        memoryUsage: '200MB',
        memoryUsageHuman: '200MB',
        hitRate: 0.95,
        keysCount: 10000,
        expiredKeys: 100,
        evictedKeys: 50,
        connectedClients: 15,
      };

      mockClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await metricsApi.getCachePerformanceSummary();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics/cache');
      expect(result).toEqual({
        metrics: mockMetrics,
        performance: 'excellent',
        recommendations: [],
      });
    });

    it('should get poor cache performance with recommendations', async () => {
      const mockMetrics: CacheMetrics = {
        memoryUsage: '512MB',
        memoryUsageHuman: '512MB',
        hitRate: 0.3,
        keysCount: 50000,
        expiredKeys: 5000,
        evictedKeys: 2000,
        connectedClients: 150,
      };

      mockClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await metricsApi.getCachePerformanceSummary();

      expect(result).toEqual({
        metrics: mockMetrics,
        performance: 'poor',
        recommendations: [
          'Consider reviewing cache TTL settings',
          'Analyze cache key patterns for optimization',
          'High number of evicted keys - consider increasing cache memory',
          'High number of connected clients - monitor connection pooling',
        ],
      });
    });

    it('should handle cache performance summary error', async () => {
      mockClient.get.mockRejectedValue(new Error('Cache metrics unavailable'));

      await expect(metricsApi.getCachePerformanceSummary()).rejects.toThrow();
    });
  });
});
