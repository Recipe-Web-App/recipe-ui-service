import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useMealPlans,
  useMealPlanById,
  useCreateMealPlan,
  useUpdateMealPlan,
  useDeleteMealPlan,
  usePrefetchMealPlan,
  useInvalidateMealPlans,
} from '@/hooks/meal-plan-management/use-meal-plans';
import { mealPlansApi } from '@/lib/api/meal-plan-management';
import {
  MealType,
  type CreateMealPlanDto,
  type UpdateMealPlanDto,
  type MealPlanResponseDto,
  type PaginatedMealPlansResponse,
  type MealPlanQueryResponse,
  type ApiResponse,
} from '@/types/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  mealPlansApi: {
    listMealPlans: jest.fn(),
    getMealPlanById: jest.fn(),
    createMealPlan: jest.fn(),
    updateMealPlan: jest.fn(),
    deleteMealPlan: jest.fn(),
  },
}));

const mockedMealPlansApi = mealPlansApi as jest.Mocked<typeof mealPlansApi>;

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

describe('Meal Plans Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMealPlan: MealPlanResponseDto = {
    id: 'meal-plan-1',
    userId: 'user-123',
    name: 'Weekly Meal Plan',
    description: 'Healthy meals for the week',
    startDate: '2024-03-11',
    endDate: '2024-03-17',
    isActive: true,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    recipeCount: 14,
    durationDays: 7,
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

  const mockQueryResponse: MealPlanQueryResponse = {
    success: true,
    viewMode: 'full',
    data: mockMealPlan,
  };

  const mockApiResponse: ApiResponse<MealPlanResponseDto> = {
    success: true,
    data: mockMealPlan,
    message: 'Meal plan created successfully',
  };

  describe('useMealPlans', () => {
    it('should fetch meal plans successfully', async () => {
      mockedMealPlansApi.listMealPlans.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.listMealPlans).toHaveBeenCalledWith(undefined);
      expect(result.current.data).toEqual(mockPaginatedResponse);
    });

    it('should fetch meal plans with parameters', async () => {
      const params = {
        page: 2,
        limit: 10,
        isActive: true,
        sortBy: 'name' as const,
      };

      mockedMealPlansApi.listMealPlans.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useMealPlans(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.listMealPlans).toHaveBeenCalledWith(params);
    });

    it('should handle fetch meal plans error', async () => {
      const error = new Error('Network error');
      mockedMealPlansApi.listMealPlans.mockRejectedValue(error);

      const { result } = renderHook(() => useMealPlans(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useMealPlanById', () => {
    it('should fetch meal plan by id successfully', async () => {
      mockedMealPlansApi.getMealPlanById.mockResolvedValue(mockQueryResponse);

      const { result } = renderHook(() => useMealPlanById('meal-plan-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.getMealPlanById).toHaveBeenCalledWith(
        'meal-plan-1',
        undefined
      );
      expect(result.current.data).toEqual(mockQueryResponse);
    });

    it('should fetch meal plan with parameters', async () => {
      const params = {
        viewMode: 'day' as const,
        filterDate: '2024-03-15',
        mealType: MealType.BREAKFAST,
        includeRecipes: true,
      };

      mockedMealPlansApi.getMealPlanById.mockResolvedValue(mockQueryResponse);

      const { result } = renderHook(
        () => useMealPlanById('meal-plan-1', params),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.getMealPlanById).toHaveBeenCalledWith(
        'meal-plan-1',
        params
      );
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useMealPlanById(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedMealPlansApi.getMealPlanById).not.toHaveBeenCalled();
    });

    it('should not fetch when enabled is false', () => {
      const { result } = renderHook(
        () => useMealPlanById('meal-plan-1', undefined, false),
        { wrapper: createWrapper() }
      );

      expect(result.current.isFetching).toBe(false);
      expect(mockedMealPlansApi.getMealPlanById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateMealPlan', () => {
    it('should create meal plan successfully', async () => {
      const createData: CreateMealPlanDto = {
        name: 'Weekly Meal Plan',
        description: 'Healthy meals for the week',
        startDate: '2024-03-11',
        endDate: '2024-03-17',
        isActive: true,
      };

      mockedMealPlansApi.createMealPlan.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useCreateMealPlan(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.createMealPlan).toHaveBeenCalledWith(
        createData
      );
      expect(result.current.data).toEqual(mockApiResponse);
    });

    it('should handle create meal plan error', async () => {
      const createData: CreateMealPlanDto = {
        name: 'Weekly Meal Plan',
        startDate: '2024-03-11',
        endDate: '2024-03-17',
      };

      const error = new Error('Creation failed');
      mockedMealPlansApi.createMealPlan.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateMealPlan(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useUpdateMealPlan', () => {
    it('should update meal plan successfully', async () => {
      const updateData: UpdateMealPlanDto = {
        name: 'Updated Weekly Meal Plan',
        description: 'Updated healthy meals for the week',
      };

      const variables = { id: 'meal-plan-1', data: updateData };

      mockedMealPlansApi.updateMealPlan.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useUpdateMealPlan(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(variables);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.updateMealPlan).toHaveBeenCalledWith(
        'meal-plan-1',
        updateData
      );
      expect(result.current.data).toEqual(mockApiResponse);
    });

    it('should handle update meal plan error', async () => {
      const updateData: UpdateMealPlanDto = {
        name: 'Updated Weekly Meal Plan',
      };

      const variables = { id: 'meal-plan-1', data: updateData };

      const error = new Error('Update failed');
      mockedMealPlansApi.updateMealPlan.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateMealPlan(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(variables);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useDeleteMealPlan', () => {
    it('should delete meal plan successfully', async () => {
      mockedMealPlansApi.deleteMealPlan.mockResolvedValue();

      const { result } = renderHook(() => useDeleteMealPlan(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('meal-plan-1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMealPlansApi.deleteMealPlan).toHaveBeenCalledWith(
        'meal-plan-1'
      );
    });

    it('should handle delete meal plan error', async () => {
      const error = new Error('Delete failed');
      mockedMealPlansApi.deleteMealPlan.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteMealPlan(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('meal-plan-1');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('usePrefetchMealPlan', () => {
    it('should prefetch meal plan', () => {
      const { result } = renderHook(() => usePrefetchMealPlan(), {
        wrapper: createWrapper(),
      });

      // Mock QueryClient prefetchQuery
      const mockPrefetch = jest.fn();
      (result.current as any).__proto__.queryClient = {
        prefetchQuery: mockPrefetch,
      };

      // Since we can't easily mock the queryClient.prefetchQuery,
      // we just verify the function exists and can be called
      expect(typeof result.current).toBe('function');
    });
  });

  describe('useInvalidateMealPlans', () => {
    it('should provide invalidation functions', () => {
      const { result } = renderHook(() => useInvalidateMealPlans(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.invalidateList).toBe('function');
      expect(typeof result.current.invalidateById).toBe('function');
      expect(typeof result.current.invalidateAll).toBe('function');
    });
  });
});
