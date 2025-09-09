import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRecipeManagementHealth,
  useRecipeManagementReadiness,
  useRecipeManagementLiveness,
  useRecipeManagementStatus,
  useRecipeManagementHealthMonitor,
  useIsServiceOperational,
  useHealthComponents,
} from '@/hooks/recipe-management/useHealth';
import { healthApi } from '@/lib/api/recipe-management';
import {
  RecipeManagementHealthStatus,
  type RecipeManagementHealthResponse,
} from '@/types/recipe-management';

// Mock the API
jest.mock('@/lib/api/recipe-management', () => ({
  healthApi: {
    getHealth: jest.fn(),
    getReadiness: jest.fn(),
    getLiveness: jest.fn(),
  },
}));

const mockedHealthApi = healthApi as jest.Mocked<typeof healthApi>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useHealth hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHealthyResponse: RecipeManagementHealthResponse = {
    status: RecipeManagementHealthStatus.UP,
    components: {
      db: {
        status: RecipeManagementHealthStatus.UP,
        details: {
          database: 'PostgreSQL',
          validationQuery: 'isValid()',
          result: 1,
        },
      },
      diskSpace: {
        status: RecipeManagementHealthStatus.UP,
        details: {
          total: 249769230336,
          free: 137460244480,
          threshold: 10485760,
          path: '/tmp/recipe-management',
          exists: true,
        },
      },
      redis: {
        status: RecipeManagementHealthStatus.UP,
        details: {
          version: '7.0.8',
          mode: 'standalone',
        },
      },
    },
  };

  const mockUnhealthyResponse: RecipeManagementHealthResponse = {
    status: RecipeManagementHealthStatus.DOWN,
    components: {
      db: {
        status: RecipeManagementHealthStatus.DOWN,
        details: {
          error: 'Connection refused',
        },
      },
      redis: {
        status: RecipeManagementHealthStatus.DOWN,
        details: {
          error: 'Redis connection timeout',
        },
      },
    },
  };

  describe('useRecipeManagementHealth', () => {
    it('should fetch health status successfully', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);

      const { result } = renderHook(() => useRecipeManagementHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getHealth).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockHealthyResponse);
    });

    it('should respect enabled parameter', () => {
      const { result } = renderHook(() => useRecipeManagementHealth(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedHealthApi.getHealth).not.toHaveBeenCalled();
    });
  });

  describe('useRecipeManagementReadiness', () => {
    it('should fetch readiness status successfully', async () => {
      const readinessResponse: RecipeManagementHealthResponse = {
        status: RecipeManagementHealthStatus.UP,
        components: {
          readinessState: {
            status: RecipeManagementHealthStatus.UP,
            details: {
              ready: true,
            },
          },
        },
      };

      mockedHealthApi.getReadiness.mockResolvedValue(readinessResponse);

      const { result } = renderHook(() => useRecipeManagementReadiness(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getReadiness).toHaveBeenCalled();
      expect(result.current.data).toEqual(readinessResponse);
    });

    it('should handle unready state', async () => {
      const unreadyResponse: RecipeManagementHealthResponse = {
        status: RecipeManagementHealthStatus.DOWN,
        components: {
          readinessState: {
            status: RecipeManagementHealthStatus.DOWN,
            details: {
              ready: false,
              reason: 'Database migration in progress',
            },
          },
        },
      };

      mockedHealthApi.getReadiness.mockResolvedValue(unreadyResponse);

      const { result } = renderHook(() => useRecipeManagementReadiness(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.status).toBe('DOWN');
    });

    it('should respect enabled parameter', () => {
      const { result } = renderHook(() => useRecipeManagementReadiness(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedHealthApi.getReadiness).not.toHaveBeenCalled();
    });
  });

  describe('useRecipeManagementLiveness', () => {
    it('should fetch liveness status successfully', async () => {
      const livenessResponse: RecipeManagementHealthResponse = {
        status: RecipeManagementHealthStatus.UP,
        components: {
          livenessState: {
            status: RecipeManagementHealthStatus.UP,
            details: {
              alive: true,
            },
          },
          ping: {
            status: RecipeManagementHealthStatus.UP,
            details: {},
          },
        },
      };

      mockedHealthApi.getLiveness.mockResolvedValue(livenessResponse);

      const { result } = renderHook(() => useRecipeManagementLiveness(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedHealthApi.getLiveness).toHaveBeenCalled();
      expect(result.current.data).toEqual(livenessResponse);
    });

    it('should handle dead state', async () => {
      const deadResponse: RecipeManagementHealthResponse = {
        status: RecipeManagementHealthStatus.DOWN,
        components: {
          livenessState: {
            status: RecipeManagementHealthStatus.DOWN,
            details: {
              alive: false,
              reason: 'Critical system failure',
            },
          },
        },
      };

      mockedHealthApi.getLiveness.mockResolvedValue(deadResponse);

      const { result } = renderHook(() => useRecipeManagementLiveness(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.status).toBe('DOWN');
    });

    it('should respect enabled parameter', () => {
      const { result } = renderHook(() => useRecipeManagementLiveness(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedHealthApi.getLiveness).not.toHaveBeenCalled();
    });
  });

  describe('useRecipeManagementStatus', () => {
    it('should combine all health checks when healthy', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);
      mockedHealthApi.getReadiness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {
          readinessState: {
            status: RecipeManagementHealthStatus.UP,
            details: { ready: true },
          },
        },
      });
      mockedHealthApi.getLiveness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {
          livenessState: {
            status: RecipeManagementHealthStatus.UP,
            details: { alive: true },
          },
        },
      });

      const { result } = renderHook(() => useRecipeManagementStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.overallStatus).toBe('UP');
      expect(result.current.isHealthy).toBe(true);
      expect(result.current.isReady).toBe(true);
      expect(result.current.isLive).toBe(true);
      expect(result.current.hasError).toBe(false);
    });

    it('should show DOWN when any check fails', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);
      mockedHealthApi.getReadiness.mockResolvedValue({
        status: RecipeManagementHealthStatus.DOWN,
        components: {
          readinessState: {
            status: RecipeManagementHealthStatus.DOWN,
            details: { ready: false },
          },
        },
      });
      mockedHealthApi.getLiveness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {
          livenessState: {
            status: RecipeManagementHealthStatus.UP,
            details: { alive: true },
          },
        },
      });

      const { result } = renderHook(() => useRecipeManagementStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.overallStatus).toBe('DOWN');
      expect(result.current.isHealthy).toBe(true);
      expect(result.current.isReady).toBe(false);
      expect(result.current.isLive).toBe(true);
    });

    it('should respect enabled parameter', () => {
      const { result } = renderHook(() => useRecipeManagementStatus(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockedHealthApi.getHealth).not.toHaveBeenCalled();
      expect(mockedHealthApi.getReadiness).not.toHaveBeenCalled();
      expect(mockedHealthApi.getLiveness).not.toHaveBeenCalled();
    });

    it('should include lastChecked timestamp', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);
      mockedHealthApi.getReadiness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });
      mockedHealthApi.getLiveness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });

      const { result } = renderHook(() => useRecipeManagementStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.lastChecked).toBeDefined();
      expect(new Date(result.current.lastChecked).toISOString()).toBe(
        result.current.lastChecked
      );
    });
  });

  describe('useRecipeManagementHealthMonitor', () => {
    it('should monitor health with default options', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);

      const { result } = renderHook(() => useRecipeManagementHealthMonitor(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isHealthy).toBe(true);
      expect(result.current.status).toBe('UP');
      expect(result.current.components).toEqual(mockHealthyResponse.components);
      expect(result.current.groups).toEqual({});
      expect(result.current.lastChecked).toBeDefined();
    });

    it('should handle unhealthy status', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockUnhealthyResponse);

      const { result } = renderHook(() => useRecipeManagementHealthMonitor(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isHealthy).toBe(false);
      expect(result.current.status).toBe('DOWN');
    });

    it('should use custom options', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);

      const { result } = renderHook(
        () =>
          useRecipeManagementHealthMonitor({
            enabled: true,
            refetchInterval: 5000,
            staleTime: 2000,
          }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockHealthyResponse);
    });

    it('should handle missing data gracefully', async () => {
      const emptyResponse: RecipeManagementHealthResponse = {
        status: RecipeManagementHealthStatus.UNKNOWN,
        components: {},
      };

      mockedHealthApi.getHealth.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useRecipeManagementHealthMonitor(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isHealthy).toBe(false);
      expect(result.current.status).toBe('UNKNOWN');
      expect(result.current.components).toEqual({});
      expect(result.current.groups).toEqual({});
    });

    it('should respect enabled parameter', () => {
      const { result } = renderHook(
        () => useRecipeManagementHealthMonitor({ enabled: false }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedHealthApi.getHealth).not.toHaveBeenCalled();
    });
  });

  describe('useIsServiceOperational', () => {
    it('should return operational when all checks pass', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);
      mockedHealthApi.getReadiness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });
      mockedHealthApi.getLiveness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });

      const { result } = renderHook(() => useIsServiceOperational(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isChecking).toBe(false));

      expect(result.current.isOperational).toBe(true);
      expect(result.current.status).toBe('UP');
    });

    it('should return not operational when any check fails', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockUnhealthyResponse);
      mockedHealthApi.getReadiness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });
      mockedHealthApi.getLiveness.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });

      const { result } = renderHook(() => useIsServiceOperational(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isChecking).toBe(false));

      expect(result.current.isOperational).toBe(false);
      expect(result.current.status).toBe('DOWN');
    });

    it('should show checking state while loading', () => {
      mockedHealthApi.getHealth.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );
      mockedHealthApi.getReadiness.mockImplementation(
        () => new Promise(() => {})
      );
      mockedHealthApi.getLiveness.mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useIsServiceOperational(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isChecking).toBe(true);
      expect(result.current.isOperational).toBe(false);
    });
  });

  describe('useHealthComponents', () => {
    it('should parse health components correctly', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockHealthyResponse);

      const { result } = renderHook(() => useHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toHaveLength(3);
      expect(result.current.healthyComponents).toHaveLength(3);
      expect(result.current.unhealthyComponents).toHaveLength(0);
      expect(result.current.totalComponents).toBe(3);

      const dbComponent = result.current.components.find(c => c.name === 'db');
      expect(dbComponent?.status).toBe(RecipeManagementHealthStatus.UP);
      expect(dbComponent?.details).toEqual(
        mockHealthyResponse.components?.db.details
      );
    });

    it('should identify unhealthy components', async () => {
      mockedHealthApi.getHealth.mockResolvedValue(mockUnhealthyResponse);

      const { result } = renderHook(() => useHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toHaveLength(2);
      expect(result.current.healthyComponents).toHaveLength(0);
      expect(result.current.unhealthyComponents).toHaveLength(2);
      expect(result.current.totalComponents).toBe(2);
    });

    it('should handle missing components gracefully', async () => {
      mockedHealthApi.getHealth.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: undefined,
      });

      const { result } = renderHook(() => useHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toHaveLength(0);
      expect(result.current.healthyComponents).toHaveLength(0);
      expect(result.current.unhealthyComponents).toHaveLength(0);
      expect(result.current.totalComponents).toBe(0);
    });

    it('should handle empty components object', async () => {
      mockedHealthApi.getHealth.mockResolvedValue({
        status: RecipeManagementHealthStatus.UP,
        components: {},
      });

      const { result } = renderHook(() => useHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toHaveLength(0);
      expect(result.current.totalComponents).toBe(0);
    });

    it('should handle mixed healthy and unhealthy components', async () => {
      const mixedResponse: RecipeManagementHealthResponse = {
        status: RecipeManagementHealthStatus.DOWN,
        components: {
          db: {
            status: RecipeManagementHealthStatus.UP,
            details: {},
          },
          redis: {
            status: RecipeManagementHealthStatus.DOWN,
            details: { error: 'Connection timeout' },
          },
          diskSpace: {
            status: RecipeManagementHealthStatus.UP,
            details: {},
          },
        },
      };

      mockedHealthApi.getHealth.mockResolvedValue(mixedResponse);

      const { result } = renderHook(() => useHealthComponents(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.components).toHaveLength(3);
      expect(result.current.healthyComponents).toHaveLength(2);
      expect(result.current.unhealthyComponents).toHaveLength(1);
      expect(result.current.unhealthyComponents[0].name).toBe('redis');
    });
  });
});
