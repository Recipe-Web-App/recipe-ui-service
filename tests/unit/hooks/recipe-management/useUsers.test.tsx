import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMyRecipes } from '@/hooks/recipe-management/useUsers';
import { usersApi } from '@/lib/api/recipe-management/users';
import type {
  RecipeDto,
  SearchRecipesResponse,
  DifficultyLevel,
} from '@/types/recipe-management';

// Mock the API
jest.mock('@/lib/api/recipe-management/users');
const mockedUsersApi = usersApi as jest.Mocked<typeof usersApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers hooks', () => {
  const mockRecipeDto: RecipeDto = {
    recipeId: 1,
    userId: 'user-123',
    title: 'My Recipe',
    description: 'A recipe I created',
    servings: 4,
    difficulty: 'EASY' as DifficultyLevel,
    preparationTime: 15,
    cookingTime: 30,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  };

  const mockSearchResponse: SearchRecipesResponse = {
    recipes: [mockRecipeDto],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
    empty: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useMyRecipes', () => {
    it('should fetch user recipes successfully', async () => {
      mockedUsersApi.getMyRecipes.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(() => useMyRecipes(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSearchResponse);
      expect(mockedUsersApi.getMyRecipes).toHaveBeenCalledWith(undefined);
    });

    it('should fetch user recipes with pagination parameters', async () => {
      mockedUsersApi.getMyRecipes.mockResolvedValue(mockSearchResponse);

      const params = { page: 1, size: 10, sort: ['title,asc'] };
      const { result } = renderHook(() => useMyRecipes(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedUsersApi.getMyRecipes).toHaveBeenCalledWith(params);
    });

    it('should handle empty results', async () => {
      const emptyResponse: SearchRecipesResponse = {
        recipes: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        empty: true,
      };
      mockedUsersApi.getMyRecipes.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useMyRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.recipes).toHaveLength(0);
      expect(result.current.data?.totalElements).toBe(0);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedUsersApi.getMyRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useMyRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should return multiple recipes', async () => {
      const multipleRecipesResponse: SearchRecipesResponse = {
        recipes: [
          mockRecipeDto,
          { ...mockRecipeDto, recipeId: 2, title: 'My Second Recipe' },
          { ...mockRecipeDto, recipeId: 3, title: 'My Third Recipe' },
        ],
        page: 0,
        size: 10,
        totalElements: 3,
        totalPages: 1,
        first: true,
        last: true,
        numberOfElements: 3,
        empty: false,
      };
      mockedUsersApi.getMyRecipes.mockResolvedValue(multipleRecipesResponse);

      const { result } = renderHook(() => useMyRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.recipes).toHaveLength(3);
      expect(result.current.data?.totalElements).toBe(3);
    });

    it('should include pagination params in query key for deduplication', async () => {
      mockedUsersApi.getMyRecipes.mockResolvedValue(mockSearchResponse);

      const params1 = { page: 0, size: 10 };
      const params2 = { page: 1, size: 10 };

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useMyRecipes(params1), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => useMyRecipes(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // Both should have been called with different params
      expect(mockedUsersApi.getMyRecipes).toHaveBeenCalledWith(params1);
      expect(mockedUsersApi.getMyRecipes).toHaveBeenCalledWith(params2);
    });
  });
});
