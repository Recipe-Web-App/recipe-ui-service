import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useMealPlanHealth,
  useMealPlanReadiness,
  useMealPlanLiveness,
  useMealPlanVersion,
  useMealPlanStatus,
  useMealPlanHealthMonitor,
  useIsMealPlanServiceOperational,
  useMealPlanHealthComponents,
} from '@/hooks/meal-plan-management/use-health';
import { healthApi } from '@/lib/api/meal-plan-management';
import type {
  HealthCheckResult,
  VersionInfo,
} from '@/types/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  healthApi: {
    getHealth: jest.fn(),
    getReadiness: jest.fn(),
    getLiveness: jest.fn(),
    getVersion: jest.fn(),
  },
}));

const mockedHealthApi = healthApi as jest.Mocked<typeof healthApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: { retry: false },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Health Hooks', () => {
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

  describe('useMealPlanHealth', () => {
    it('should fetch health status successfully', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getHealth).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockHealthResult);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMealPlanHealth(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedHealthApi.getHealth).not.toHaveBeenCalled();
    });
  });

  describe('useMealPlanReadiness', () => {
    it('should fetch readiness status successfully', async () => {
      mockedHealthApi.getReadiness.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanReadiness(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getReadiness).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockHealthResult);
    });
  });

  describe('useMealPlanLiveness', () => {
    it('should fetch liveness status successfully', async () => {
      mockedHealthApi.getLiveness.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanLiveness(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getLiveness).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockHealthResult);
    });
  });

  describe('useMealPlanVersion', () => {
    it('should fetch version info successfully', async () => {
      mockedHealthApi.getVersion.mockResolvedValue(mockVersionInfo);

      const { result } = renderHook(() => useMealPlanVersion(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getVersion).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockVersionInfo);
    });
  });

  describe('useMealPlanStatus', () => {
    it('should combine all health checks successfully', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthResult);
      mockedHealthApi.getReadiness.mockResolvedValue(mockHealthResult);
      mockedHealthApi.getLiveness.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isHealthy).toBe(true));

      expect(result.current.overallStatus).toBe('ok');
      expect(result.current.isReady).toBe(true);
      expect(result.current.isLive).toBe(true);
    });

    it('should show error status when any check fails', async () => {
      const errorResult: HealthCheckResult = {
        status: 'error',
        info: {},
        error: { database: { status: 'down' } },
        details: { database: { status: 'down' } },
      };

      mockedHealthApi.getHealth.mockResolvedValue(errorResult);
      mockedHealthApi.getReadiness.mockResolvedValue(mockHealthResult);
      mockedHealthApi.getLiveness.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isHealthy).toBe(false));

      expect(result.current.overallStatus).toBe('error');
    });
  });

  describe('useMealPlanHealthMonitor', () => {
    it('should monitor health with default options', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanHealthMonitor(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isHealthy).toBe(true);
      expect(result.current.status).toBe('ok');
    });

    it('should monitor health with custom options', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(
        () =>
          useMealPlanHealthMonitor({
            enabled: true,
            refetchInterval: 30000,
            staleTime: 15000,
          }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isHealthy).toBe(true);
    });
  });

  describe('useIsMealPlanServiceOperational', () => {
    it('should return operational status', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthResult);
      mockedHealthApi.getReadiness.mockResolvedValue(mockHealthResult);
      mockedHealthApi.getLiveness.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useIsMealPlanServiceOperational(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isOperational).toBe(true));

      expect(result.current.status).toBe('ok');
    });
  });

  describe('useMealPlanHealthComponents', () => {
    it('should return health component details', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthResult);

      const { result } = renderHook(() => useMealPlanHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toBeDefined();
      expect(result.current.totalComponents).toBe(2);
      expect(result.current.healthyComponents).toHaveLength(2);
      expect(result.current.unhealthyComponents).toHaveLength(0);
    });

    it('should handle empty health components', async () => {
      const emptyHealthResult: HealthCheckResult = {
        status: 'ok',
        info: {},
        error: {},
        details: {},
      };

      mockedHealthApi.getHealth.mockResolvedValue(emptyHealthResult);

      const { result } = renderHook(() => useMealPlanHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toEqual([]);
      expect(result.current.totalComponents).toBe(0);
    });
  });
});
