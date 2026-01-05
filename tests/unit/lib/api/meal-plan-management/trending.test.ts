import { trendingApi } from '@/lib/api/meal-plan-management/trending';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';
import type {
  MealPlanResponseDto,
  PaginatedMealPlansResponse,
} from '@/types/meal-plan-management';

// Mock the client
jest.mock('@/lib/api/meal-plan-management/client', () => ({
  mealPlanManagementClient: {
    get: jest.fn(),
  },
  handleMealPlanManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/meal-plan-management/client')
    .buildQueryParams,
}));

const mockedClient = mealPlanManagementClient as jest.Mocked<
  typeof mealPlanManagementClient
>;

describe('Trending API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMealPlanDto: MealPlanResponseDto = {
    id: 'meal-plan-1',
    userId: 'user-123',
    name: 'Trending Weekly Plan',
    description: 'Most popular meal plan this week',
    startDate: '2024-03-11',
    endDate: '2024-03-17',
    isActive: true,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    recipeCount: 14,
    durationDays: 7,
    tags: [
      { tagId: 'tag-1', name: 'Popular' },
      { tagId: 'tag-2', name: 'Weekly' },
    ],
  };

  const mockPaginatedResponse: PaginatedMealPlansResponse = {
    success: true,
    data: [mockMealPlanDto],
    meta: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  describe('getTrendingMealPlans', () => {
    it('should get trending meal plans without params', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await trendingApi.getTrendingMealPlans();

      expect(mockedClient.get).toHaveBeenCalledWith('/meal-plans/trending');
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should get trending meal plans with pagination params', async () => {
      const params = {
        page: 2,
        limit: 10,
      };

      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await trendingApi.getTrendingMealPlans(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans/trending?page=2&limit=10'
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return meal plans ordered by trending score', async () => {
      const trendingMealPlans: MealPlanResponseDto[] = [
        { ...mockMealPlanDto, id: 'most-trending', name: 'Most Trending' },
        { ...mockMealPlanDto, id: 'second-trending', name: 'Second Trending' },
        { ...mockMealPlanDto, id: 'third-trending', name: 'Third Trending' },
      ];

      const orderedResponse: PaginatedMealPlansResponse = {
        ...mockPaginatedResponse,
        data: trendingMealPlans,
        meta: { ...mockPaginatedResponse.meta, total: 3 },
      };

      mockedClient.get.mockResolvedValue({ data: orderedResponse });

      const result = await trendingApi.getTrendingMealPlans();

      // First item should be the most trending
      expect(result.data[0].name).toBe('Most Trending');
      expect(result.data.length).toBe(3);
    });

    it('should handle get trending error', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(trendingApi.getTrendingMealPlans()).rejects.toThrow(error);
    });

    it('should handle empty trending results', async () => {
      const emptyResponse: PaginatedMealPlansResponse = {
        success: true,
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };

      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await trendingApi.getTrendingMealPlans();

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });
});
