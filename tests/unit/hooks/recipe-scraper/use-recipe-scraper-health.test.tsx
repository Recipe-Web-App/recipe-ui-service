import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/recipe-scraper';
import {
  useRecipeScraperRoot,
  useRecipeScraperMetrics,
  useRecipeScraperLiveness,
  useRecipeScraperReadiness,
  useRecipeScraperHealth,
  useRecipeScraperLegacyHealth,
} from '@/hooks/recipe-scraper/use-recipe-scraper-health';
import type { HealthCheckResponse } from '@/types/recipe-scraper';

// Mock the API module
jest.mock('@/lib/api/recipe-scraper', () => ({
  healthApi: {
    getRoot: jest.fn(),
    getMetrics: jest.fn(),
    getLiveness: jest.fn(),
    getReadiness: jest.fn(),
    getHealth: jest.fn(),
    getLegacyHealth: jest.fn(),
  },
}));

const mockedHealthApi = healthApi as jest.Mocked<typeof healthApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRecipeScraperRoot', () => {
  it('should fetch root service information', async () => {
    const mockData = {
      service: 'Recipe Scraper Service',
      version: '2.0.0',
      status: 'operational',
      docs: '/docs',
      health: '/api/v1/health',
    };

    mockedHealthApi.getRoot.mockResolvedValueOnce(mockData);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperRoot(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedHealthApi.getRoot).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching root service information', async () => {
    const error = new Error('Service unavailable');
    mockedHealthApi.getRoot.mockRejectedValueOnce(error);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperRoot(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useRecipeScraperMetrics', () => {
  it('should fetch Prometheus metrics', async () => {
    const mockMetrics =
      '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total{method="GET",endpoint="/api/health"} 42';

    mockedHealthApi.getMetrics.mockResolvedValueOnce(mockMetrics);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperMetrics(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMetrics);
    expect(mockedHealthApi.getMetrics).toHaveBeenCalledTimes(1);
  });
});

describe('useRecipeScraperLiveness', () => {
  it('should fetch liveness check status', async () => {
    const mockData = {
      status: 'alive',
      timestamp: '2025-01-31T12:00:00Z',
      service: 'recipe-scraper-service',
    };

    mockedHealthApi.getLiveness.mockResolvedValueOnce(mockData);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperLiveness(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedHealthApi.getLiveness).toHaveBeenCalledTimes(1);
  });
});

describe('useRecipeScraperReadiness', () => {
  it('should fetch readiness check status', async () => {
    const mockData = {
      status: 'ready' as const,
      timestamp: '2025-01-31T12:00:00Z',
      checks: {
        database: {
          status: 'healthy' as const,
          responseTimeMs: 45.2,
          message: 'Database connection is healthy',
        },
      },
      message: 'Service ready',
    };

    mockedHealthApi.getReadiness.mockResolvedValueOnce(mockData);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperReadiness(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedHealthApi.getReadiness).toHaveBeenCalledTimes(1);
  });
});

describe('useRecipeScraperHealth', () => {
  it('should fetch comprehensive health check status', async () => {
    const mockData: HealthCheckResponse = {
      status: 'healthy',
      timestamp: '2025-01-31T12:00:00Z',
      version: '2.0.0',
      uptimeSeconds: 3600,
      checks: {
        database: {
          status: 'healthy',
          responseTimeMs: 25.5,
          message: 'Database connection is healthy',
        },
        cache: {
          status: 'healthy',
          responseTimeMs: 5.2,
          message: 'Cache is operational',
        },
        externalApis: {
          spoonacular: {
            status: 'healthy',
            responseTimeMs: 150.8,
            message: 'Spoonacular API is responsive',
          },
        },
      },
      databaseMonitoring: {
        enabled: true,
        lastCheck: '2025-01-31T12:00:00Z',
      },
      responseTimeMs: 45.2,
    };

    mockedHealthApi.getHealth.mockResolvedValueOnce(mockData);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperHealth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedHealthApi.getHealth).toHaveBeenCalledTimes(1);
  });
});

describe('useRecipeScraperLegacyHealth', () => {
  it('should fetch legacy health check status', async () => {
    const mockData = {
      status: 'ok',
    };

    mockedHealthApi.getLegacyHealth.mockResolvedValueOnce(mockData);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useRecipeScraperLegacyHealth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedHealthApi.getLegacyHealth).toHaveBeenCalledTimes(1);
  });
});

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
