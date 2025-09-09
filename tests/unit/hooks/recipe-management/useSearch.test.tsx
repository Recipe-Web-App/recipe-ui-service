import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { searchApi } from '@/lib/api/recipe-management';
import {
  useSearchRecipes,
  useSimpleRecipeSearch,
  useDebouncedRecipeSearch,
  useAdvancedRecipeSearch,
  useRecipesByTags,
  useRecipesByDifficulty,
  useRecipesByIngredients,
  useRecipeSearchBuilder,
} from '@/hooks/recipe-management/useSearch';
import type {
  SearchRecipesRequest,
  SearchRecipesResponse,
} from '@/types/recipe-management';
import { DifficultyLevel } from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  searchApi: {
    searchRecipes: jest.fn(),
  },
}));

const mockedSearchApi = searchApi as jest.Mocked<typeof searchApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useSearch hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSearchRecipes', () => {
    it('should search recipes successfully', async () => {
      const searchData: SearchRecipesRequest = {
        query: 'chicken',
        tags: ['dinner'],
        difficulty: [DifficultyLevel.EASY],
      };

      const mockResponse: SearchRecipesResponse = {
        content: [
          {
            recipeId: 1,
            title: 'Chicken Recipe',
            description: 'A delicious chicken recipe',
            userId: 'user1',
            servings: 4,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        last: true,
        totalElements: 1,
        totalPages: 1,
        first: true,
        numberOfElements: 1,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSearchRecipes(searchData), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        searchData,
        undefined
      );
    });

    it('should handle disabled state when no search criteria', () => {
      const searchData: SearchRecipesRequest = {};

      const { result } = renderHook(() => useSearchRecipes(searchData), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const searchData: SearchRecipesRequest = { query: 'test' };
      const error = new Error('Search failed');
      mockedSearchApi.searchRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useSearchRecipes(searchData), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useSimpleRecipeSearch', () => {
    it('should search with simple query', async () => {
      const query = 'pasta';
      const mockResponse: SearchRecipesResponse = {
        content: [
          {
            recipeId: 1,
            title: 'Pasta Recipe',
            description: 'Simple pasta',
            userId: 'user1',
            servings: 4,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        last: true,
        totalElements: 1,
        totalPages: 1,
        first: true,
        numberOfElements: 1,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimpleRecipeSearch(query), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        { query },
        undefined
      );
    });

    it('should handle disabled state for short queries', () => {
      const { result } = renderHook(() => useSimpleRecipeSearch('a'), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });

    it('should handle empty query', () => {
      const { result } = renderHook(() => useSimpleRecipeSearch(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });
  });

  describe('useDebouncedRecipeSearch', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce search queries', async () => {
      const mockResponse: SearchRecipesResponse = {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
        first: true,
        numberOfElements: 0,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      // Start with a query that's too short to trigger immediate search
      const { rerender } = renderHook(
        ({ query }) => useDebouncedRecipeSearch(query, 300),
        {
          initialProps: { query: 'c' },
          wrapper: createWrapper(),
        }
      );

      // Initially should not search due to short query
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();

      // Fast changes should not trigger search due to debouncing
      act(() => {
        rerender({ query: 'ch' });
      });
      act(() => {
        rerender({ query: 'chi' });
      });
      act(() => {
        rerender({ query: 'chic' });
      });
      act(() => {
        rerender({ query: 'chick' });
      });

      // Still should not have searched due to debouncing
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();

      // Advance timers to trigger debounced search
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
          { query: 'chick' },
          undefined
        );
      });
    });
  });

  describe('useAdvancedRecipeSearch', () => {
    it('should search with advanced filters', async () => {
      const filters: SearchRecipesRequest = {
        query: 'chicken',
        tags: ['dinner', 'easy'],
        difficulty: [DifficultyLevel.EASY, DifficultyLevel.MEDIUM],
        ingredients: ['chicken', 'rice'],
      };

      const mockResponse: SearchRecipesResponse = {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
        first: true,
        numberOfElements: 0,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAdvancedRecipeSearch(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        filters,
        undefined
      );
    });

    it('should handle disabled state with empty filters', () => {
      const filters: SearchRecipesRequest = {};

      const { result } = renderHook(() => useAdvancedRecipeSearch(filters), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });
  });

  describe('useRecipesByTags', () => {
    it('should search recipes by tags', async () => {
      const tags = ['vegetarian', 'quick'];
      const mockResponse: SearchRecipesResponse = {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
        first: true,
        numberOfElements: 0,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipesByTags(tags), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        { tags },
        undefined
      );
    });

    it('should handle disabled state with empty tags', () => {
      const { result } = renderHook(() => useRecipesByTags([]), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });
  });

  describe('useRecipesByDifficulty', () => {
    it('should search recipes by difficulty', async () => {
      const difficulty = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM];
      const mockResponse: SearchRecipesResponse = {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
        first: true,
        numberOfElements: 0,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipesByDifficulty(difficulty), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        { difficulty },
        undefined
      );
    });

    it('should filter out invalid difficulty levels', async () => {
      const difficulty = [DifficultyLevel.EASY, 'INVALID' as DifficultyLevel];
      const mockResponse: SearchRecipesResponse = {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
        first: true,
        numberOfElements: 0,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipesByDifficulty(difficulty), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        { difficulty: [DifficultyLevel.EASY] },
        undefined
      );
    });

    it('should handle disabled state with empty difficulty', () => {
      const { result } = renderHook(() => useRecipesByDifficulty([]), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });
  });

  describe('useRecipesByIngredients', () => {
    it('should search recipes by ingredients', async () => {
      const ingredients = ['chicken', 'rice', 'vegetables'];
      const mockResponse: SearchRecipesResponse = {
        content: [],
        last: true,
        totalElements: 0,
        totalPages: 0,
        first: true,
        numberOfElements: 0,
      };

      mockedSearchApi.searchRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useRecipesByIngredients(ingredients),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedSearchApi.searchRecipes).toHaveBeenCalledWith(
        { ingredients },
        undefined
      );
    });

    it('should handle disabled state with empty ingredients', () => {
      const { result } = renderHook(() => useRecipesByIngredients([]), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedSearchApi.searchRecipes).not.toHaveBeenCalled();
    });
  });

  describe('useRecipeSearchBuilder', () => {
    it('should provide search builder functionality', () => {
      const { result } = renderHook(() => useRecipeSearchBuilder(), {
        wrapper: createWrapper(),
      });

      expect(result.current.searchCriteria).toEqual({});
      expect(result.current.params).toBeUndefined();
      expect(typeof result.current.updateSearch).toBe('function');
      expect(typeof result.current.updateParams).toBe('function');
      expect(typeof result.current.clearSearch).toBe('function');
    });

    it('should update search criteria', () => {
      const { result } = renderHook(() => useRecipeSearchBuilder(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateSearch({ query: 'chicken' });
      });

      expect(result.current.searchCriteria).toEqual({ query: 'chicken' });
    });

    it('should update pagination params', () => {
      const { result } = renderHook(() => useRecipeSearchBuilder(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateParams({ page: 1, size: 10 });
      });

      expect(result.current.params).toEqual({ page: 1, size: 10 });
    });

    it('should clear search', () => {
      const { result } = renderHook(() => useRecipeSearchBuilder(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateSearch({ query: 'chicken' });
      });
      act(() => {
        result.current.updateParams({ page: 1 });
      });
      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchCriteria).toEqual({});
      expect(result.current.params).toBeUndefined();
    });
  });
});
