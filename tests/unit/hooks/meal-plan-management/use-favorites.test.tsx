import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useFavoriteMealPlans,
  useMealPlanFavoriteStatus,
  useAddMealPlanToFavorites,
  useRemoveMealPlanFromFavorites,
  useToggleMealPlanFavorite,
  useInvalidateFavorites,
} from '@/hooks/meal-plan-management/use-favorites';
import { favoritesApi } from '@/lib/api/meal-plan-management';
import type {
  MealPlanFavoriteResponseDto,
  MealPlanFavoriteCheckResponseDto,
  PaginatedMealPlanFavoritesResponse,
  MealPlanFavoriteApiResponse,
  MealPlanFavoriteCheckApiResponse,
} from '@/types/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  favoritesApi: {
    listFavoriteMealPlans: jest.fn(),
    addMealPlanToFavorites: jest.fn(),
    checkMealPlanFavorite: jest.fn(),
    removeMealPlanFromFavorites: jest.fn(),
  },
}));

const mockedFavoritesApi = favoritesApi as jest.Mocked<typeof favoritesApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Favorites Hooks', () => {
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

  describe('useFavoriteMealPlans', () => {
    it('should fetch favorite meal plans successfully', async () => {
      mockedFavoritesApi.listFavoriteMealPlans.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => useFavoriteMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedFavoritesApi.listFavoriteMealPlans).toHaveBeenCalledWith(
        undefined
      );
      expect(result.current.data).toEqual(mockPaginatedResponse);
    });

    it('should fetch favorites with parameters', async () => {
      const params = {
        page: 2,
        limit: 10,
        includeMealPlan: true,
        sortBy: 'createdAt' as const,
      };

      mockedFavoritesApi.listFavoriteMealPlans.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => useFavoriteMealPlans(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedFavoritesApi.listFavoriteMealPlans).toHaveBeenCalledWith(
        params
      );
    });

    it('should handle fetch favorites error', async () => {
      const error = new Error('Network error');
      mockedFavoritesApi.listFavoriteMealPlans.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useMealPlanFavoriteStatus', () => {
    it('should check favorite status successfully', async () => {
      mockedFavoritesApi.checkMealPlanFavorite.mockResolvedValue(
        mockFavoriteCheckApiResponse
      );

      const { result } = renderHook(
        () => useMealPlanFavoriteStatus('meal-plan-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedFavoritesApi.checkMealPlanFavorite).toHaveBeenCalledWith(
        'meal-plan-1'
      );
      expect(result.current.data).toEqual(mockFavoriteCheckApiResponse);
    });

    it('should not fetch when mealPlanId is empty', () => {
      const { result } = renderHook(() => useMealPlanFavoriteStatus(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedFavoritesApi.checkMealPlanFavorite).not.toHaveBeenCalled();
    });

    it('should not fetch when enabled is false', () => {
      const { result } = renderHook(
        () => useMealPlanFavoriteStatus('meal-plan-1', false),
        { wrapper: createWrapper() }
      );

      expect(result.current.isFetching).toBe(false);
      expect(mockedFavoritesApi.checkMealPlanFavorite).not.toHaveBeenCalled();
    });
  });

  describe('useAddMealPlanToFavorites', () => {
    it('should add to favorites successfully', async () => {
      mockedFavoritesApi.addMealPlanToFavorites.mockResolvedValue(
        mockFavoriteApiResponse
      );

      const { result } = renderHook(() => useAddMealPlanToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('meal-plan-1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedFavoritesApi.addMealPlanToFavorites).toHaveBeenCalledWith(
        'meal-plan-1'
      );
      expect(result.current.data).toEqual(mockFavoriteApiResponse);
    });

    it('should handle add to favorites error', async () => {
      const error = new Error('Already favorited');
      mockedFavoritesApi.addMealPlanToFavorites.mockRejectedValue(error);

      const { result } = renderHook(() => useAddMealPlanToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('meal-plan-1');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useRemoveMealPlanFromFavorites', () => {
    it('should remove from favorites successfully', async () => {
      mockedFavoritesApi.removeMealPlanFromFavorites.mockResolvedValue();

      const { result } = renderHook(() => useRemoveMealPlanFromFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('meal-plan-1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedFavoritesApi.removeMealPlanFromFavorites
      ).toHaveBeenCalledWith('meal-plan-1');
    });

    it('should handle remove from favorites error', async () => {
      const error = new Error('Not found');
      mockedFavoritesApi.removeMealPlanFromFavorites.mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveMealPlanFromFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('meal-plan-1');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useToggleMealPlanFavorite', () => {
    it('should add to favorites when not favorited', async () => {
      mockedFavoritesApi.addMealPlanToFavorites.mockResolvedValue(
        mockFavoriteApiResponse
      );

      const { result } = renderHook(() => useToggleMealPlanFavorite(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', isFavorited: false });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedFavoritesApi.addMealPlanToFavorites).toHaveBeenCalledWith(
        'meal-plan-1'
      );
    });

    it('should remove from favorites when favorited', async () => {
      mockedFavoritesApi.removeMealPlanFromFavorites.mockResolvedValue();

      const { result } = renderHook(() => useToggleMealPlanFavorite(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', isFavorited: true });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        mockedFavoritesApi.removeMealPlanFromFavorites
      ).toHaveBeenCalledWith('meal-plan-1');
    });
  });

  describe('useInvalidateFavorites', () => {
    it('should provide invalidation functions', () => {
      const { result } = renderHook(() => useInvalidateFavorites(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.invalidateList).toBe('function');
      expect(typeof result.current.invalidateStatus).toBe('function');
      expect(typeof result.current.invalidateAll).toBe('function');
    });
  });
});
