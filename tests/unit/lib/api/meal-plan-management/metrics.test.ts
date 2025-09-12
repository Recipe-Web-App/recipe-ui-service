import { metricsApi } from '@/lib/api/meal-plan-management/metrics';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';

// Mock the client
jest.mock('@/lib/api/meal-plan-management/client', () => ({
  mealPlanManagementClient: {
    get: jest.fn(),
  },
  handleMealPlanManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = mealPlanManagementClient as jest.Mocked<
  typeof mealPlanManagementClient
>;

describe('Metrics API', () => {
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

  describe('getMetrics', () => {
    it('should get Prometheus metrics successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockMetricsData });

      const result = await metricsApi.getMetrics();

      expect(mockedClient.get).toHaveBeenCalledWith('/metrics', {
        headers: {
          Accept: 'text/plain',
        },
      });
      expect(result).toEqual(mockMetricsData);
    });

    it('should handle get metrics error', async () => {
      const error = new Error('Metrics unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(metricsApi.getMetrics()).rejects.toThrow(error);
    });
  });
});
