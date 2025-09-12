import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useMealPlanMetrics } from '@/hooks/meal-plan-management/use-metrics';
import { metricsApi } from '@/lib/api/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  metricsApi: {
    getMetrics: jest.fn(),
  },
}));

const mockedMetricsApi = metricsApi as jest.Mocked<typeof metricsApi>;

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

describe('Metrics Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMetricsData = `
# HELP meal_plan_service_http_requests_total Total number of HTTP requests
# TYPE meal_plan_service_http_requests_total counter
meal_plan_service_http_requests_total{method="GET",route="/api/v1/meal-plans",status_code="200"} 45

# HELP meal_plan_service_meal_plans_created_total Total number of meal plans created
# TYPE meal_plan_service_meal_plans_created_total counter
meal_plan_service_meal_plans_created_total{user_id="user123"} 12
`;

  describe('useMealPlanMetrics', () => {
    it('should fetch metrics successfully', async () => {
      mockedMetricsApi.getMetrics.mockResolvedValue(mockMetricsData);

      const { result } = renderHook(() => useMealPlanMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMetricsApi.getMetrics).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockMetricsData);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMealPlanMetrics(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedMetricsApi.getMetrics).not.toHaveBeenCalled();
    });

    it('should parse metrics data correctly', async () => {
      mockedMetricsApi.getMetrics.mockResolvedValue(mockMetricsData);

      const { result } = renderHook(() => useMealPlanMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(typeof result.current.data).toBe('string');
      expect(result.current.data).toContain(
        'meal_plan_service_http_requests_total'
      );
      expect(result.current.data).toContain(
        'meal_plan_service_meal_plans_created_total'
      );
    });

    it('should handle empty metrics data', async () => {
      mockedMetricsApi.getMetrics.mockResolvedValue('');

      const { result } = renderHook(() => useMealPlanMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBe('');
    });

    it('should be enabled by default', () => {
      const { result } = renderHook(() => useMealPlanMetrics(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(true);
      expect(mockedMetricsApi.getMetrics).toHaveBeenCalled();
    });
  });
});
