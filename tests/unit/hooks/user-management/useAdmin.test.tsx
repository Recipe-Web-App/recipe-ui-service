import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useUserStats,
  useClearCache,
  useHealthCheck,
  useReadinessCheck,
  useComprehensiveHealth,
  usePerformanceMetrics,
  useHealthMonitor,
  useHealthSummary,
} from '@/hooks/user-management/useAdmin';
import { adminApi, healthApi, metricsApi } from '@/lib/api/user-management';
import type {
  UserStatsResponse,
  LivenessResponse,
  ReadinessResponse,
  ComprehensiveHealthResponse,
  PerformanceMetrics,
  CacheClearResponse,
} from '@/types/user-management';

// Mock the APIs
jest.mock('@/lib/api/user-management', () => ({
  adminApi: {
    getUserStats: jest.fn(),
    clearCache: jest.fn(),
  },
  healthApi: {
    getHealthCheck: jest.fn(),
    getReadinessCheck: jest.fn(),
    getComprehensiveHealth: jest.fn(),
    monitorHealth: jest.fn(),
    getHealthSummary: jest.fn(),
  },
  metricsApi: {
    getPerformanceMetrics: jest.fn(),
  },
}));

const mockedAdminApi = adminApi as jest.Mocked<typeof adminApi>;
const mockedHealthApi = healthApi as jest.Mocked<typeof healthApi>;
const mockedMetricsApi = metricsApi as jest.Mocked<typeof metricsApi>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAdmin hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUserStats', () => {
    it('should fetch user statistics', async () => {
      const mockUserStats: UserStatsResponse = {
        totalUsers: 1000,
        activeUsers: 750,
        inactiveUsers: 250,
        newUsersToday: 25,
        newUsersThisWeek: 150,
        newUsersThisMonth: 500,
      };

      mockedAdminApi.getUserStats.mockResolvedValue(mockUserStats);

      const { result } = renderHook(() => useUserStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAdminApi.getUserStats).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockUserStats);
    });

    it('should handle user stats fetch error', async () => {
      const error = new Error('Unauthorized');
      mockedAdminApi.getUserStats.mockRejectedValue(error);

      const { result } = renderHook(() => useUserStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useClearCache', () => {
    it('should clear cache successfully', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'Cache cleared successfully',
        clearedCount: 150,
      };

      mockedAdminApi.clearCache.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useClearCache(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ keyPattern: 'user:*' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAdminApi.clearCache).toHaveBeenCalledWith({
        keyPattern: 'user:*',
      });
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should clear all cache when no request provided', async () => {
      const mockResponse: CacheClearResponse = {
        message: 'All cache cleared',
        clearedCount: 500,
      };

      mockedAdminApi.clearCache.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useClearCache(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(undefined);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAdminApi.clearCache).toHaveBeenCalledWith(undefined);
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle cache clear error', async () => {
      const error = new Error('Unauthorized');
      mockedAdminApi.clearCache.mockRejectedValue(error);

      const { result } = renderHook(() => useClearCache(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ keyPattern: 'session:*' });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useHealthCheck', () => {
    it('should perform basic health/liveness check', async () => {
      const mockHealthResponse: LivenessResponse = {
        status: 'UP',
      };

      mockedHealthApi.getHealthCheck.mockResolvedValue(mockHealthResponse);

      const { result } = renderHook(() => useHealthCheck(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getHealthCheck).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockHealthResponse);
    });
  });

  describe('useReadinessCheck', () => {
    it('should perform readiness check', async () => {
      const mockReadinessResponse: ReadinessResponse = {
        status: 'READY',
        database: {
          status: 'healthy',
        },
        redis: {
          status: 'healthy',
        },
      };

      mockedHealthApi.getReadinessCheck.mockResolvedValue(
        mockReadinessResponse
      );

      const { result } = renderHook(() => useReadinessCheck(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getReadinessCheck).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockReadinessResponse);
    });

    it('should handle degraded readiness status', async () => {
      const mockReadinessResponse: ReadinessResponse = {
        status: 'DEGRADED',
        database: {
          status: 'unhealthy',
          message: 'Database connection timeout',
        },
        redis: {
          status: 'healthy',
        },
      };

      mockedHealthApi.getReadinessCheck.mockResolvedValue(
        mockReadinessResponse
      );

      const { result } = renderHook(() => useReadinessCheck(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.status).toBe('DEGRADED');
    });
  });

  describe('useComprehensiveHealth', () => {
    it('should perform comprehensive health check', async () => {
      const mockComprehensiveHealth: ComprehensiveHealthResponse = {
        overallStatus: 'healthy',
        timestamp: '2023-01-08T04:00:00Z',
        uptimeSeconds: 86400,
        version: '1.0.0',
        environment: 'production',
        services: {
          database: {
            status: 'healthy',
            responseTimeMs: 10,
            activeConnections: 50,
            maxConnections: 100,
          },
          redis: {
            status: 'healthy',
            responseTimeMs: 5,
            memoryUsage: '256MB',
            connectedClients: 10,
            hitRatePercent: 95,
          },
        },
      };

      mockedHealthApi.getComprehensiveHealth.mockResolvedValue(
        mockComprehensiveHealth
      );

      const { result } = renderHook(() => useComprehensiveHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getComprehensiveHealth).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockComprehensiveHealth);
    });
  });

  describe('usePerformanceMetrics', () => {
    it('should fetch performance metrics', async () => {
      const mockPerformanceMetrics: PerformanceMetrics = {
        responseTimes: {
          averageMs: 150,
          p50Ms: 120,
          p95Ms: 300,
          p99Ms: 500,
        },
        requestCounts: {
          totalRequests: 100000,
        },
        errorRates: {
          totalErrors: 500,
          errorRatePercent: 0.5,
          '4xxErrors': 300,
          '5xxErrors': 200,
        },
        database: {
          activeConnections: 50,
          maxConnections: 100,
        },
      };

      mockedMetricsApi.getPerformanceMetrics.mockResolvedValue(
        mockPerformanceMetrics
      );

      const { result } = renderHook(() => usePerformanceMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMetricsApi.getPerformanceMetrics).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockPerformanceMetrics);
    });
  });

  describe('useHealthMonitor', () => {
    it('should continuously monitor health with interval', async () => {
      const mockMonitorResponse = {
        isHealthy: true,
        health: {
          status: 'UP' as const,
        },
        attempts: 1,
      };

      mockedHealthApi.monitorHealth.mockResolvedValue(mockMonitorResponse);

      const { result } = renderHook(() => useHealthMonitor(3, 1000), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.monitorHealth).toHaveBeenCalledWith({
        retries: 3,
        retryDelay: 1000,
      });
      expect(result.current.data).toEqual(mockMonitorResponse);
    });

    it('should monitor with default parameters', async () => {
      const mockMonitorResponse = {
        isHealthy: true,
        health: {
          status: 'UP' as const,
        },
        attempts: 1,
      };

      mockedHealthApi.monitorHealth.mockResolvedValue(mockMonitorResponse);

      const { result } = renderHook(() => useHealthMonitor(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.monitorHealth).toHaveBeenCalledWith({
        retries: undefined,
        retryDelay: undefined,
      });
      expect(result.current.data).toEqual(mockMonitorResponse);
    });
  });

  describe('useHealthSummary', () => {
    it('should fetch health summary with comprehensive data', async () => {
      const mockHealthSummary = {
        liveness: {
          status: 'UP' as const,
        },
        readiness: {
          status: 'READY' as const,
          database: {
            status: 'healthy',
          },
          redis: {
            status: 'healthy',
          },
        },
        uptime: {
          uptimeSeconds: 172800,
          uptimeHuman: '2d',
        },
      };

      mockedHealthApi.getHealthSummary.mockResolvedValue(mockHealthSummary);

      const { result } = renderHook(() => useHealthSummary(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getHealthSummary).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockHealthSummary);
    });

    it('should handle health summary error', async () => {
      const error = new Error('Health check failed');
      mockedHealthApi.getHealthSummary.mockRejectedValue(error);

      const { result } = renderHook(() => useHealthSummary(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });
});
