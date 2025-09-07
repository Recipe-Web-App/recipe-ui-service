import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useUserStats,
  useForceLogout,
  useBatchForceLogout,
  useHealthCheck,
  useComprehensiveHealth,
  usePerformanceMetrics,
  useHealthMonitor,
  useHealthSummary,
} from '@/hooks/user-management/useAdmin';
import { adminApi, healthApi, metricsApi } from '@/lib/api/user-management';
import type {
  UserStatsResponse,
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  PerformanceMetrics,
} from '@/types/user-management';

// Mock the APIs
jest.mock('@/lib/api/user-management', () => ({
  adminApi: {
    getUserStats: jest.fn(),
    forceUserLogout: jest.fn(),
    batchForceLogout: jest.fn(),
  },
  healthApi: {
    getHealthCheck: jest.fn(),
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
        total_users: 1000,
        active_users: 750,
        new_users_today: 25,
        new_users_this_week: 150,
        new_users_this_month: 500,
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

  describe('useForceLogout', () => {
    it('should force logout a single user', async () => {
      const mockResponse = {
        message: 'User logged out successfully',
        userId: 'user-123',
        success: true,
      };

      mockedAdminApi.forceUserLogout.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useForceLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('user-123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAdminApi.forceUserLogout).toHaveBeenCalledWith('user-123');
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle force logout error', async () => {
      const error = new Error('User not found');
      mockedAdminApi.forceUserLogout.mockRejectedValue(error);

      const { result } = renderHook(() => useForceLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('nonexistent-user');

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('useBatchForceLogout', () => {
    it('should force logout multiple users', async () => {
      const mockResponse = {
        successful: ['user-123', 'user-456', 'user-789'],
        failed: [],
        summary: {
          total: 3,
          successful: 3,
          failed: 0,
        },
      };

      mockedAdminApi.batchForceLogout.mockResolvedValue(mockResponse);

      const userIds = ['user-123', 'user-456', 'user-789'];
      const { result } = renderHook(() => useBatchForceLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(userIds);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAdminApi.batchForceLogout).toHaveBeenCalledWith(userIds);
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle partial batch logout failures', async () => {
      const mockResponse = {
        successful: ['user-123', 'user-456'],
        failed: [{ userId: 'user-789', error: 'User not found' }],
        summary: {
          total: 3,
          successful: 2,
          failed: 1,
        },
      };

      mockedAdminApi.batchForceLogout.mockResolvedValue(mockResponse);

      const userIds = ['user-123', 'user-456', 'user-789'];
      const { result } = renderHook(() => useBatchForceLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(userIds);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAdminApi.batchForceLogout).toHaveBeenCalledWith(userIds);
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useHealthCheck', () => {
    it('should perform basic health check', async () => {
      const mockHealthResponse: HealthCheckResponse = {
        status: 'healthy',
        message: 'Mock Health Check',
        timestamp: '2023-01-08T04:00:00Z',
        uptime_seconds: 3600,
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

  describe('useComprehensiveHealth', () => {
    it('should perform comprehensive health check', async () => {
      const mockComprehensiveHealth: ComprehensiveHealthResponse = {
        overall_status: 'healthy',
        timestamp: '2023-01-08T04:00:00Z',
        uptime_seconds: 86400,
        version: '1.0.0',
        environment: 'production',
        services: {
          database: {
            status: 'healthy',
            response_time_ms: 10,
            last_check: '2023-01-08T04:00:00Z',
          },
          redis: {
            status: 'healthy',
            response_time_ms: 5,
            last_check: '2023-01-08T04:00:00Z',
          },
          external_services: [
            {
              name: 'Mock Service',
              url: 'https://mockservice.com/api/health',
              status: 'healthy',
              response_time_ms: 100,
              last_check: '2023-01-08T04:00:00Z',
              error_message: undefined,
            },
          ],
        },
        system_resources: {
          cpu_usage_percent: 55.5,
          memory_usage_percent: 70.2,
          disk_usage_percent: 80.1,
        },
        application_health: {
          active_sessions: 100,
          request_rate_per_minute: 200,
          error_rate_percent: 0.5,
          avg_response_time_ms: 150,
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
        response_times: {
          average_ms: 150,
          p50_ms: 120,
          p95_ms: 300,
          p99_ms: 500,
        },
        request_counts: {
          total_requests: 100000,
          requests_per_minute: 200,
          active_sessions: 100,
        },
        error_rates: {
          total_errors: 500,
          error_rate_percent: 0.5,
          '4xx_errors': 300,
          '5xx_errors': 200,
        },
        database: {
          active_connections: 50,
          max_connections: 100,
          avg_query_time_ms: 20,
          slow_queries_count: 5,
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
          status: 'healthy' as const,
          timestamp: '2023-01-08T04:00:00Z',
          uptime: 3600,
          version: '1.0.0',
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
          status: 'healthy' as const,
          timestamp: '2023-01-08T04:00:00Z',
          uptime: 3600,
          version: '1.0.0',
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
        basic: {
          status: 'healthy' as const,
          message: 'System is healthy',
          timestamp: '2023-01-08T04:00:00Z',
          uptime_seconds: 172800,
        },
        uptime: {
          uptime_seconds: 172800,
          uptime_human: '2 days',
        },
        readiness: {
          status: 'ready' as const,
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
