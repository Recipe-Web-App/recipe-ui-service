import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import {
  useFavoriteRecipes,
  useFavoriteRecipe,
  useUnfavoriteRecipe,
  useIsRecipeFavorited,
} from '@/hooks/recipe-management/useFavorites';
import type {
  FavoriteRecipesResponse,
  RecipeFavoriteDto,
} from '@/types/recipe-management/favorite';
import { DifficultyLevel } from '@/types/recipe-management/common';

// Mock the axios client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
  buildQueryParams: jest.requireActual('@/lib/api/recipe-management/client')
    .buildQueryParams,
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
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

describe('Favorites Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFavoriteDto: RecipeFavoriteDto = {
    recipeId: 123,
    userId: 'user-456-uuid',
    favoritedAt: '2023-01-01T10:00:00Z',
  };

  const mockFavoriteRecipesResponse: FavoriteRecipesResponse = {
    recipes: [
      {
        recipeId: 123,
        userId: 'user-789',
        title: 'Chocolate Chip Cookies',
        description: 'Classic homemade cookies',
        servings: 24,
        preparationTime: 15,
        cookingTime: 12,
        difficulty: DifficultyLevel.EASY,
        createdAt: '2023-01-01T10:00:00Z',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
  };

  describe('Full Favorite Workflow', () => {
    it('should complete the full favorite/unfavorite workflow', async () => {
      // Step 1: Fetch favorites (initially empty)
      const emptyResponse: FavoriteRecipesResponse = {
        recipes: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
      };
      mockedClient.get.mockResolvedValueOnce({ data: emptyResponse });

      const { result: fetchResult } = renderHook(() => useFavoriteRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(fetchResult.current.isSuccess).toBe(true);
      });

      expect(fetchResult.current.data?.recipes).toHaveLength(0);

      // Step 2: Favorite a recipe
      mockedClient.post.mockResolvedValueOnce({ data: mockFavoriteDto });
      mockedClient.get.mockResolvedValueOnce({
        data: mockFavoriteRecipesResponse,
      });

      const { result: favoriteResult } = renderHook(() => useFavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        favoriteResult.current.mutate(123);
      });

      await waitFor(() => {
        expect(favoriteResult.current.isSuccess).toBe(true);
      });

      expect(mockedClient.post).toHaveBeenCalledWith('/favorites/recipes/123');

      // Step 3: Verify favorite appears in list (would be tested with fresh query)
      const { result: fetchAfterFavoriteResult } = renderHook(
        () => useFavoriteRecipes(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(fetchAfterFavoriteResult.current.isSuccess).toBe(true);
      });

      expect(fetchAfterFavoriteResult.current.data?.recipes).toHaveLength(1);
      expect(fetchAfterFavoriteResult.current.data?.recipes[0].recipeId).toBe(
        123
      );

      // Step 4: Unfavorite the recipe
      mockedClient.delete.mockResolvedValueOnce({ data: undefined });
      mockedClient.get.mockResolvedValueOnce({ data: emptyResponse });

      const { result: unfavoriteResult } = renderHook(
        () => useUnfavoriteRecipe(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        unfavoriteResult.current.mutate(123);
      });

      await waitFor(() => {
        expect(unfavoriteResult.current.isSuccess).toBe(true);
      });

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/favorites/recipes/123'
      );
    });

    it('should handle conflict when favoriting already favorited recipe', async () => {
      // Try to favorite an already favorited recipe
      const error = {
        response: {
          status: 409,
          data: {
            error: 'Conflict',
            message: 'User has already favorited this recipe',
          },
        },
      };
      mockedClient.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useFavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle privacy restrictions when fetching others favorites', async () => {
      // Try to fetch private user's favorites
      const error = {
        response: {
          status: 403,
          data: {
            error: 'Forbidden',
            message:
              "User's favorites are private. Only followers can view them.",
          },
        },
      };
      mockedClient.get.mockRejectedValueOnce(error);

      const { result } = renderHook(
        () => useFavoriteRecipes({ userId: 'private-user-uuid' }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle unfavoriting non-existent favorite', async () => {
      // Try to unfavorite a recipe that's not in favorites
      const error = {
        response: {
          status: 404,
          data: {
            error: 'Not Found',
            message: 'Favorite not found for this user and recipe',
          },
        },
      };
      mockedClient.delete.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUnfavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(999);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('Pagination and Filtering', () => {
    it('should fetch paginated favorites', async () => {
      const paginatedResponse: FavoriteRecipesResponse = {
        recipes: [mockFavoriteRecipesResponse.recipes[0]],
        totalElements: 10,
        totalPages: 2,
        first: false,
        last: false,
        numberOfElements: 5,
      };

      mockedClient.get.mockResolvedValueOnce({ data: paginatedResponse });

      const { result } = renderHook(
        () =>
          useFavoriteRecipes({
            page: 1,
            size: 5,
            sort: ['favoritedAt,desc'],
          }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.totalElements).toBe(10);
      expect(result.current.data?.totalPages).toBe(2);
      expect(result.current.data?.recipes).toHaveLength(1);
      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes?page=1&size=5&sort=favoritedAt%2Cdesc'
      );
    });
  });

  describe('Favorite Status Check', () => {
    it('should check if a recipe is favorited', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: true });

      const { result } = renderHook(() => useIsRecipeFavorited(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(true);
      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes/123/is-favorited'
      );
    });

    it('should return false for non-favorited recipe', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: false });

      const { result } = renderHook(() => useIsRecipeFavorited(456), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(false);
      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/recipes/456/is-favorited'
      );
    });
  });
});
