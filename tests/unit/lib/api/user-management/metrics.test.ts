import { metricsApi } from '@/lib/api/user-management/metrics';
import { userManagementClient } from '@/lib/api/user-management/client';
import type {
  PerformanceMetrics,
  CacheMetrics,
  CacheClearRequest,
  CacheClearResponse,
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
        response_times: {
          average_ms: 145.2,
          p50_ms: 120.0,
          p95_ms: 280.5,
          p99_ms: 450.1,
        },
        request_counts: {
          total_requests: 125847,
          requests_per_minute: 205,
          active_sessions: 456,
        },
        error_rates: {
          total_errors: 2391,
          error_rate_percent: 1.9,
          '4xx_errors': 1856,
          '5xx_errors': 535,
        },
        database: {
          avg_query_time_ms: 12.5,
          slow_queries_count: 23,
          active_connections: 15,
          max_connections: 100,
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
        memory_usage: '256.7MB',
        memory_usage_human: '256.7MB',
        keys_count: 15420,
        hit_rate: 0.94,
        connected_clients: 23,
        evicted_keys: 456,
        expired_keys: 2341,
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

  describe('clearCache', () => {
    it('should clear cache without request data', async () => {
      const mockResponse: CacheClearResponse = {
        cleared_count: 150,
        pattern: '*',
        message: 'Cache cleared successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.clearCache();

      expect(mockClient.post).toHaveBeenCalledWith('/metrics/cache/clear', {});
      expect(result).toEqual(mockResponse);
    });

    it('should clear cache with specific pattern', async () => {
      const mockRequest: CacheClearRequest = {
        pattern: 'user:*',
      };

      const mockResponse: CacheClearResponse = {
        cleared_count: 45,
        pattern: 'user:*',
        message: 'User cache cleared successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.clearCache(mockRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/metrics/cache/clear',
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle clear cache error', async () => {
      mockClient.post.mockRejectedValue(new Error('Cache clear failed'));

      await expect(metricsApi.clearCache()).rejects.toThrow();
    });
  });

  describe('getSystemMetrics', () => {
    it('should get system metrics successfully', async () => {
      const mockResponse: SystemMetrics = {
        system: {
          cpu_usage_percent: 45.2,
          memory_total_gb: 16,
          memory_used_gb: 11,
          memory_usage_percent: 68.7,
          disk_total_gb: 500,
          disk_used_gb: 210,
          disk_usage_percent: 42.1,
        },
        process: {
          memory_rss_mb: 512.3,
          cpu_percent: 12.5,
          num_threads: 24,
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
        overall_status: 'healthy',
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 8.5,
            active_connections: 12,
            max_connections: 20,
          },
          redis: {
            status: 'healthy',
            response_time_ms: 2.1,
            memory_usage: '45.6MB',
            connected_clients: 15,
            hit_rate_percent: 94.2,
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

  describe('clearAllCache', () => {
    it('should clear all cache using wildcard pattern', async () => {
      const mockResponse: CacheClearResponse = {
        cleared_count: 1500,
        pattern: '*',
        message: 'All cache cleared successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.clearAllCache();

      expect(mockClient.post).toHaveBeenCalledWith('/metrics/cache/clear', {
        pattern: '*',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('clearCacheByEntity', () => {
    it('should clear users cache', async () => {
      const mockResponse: CacheClearResponse = {
        cleared_count: 250,
        pattern: 'user:*',
        message: 'User cache cleared successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.clearCacheByEntity('users');

      expect(mockClient.post).toHaveBeenCalledWith('/metrics/cache/clear', {
        pattern: 'user:*',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should clear notifications cache', async () => {
      const mockResponse: CacheClearResponse = {
        cleared_count: 89,
        pattern: 'notification:*',
        message: 'Notification cache cleared successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.clearCacheByEntity('notifications');

      expect(mockClient.post).toHaveBeenCalledWith('/metrics/cache/clear', {
        pattern: 'notification:*',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should clear sessions cache', async () => {
      const mockResponse: CacheClearResponse = {
        cleared_count: 125,
        pattern: 'session:*',
        message: 'Session cache cleared successfully',
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.clearCacheByEntity('sessions');

      expect(mockClient.post).toHaveBeenCalledWith('/metrics/cache/clear', {
        pattern: 'session:*',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMetricsDashboard', () => {
    it('should get comprehensive metrics dashboard successfully', async () => {
      const mockPerformance: PerformanceMetrics = {
        response_times: {
          average_ms: 150,
          p50_ms: 120,
          p95_ms: 280,
          p99_ms: 450,
        },
        request_counts: {
          total_requests: 100000,
          requests_per_minute: 200,
          active_sessions: 500,
        },
        error_rates: {
          error_rate_percent: 2.0,
          total_errors: 2000,
          '4xx_errors': 1500,
          '5xx_errors': 500,
        },
        database: {
          avg_query_time_ms: 10,
          slow_queries_count: 20,
          active_connections: 10,
          max_connections: 100,
        },
      };

      const mockCache: CacheMetrics = {
        memory_usage: '200MB',
        memory_usage_human: '200MB',
        hit_rate: 0.95,
        keys_count: 10000,
        expired_keys: 500,
        evicted_keys: 100,
        connected_clients: 20,
      };

      const mockSystem: SystemMetrics = {
        system: {
          cpu_usage_percent: 40,
          memory_total_gb: 8,
          memory_used_gb: 5,
          memory_usage_percent: 61,
          disk_total_gb: 100,
          disk_used_gb: 40,
          disk_usage_percent: 40,
        },
        process: {
          memory_rss_mb: 256,
          cpu_percent: 10,
          num_threads: 12,
        },
      };

      const mockHealth: DetailedHealthMetrics = {
        overall_status: 'healthy',
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 5,
            active_connections: 8,
            max_connections: 20,
          },
          redis: {
            status: 'healthy',
            response_time_ms: 1,
            memory_usage: '30MB',
            connected_clients: 10,
            hit_rate_percent: 95,
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
        overall_status: 'healthy',
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 5,
            active_connections: 8,
            max_connections: 20,
          },
          redis: {
            status: 'healthy',
            response_time_ms: 1,
            memory_usage: '30MB',
            connected_clients: 10,
            hit_rate_percent: 95,
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
        overall_status: 'degraded',
        services: {
          database: {
            status: 'unhealthy',
            response_time_ms: 500,
            active_connections: 20,
            max_connections: 20,
          },
          redis: {
            status: 'healthy',
            response_time_ms: 1,
            memory_usage: '30MB',
            connected_clients: 10,
            hit_rate_percent: 45,
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
        response_times: {
          average_ms: 1500,
          p50_ms: 1200,
          p95_ms: 2800,
          p99_ms: 4500,
        },
        request_counts: {
          total_requests: 100000,
          requests_per_minute: 200,
          active_sessions: 300,
        },
        error_rates: {
          error_rate_percent: 10,
          total_errors: 10000,
          '4xx_errors': 8000,
          '5xx_errors': 2000,
        },
        database: {
          avg_query_time_ms: 10,
          slow_queries_count: 20,
          active_connections: 85,
          max_connections: 100,
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
        metric: 'average_response_time',
        value: 1500,
      });
      expect(result.alerts).toContainEqual({
        severity: 'high',
        message: 'High error rate detected',
        metric: 'error_rate',
        value: 10,
      });
      expect(result.alerts).toContainEqual({
        severity: 'medium',
        message: 'High database connection utilization',
        metric: 'db_connection_utilization',
        value: 85,
      });
    });

    it('should get performance alerts with no alerts for healthy metrics', async () => {
      const mockMetrics: PerformanceMetrics = {
        response_times: {
          average_ms: 100,
          p50_ms: 80,
          p95_ms: 200,
          p99_ms: 350,
        },
        request_counts: {
          total_requests: 100000,
          requests_per_minute: 200,
          active_sessions: 400,
        },
        error_rates: {
          error_rate_percent: 0.5,
          total_errors: 500,
          '4xx_errors': 400,
          '5xx_errors': 100,
        },
        database: {
          avg_query_time_ms: 5,
          slow_queries_count: 2,
          active_connections: 50,
          max_connections: 100,
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
        memory_usage: '200MB',
        memory_usage_human: '200MB',
        hit_rate: 0.95,
        keys_count: 10000,
        expired_keys: 100,
        evicted_keys: 50,
        connected_clients: 15,
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
        memory_usage: '512MB',
        memory_usage_human: '512MB',
        hit_rate: 0.3,
        keys_count: 50000,
        expired_keys: 5000,
        evicted_keys: 2000,
        connected_clients: 150,
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

  describe('warmCache', () => {
    it('should warm cache successfully', async () => {
      const mockResponse = {
        warmed_patterns: ['user:*', 'session:*'],
        total_keys_warmed: 1500,
        duration_ms: 2500,
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await metricsApi.warmCache(['user:*', 'session:*']);

      expect(mockClient.post).toHaveBeenCalledWith('/metrics/cache/warm', {
        patterns: ['user:*', 'session:*'],
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return mock response when cache warming endpoint does not exist', async () => {
      mockClient.post.mockRejectedValue(new Error('Endpoint not found'));

      const result = await metricsApi.warmCache(['user:*']);

      expect(result).toEqual({
        warmed_patterns: ['user:*'],
        total_keys_warmed: 0,
        duration_ms: 0,
      });
    });
  });
});
