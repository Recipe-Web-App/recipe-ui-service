import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useMealPlanTags,
  useMealPlanTagsById,
  useAddMealPlanTags,
  useReplaceMealPlanTags,
  useRemoveMealPlanTag,
  useInvalidateTags,
} from '@/hooks/meal-plan-management/use-tags';
import { tagsApi } from '@/lib/api/meal-plan-management';
import type {
  MealPlanTagDto,
  AddMealPlanTagsDto,
  MealPlanTagsApiResponse,
  PaginatedTagsResponse,
} from '@/types/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  tagsApi: {
    listMealPlanTags: jest.fn(),
    getMealPlanTags: jest.fn(),
    addMealPlanTags: jest.fn(),
    replaceMealPlanTags: jest.fn(),
    removeMealPlanTag: jest.fn(),
  },
}));

const mockedTagsApi = tagsApi as jest.Mocked<typeof tagsApi>;

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

describe('Tags Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTags: MealPlanTagDto[] = [
    { tagId: 'tag-1', name: 'Weekly' },
    { tagId: 'tag-2', name: 'Budget' },
    { tagId: 'tag-3', name: 'Healthy' },
  ];

  const mockPaginatedResponse: PaginatedTagsResponse = {
    success: true,
    data: mockTags,
    meta: {
      page: 1,
      limit: 20,
      total: 3,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  const mockTagsApiResponse: MealPlanTagsApiResponse = {
    success: true,
    data: mockTags,
    message: 'Tags updated successfully',
  };

  describe('useMealPlanTags', () => {
    it('should fetch all tags successfully', async () => {
      mockedTagsApi.listMealPlanTags.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useMealPlanTags(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTagsApi.listMealPlanTags).toHaveBeenCalledWith(undefined);
      expect(result.current.data).toEqual(mockPaginatedResponse);
    });

    it('should fetch tags with parameters', async () => {
      const params = {
        page: 2,
        limit: 10,
        nameSearch: 'week',
        sortBy: 'name' as const,
      };

      mockedTagsApi.listMealPlanTags.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useMealPlanTags(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTagsApi.listMealPlanTags).toHaveBeenCalledWith(params);
    });

    it('should handle fetch tags error', async () => {
      const error = new Error('Network error');
      mockedTagsApi.listMealPlanTags.mockRejectedValue(error);

      const { result } = renderHook(() => useMealPlanTags(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useMealPlanTagsById', () => {
    it('should fetch meal plan tags successfully', async () => {
      mockedTagsApi.getMealPlanTags.mockResolvedValue(mockTagsApiResponse);

      const { result } = renderHook(() => useMealPlanTagsById('meal-plan-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTagsApi.getMealPlanTags).toHaveBeenCalledWith('meal-plan-1');
      expect(result.current.data).toEqual(mockTagsApiResponse);
    });

    it('should not fetch when mealPlanId is empty', () => {
      const { result } = renderHook(() => useMealPlanTagsById(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedTagsApi.getMealPlanTags).not.toHaveBeenCalled();
    });

    it('should not fetch when enabled is false', () => {
      const { result } = renderHook(
        () => useMealPlanTagsById('meal-plan-1', false),
        { wrapper: createWrapper() }
      );

      expect(result.current.isFetching).toBe(false);
      expect(mockedTagsApi.getMealPlanTags).not.toHaveBeenCalled();
    });
  });

  describe('useAddMealPlanTags', () => {
    it('should add tags successfully', async () => {
      const addData: AddMealPlanTagsDto = {
        tags: ['Weekly', 'Budget'],
      };

      mockedTagsApi.addMealPlanTags.mockResolvedValue(mockTagsApiResponse);

      const { result } = renderHook(() => useAddMealPlanTags(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', data: addData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTagsApi.addMealPlanTags).toHaveBeenCalledWith(
        'meal-plan-1',
        addData
      );
      expect(result.current.data).toEqual(mockTagsApiResponse);
    });

    it('should handle add tags error', async () => {
      const addData: AddMealPlanTagsDto = {
        tags: ['Invalid'],
      };

      const error = new Error('Validation failed');
      mockedTagsApi.addMealPlanTags.mockRejectedValue(error);

      const { result } = renderHook(() => useAddMealPlanTags(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', data: addData });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useReplaceMealPlanTags', () => {
    it('should replace tags successfully', async () => {
      const replaceData: AddMealPlanTagsDto = {
        tags: ['Monthly', 'Premium'],
      };

      mockedTagsApi.replaceMealPlanTags.mockResolvedValue(mockTagsApiResponse);

      const { result } = renderHook(() => useReplaceMealPlanTags(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', data: replaceData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTagsApi.replaceMealPlanTags).toHaveBeenCalledWith(
        'meal-plan-1',
        replaceData
      );
      expect(result.current.data).toEqual(mockTagsApiResponse);
    });

    it('should handle replace tags error', async () => {
      const replaceData: AddMealPlanTagsDto = {
        tags: ['Invalid'],
      };

      const error = new Error('Update failed');
      mockedTagsApi.replaceMealPlanTags.mockRejectedValue(error);

      const { result } = renderHook(() => useReplaceMealPlanTags(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', data: replaceData });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useRemoveMealPlanTag', () => {
    it('should remove tag successfully', async () => {
      mockedTagsApi.removeMealPlanTag.mockResolvedValue();

      const { result } = renderHook(() => useRemoveMealPlanTag(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', tagId: 'tag-1' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedTagsApi.removeMealPlanTag).toHaveBeenCalledWith(
        'meal-plan-1',
        'tag-1'
      );
    });

    it('should handle remove tag error', async () => {
      const error = new Error('Not found');
      mockedTagsApi.removeMealPlanTag.mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveMealPlanTag(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ mealPlanId: 'meal-plan-1', tagId: 'tag-1' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBe(error);
    });
  });

  describe('useInvalidateTags', () => {
    it('should provide invalidation functions', () => {
      const { result } = renderHook(() => useInvalidateTags(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.invalidateAllTags).toBe('function');
      expect(typeof result.current.invalidateMealPlanTags).toBe('function');
      expect(typeof result.current.invalidateAll).toBe('function');
    });
  });
});
