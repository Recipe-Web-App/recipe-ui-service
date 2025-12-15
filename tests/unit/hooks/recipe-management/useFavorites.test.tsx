import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { favoritesApi } from '@/lib/api/recipe-management/favorites';
import {
  useFavoriteRecipes,
  useFavoriteRecipe,
  useUnfavoriteRecipe,
  useIsRecipeFavorited,
} from '@/hooks/recipe-management/useFavorites';
import type {
  FavoriteRecipesResponse,
  RecipeFavoriteDto,
  GetFavoriteRecipesParams,
} from '@/types/recipe-management/favorite';
import { DifficultyLevel } from '@/types/recipe-management/common';

jest.mock('@/lib/api/recipe-management/favorites', () => ({
  favoritesApi: {
    getFavoriteRecipes: jest.fn(),
    favoriteRecipe: jest.fn(),
    unfavoriteRecipe: jest.fn(),
    isRecipeFavorited: jest.fn(),
  },
}));

const mockedFavoritesApi = favoritesApi as jest.Mocked<typeof favoritesApi>;

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

describe('useFavorites hooks', () => {
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

  describe('useFavoriteRecipes', () => {
    it('should fetch favorite recipes without parameters', async () => {
      mockedFavoritesApi.getFavoriteRecipes.mockResolvedValue(
        mockFavoriteRecipesResponse
      );

      const { result } = renderHook(() => useFavoriteRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFavoriteRecipesResponse);
      expect(mockedFavoritesApi.getFavoriteRecipes).toHaveBeenCalledWith(
        undefined
      );
    });

    it('should fetch favorite recipes with userId', async () => {
      const params: GetFavoriteRecipesParams = {
        userId: 'user-123-uuid',
      };

      mockedFavoritesApi.getFavoriteRecipes.mockResolvedValue(
        mockFavoriteRecipesResponse
      );

      const { result } = renderHook(() => useFavoriteRecipes(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFavoriteRecipesResponse);
      expect(mockedFavoritesApi.getFavoriteRecipes).toHaveBeenCalledWith(
        params
      );
    });

    it('should fetch favorite recipes with pagination', async () => {
      const params: GetFavoriteRecipesParams = {
        page: 1,
        size: 10,
        sort: ['favoritedAt,desc'],
      };

      mockedFavoritesApi.getFavoriteRecipes.mockResolvedValue(
        mockFavoriteRecipesResponse
      );

      const { result } = renderHook(() => useFavoriteRecipes(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFavoriteRecipesResponse);
      expect(mockedFavoritesApi.getFavoriteRecipes).toHaveBeenCalledWith(
        params
      );
    });

    it('should handle empty favorites list', async () => {
      const emptyResponse: FavoriteRecipesResponse = {
        recipes: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
      };

      mockedFavoritesApi.getFavoriteRecipes.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useFavoriteRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.recipes).toHaveLength(0);
      expect(result.current.data?.totalElements).toBe(0);
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedFavoritesApi.getFavoriteRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle forbidden errors for private favorites (403)', async () => {
      const params: GetFavoriteRecipesParams = {
        userId: 'private-user-uuid',
      };

      const error = new Error(
        "User's favorites are private. Only followers can view them."
      );
      mockedFavoritesApi.getFavoriteRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteRecipes(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useFavoriteRecipe', () => {
    it('should favorite a recipe successfully', async () => {
      mockedFavoritesApi.favoriteRecipe.mockResolvedValue(mockFavoriteDto);

      const { result } = renderHook(() => useFavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(123);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedFavoritesApi.favoriteRecipe).toHaveBeenCalledWith(123);
      expect(result.current.data).toEqual(mockFavoriteDto);
    });

    it('should handle recipe not found (404)', async () => {
      const error = new Error('Recipe not found');
      mockedFavoritesApi.favoriteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(999);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle already favorited conflict (409)', async () => {
      const error = new Error('User has already favorited this recipe');
      mockedFavoritesApi.favoriteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedFavoritesApi.favoriteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUnfavoriteRecipe', () => {
    it('should unfavorite a recipe successfully', async () => {
      mockedFavoritesApi.unfavoriteRecipe.mockResolvedValue();

      const { result } = renderHook(() => useUnfavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(123);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedFavoritesApi.unfavoriteRecipe).toHaveBeenCalledWith(123);
    });

    it('should handle favorite not found (404)', async () => {
      const error = new Error('Favorite not found for this user and recipe');
      mockedFavoritesApi.unfavoriteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useUnfavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(999);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedFavoritesApi.unfavoriteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useUnfavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle recipe not found (404)', async () => {
      const error = new Error('Recipe not found');
      mockedFavoritesApi.unfavoriteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useUnfavoriteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useIsRecipeFavorited', () => {
    it('should return true when recipe is favorited', async () => {
      mockedFavoritesApi.isRecipeFavorited.mockResolvedValue(true);

      const { result } = renderHook(() => useIsRecipeFavorited(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(true);
      expect(mockedFavoritesApi.isRecipeFavorited).toHaveBeenCalledWith(123);
    });

    it('should return false when recipe is not favorited', async () => {
      mockedFavoritesApi.isRecipeFavorited.mockResolvedValue(false);

      const { result } = renderHook(() => useIsRecipeFavorited(456), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(false);
      expect(mockedFavoritesApi.isRecipeFavorited).toHaveBeenCalledWith(456);
    });

    it('should not fetch when recipeId is falsy', async () => {
      const { result } = renderHook(() => useIsRecipeFavorited(0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      expect(mockedFavoritesApi.isRecipeFavorited).not.toHaveBeenCalled();
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedFavoritesApi.isRecipeFavorited.mockRejectedValue(error);

      const { result } = renderHook(() => useIsRecipeFavorited(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle recipe not found (404)', async () => {
      const error = new Error('Recipe not found');
      mockedFavoritesApi.isRecipeFavorited.mockRejectedValue(error);

      const { result } = renderHook(() => useIsRecipeFavorited(999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
