import { favoritesApi } from '@/lib/api/meal-plan-management/favorites';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';
import type {
  MealPlanFavoriteResponseDto,
  MealPlanFavoriteCheckResponseDto,
  PaginatedMealPlanFavoritesResponse,
  MealPlanFavoriteApiResponse,
  MealPlanFavoriteCheckApiResponse,
} from '@/types/meal-plan-management';

// Mock the client
jest.mock('@/lib/api/meal-plan-management/client', () => ({
  mealPlanManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
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

describe('Favorites API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFavoriteDto: MealPlanFavoriteResponseDto = {
    mealPlanId: 'meal-plan-1',
    userId: 'user-123',
    favoritedAt: '2024-03-10T10:00:00Z',
  };

  const mockFavoriteCheckDto: MealPlanFavoriteCheckResponseDto = {
    isFavorited: true,
    favoritedAt: '2024-03-10T10:00:00Z',
  };

  const mockPaginatedResponse: PaginatedMealPlanFavoritesResponse = {
    success: true,
    data: [mockFavoriteDto],
    meta: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  const mockFavoriteApiResponse: MealPlanFavoriteApiResponse = {
    success: true,
    data: mockFavoriteDto,
    message: 'Meal plan added to favorites successfully',
  };

  const mockFavoriteCheckApiResponse: MealPlanFavoriteCheckApiResponse = {
    success: true,
    data: mockFavoriteCheckDto,
  };

  describe('listFavoriteMealPlans', () => {
    it('should list favorite meal plans without params', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await favoritesApi.listFavoriteMealPlans();

      expect(mockedClient.get).toHaveBeenCalledWith('/meal-plans/favorites');
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should list favorite meal plans with all params', async () => {
      const params = {
        page: 2,
        limit: 10,
        includeMealPlan: true,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

      mockedClient.get.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await favoritesApi.listFavoriteMealPlans(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans/favorites?page=2&limit=10&includeMealPlan=true&sortBy=createdAt&sortOrder=desc'
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle list favorites error', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(favoritesApi.listFavoriteMealPlans()).rejects.toThrow(error);
    });
  });

  describe('addMealPlanToFavorites', () => {
    it('should add meal plan to favorites successfully', async () => {
      mockedClient.post.mockResolvedValue({ data: mockFavoriteApiResponse });

      const result = await favoritesApi.addMealPlanToFavorites('meal-plan-1');

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/meal-plans/favorites/meal-plan-1'
      );
      expect(result).toEqual(mockFavoriteApiResponse);
    });

    it('should handle add to favorites error', async () => {
      const error = new Error('Already favorited');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        favoritesApi.addMealPlanToFavorites('meal-plan-1')
      ).rejects.toThrow(error);
    });
  });

  describe('checkMealPlanFavorite', () => {
    it('should check meal plan favorite status successfully', async () => {
      mockedClient.get.mockResolvedValue({
        data: mockFavoriteCheckApiResponse,
      });

      const result = await favoritesApi.checkMealPlanFavorite('meal-plan-1');

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/meal-plans/favorites/meal-plan-1'
      );
      expect(result).toEqual(mockFavoriteCheckApiResponse);
    });

    it('should return not favorited status', async () => {
      const notFavoritedResponse: MealPlanFavoriteCheckApiResponse = {
        success: true,
        data: {
          isFavorited: false,
          favoritedAt: null,
        },
      };

      mockedClient.get.mockResolvedValue({ data: notFavoritedResponse });

      const result = await favoritesApi.checkMealPlanFavorite('meal-plan-2');

      expect(result.data.isFavorited).toBe(false);
      expect(result.data.favoritedAt).toBeNull();
    });

    it('should handle check favorite error', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(
        favoritesApi.checkMealPlanFavorite('meal-plan-1')
      ).rejects.toThrow(error);
    });
  });

  describe('removeMealPlanFromFavorites', () => {
    it('should remove meal plan from favorites successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: null });

      await favoritesApi.removeMealPlanFromFavorites('meal-plan-1');

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/meal-plans/favorites/meal-plan-1'
      );
    });

    it('should handle remove from favorites error', async () => {
      const error = new Error('Not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        favoritesApi.removeMealPlanFromFavorites('meal-plan-1')
      ).rejects.toThrow(error);
    });
  });
});
