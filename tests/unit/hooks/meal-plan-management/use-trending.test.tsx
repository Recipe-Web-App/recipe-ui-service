import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useTrendingMealPlans,
  usePrefetchTrendingMealPlans,
  useInvalidateTrending,
} from '@/hooks/meal-plan-management/use-trending';
import { trendingApi } from '@/lib/api/meal-plan-management';
import type {
  MealPlanResponseDto,
  PaginatedMealPlansResponse,
} from '@/types/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  trendingApi: {
    getTrendingMealPlans: jest.fn(),
  },
}));

const mockedTrendingApi = trendingApi as jest.Mocked<typeof trendingApi>;

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

describe('Trending Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMealPlan: MealPlanResponseDto = {
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
    data: [mockMealPlan],
    meta: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  describe('useTrendingMealPlans', () => {
    it('should fetch trending meal plans successfully', async () => {
      mockedTrendingApi.getTrendingMealPlans.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => useTrendingMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTrendingApi.getTrendingMealPlans).toHaveBeenCalledWith(
        undefined
      );
      expect(result.current.data).toEqual(mockPaginatedResponse);
    });

    it('should fetch trending meal plans with pagination', async () => {
      const params = {
        page: 2,
        limit: 10,
      };

      mockedTrendingApi.getTrendingMealPlans.mockResolvedValue(
        mockPaginatedResponse
      );

      const { result } = renderHook(() => useTrendingMealPlans(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTrendingApi.getTrendingMealPlans).toHaveBeenCalledWith(
        params
      );
    });

    it('should handle fetch trending error', async () => {
      const error = new Error('Network error');
      mockedTrendingApi.getTrendingMealPlans.mockRejectedValue(error);

      const { result } = renderHook(() => useTrendingMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });

    it('should return meal plans in trending order', async () => {
      const trendingMealPlans: MealPlanResponseDto[] = [
        { ...mockMealPlan, id: 'most-trending', name: 'Most Trending' },
        { ...mockMealPlan, id: 'second-trending', name: 'Second Trending' },
        { ...mockMealPlan, id: 'third-trending', name: 'Third Trending' },
      ];

      const orderedResponse: PaginatedMealPlansResponse = {
        ...mockPaginatedResponse,
        data: trendingMealPlans,
        meta: { ...mockPaginatedResponse.meta, total: 3 },
      };

      mockedTrendingApi.getTrendingMealPlans.mockResolvedValue(orderedResponse);

      const { result } = renderHook(() => useTrendingMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // First item should be the most trending
      expect(result.current.data?.data[0].name).toBe('Most Trending');
      expect(result.current.data?.data.length).toBe(3);
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

      mockedTrendingApi.getTrendingMealPlans.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useTrendingMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.data).toEqual([]);
      expect(result.current.data?.meta.total).toBe(0);
    });
  });

  describe('usePrefetchTrendingMealPlans', () => {
    it('should return a prefetch function', () => {
      const { result } = renderHook(() => usePrefetchTrendingMealPlans(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current).toBe('function');
    });
  });

  describe('useInvalidateTrending', () => {
    it('should provide invalidation function', () => {
      const { result } = renderHook(() => useInvalidateTrending(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.invalidate).toBe('function');
    });
  });
});
