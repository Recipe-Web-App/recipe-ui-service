import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { recipesApi } from '@/lib/api/recipe-management';
import {
  useRecipes,
  useRecipe,
  useRecipeDescription,
  useRecipeHistory,
  useTrendingRecipes,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from '@/hooks/recipe-management/useRecipes';
import type {
  SearchRecipesResponse,
  RecipeDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
} from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

jest.mock('@/lib/api/recipe-management', () => ({
  recipesApi: {
    getAllRecipes: jest.fn(),
    getRecipeById: jest.fn(),
    getRecipeDescription: jest.fn(),
    getRecipeHistory: jest.fn(),
    getTrendingRecipes: jest.fn(),
    createRecipe: jest.fn(),
    updateRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
  },
}));

const mockedRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;

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

describe('useRecipes hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipes', () => {
    it('should fetch all recipes successfully', async () => {
      const mockResponse: SearchRecipesResponse = {
        recipes: [
          {
            recipeId: 1,
            title: 'Test Recipe',
            description: 'A test recipe',
            userId: 'user1',
            servings: 4,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        page: 0,
        size: 10,
        last: true,
        totalElements: 1,
        totalPages: 1,
        first: true,
        numberOfElements: 1,
        empty: false,
      };

      mockedRecipesApi.getAllRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.getAllRecipes).toHaveBeenCalledWith(undefined);
    });

    it('should fetch recipes with pagination params', async () => {
      const params: PaginationParams = { page: 1, size: 10 };
      const mockResponse: SearchRecipesResponse = {
        recipes: [],
        page: 1,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: false,
        last: true,
        numberOfElements: 0,
        empty: true,
      };

      mockedRecipesApi.getAllRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipes(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.getAllRecipes).toHaveBeenCalledWith(params);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch recipes');
      mockedRecipesApi.getAllRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipe', () => {
    it('should fetch specific recipe successfully', async () => {
      const mockRecipe: RecipeDto = {
        recipeId: 1,
        title: 'Test Recipe',
        description: 'A test recipe',
        userId: 'user1',
        servings: 4,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedRecipesApi.getRecipeById.mockResolvedValue(mockRecipe);

      const { result } = renderHook(() => useRecipe(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRecipe);
      expect(mockedRecipesApi.getRecipeById).toHaveBeenCalledWith(1, undefined);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipe(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedRecipesApi.getRecipeById).not.toHaveBeenCalled();
    });

    it('should fetch recipe with comments when includeComments is true', async () => {
      const mockRecipeWithComments: RecipeDto = {
        recipeId: 1,
        title: 'Test Recipe',
        description: 'A test recipe',
        userId: 'user1',
        servings: 4,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        comments: [
          {
            commentId: 501,
            recipeId: 1,
            userId: 'user2',
            commentText: 'Great recipe!',
            isPublic: true,
            createdAt: '2024-01-02T10:00:00Z',
          },
        ],
      };

      mockedRecipesApi.getRecipeById.mockResolvedValue(mockRecipeWithComments);

      const { result } = renderHook(() => useRecipe(1, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRecipeWithComments);
      expect(result.current.data?.comments).toHaveLength(1);
      expect(mockedRecipesApi.getRecipeById).toHaveBeenCalledWith(1, true);
    });

    it('should fetch recipe without comments when includeComments is false', async () => {
      const mockRecipe: RecipeDto = {
        recipeId: 1,
        title: 'Test Recipe',
        description: 'A test recipe',
        userId: 'user1',
        servings: 4,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedRecipesApi.getRecipeById.mockResolvedValue(mockRecipe);

      const { result } = renderHook(() => useRecipe(1, false), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRecipe);
      expect(result.current.data?.comments).toBeUndefined();
      expect(mockedRecipesApi.getRecipeById).toHaveBeenCalledWith(1, false);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch recipe');
      mockedRecipesApi.getRecipeById.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipe(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeDescription', () => {
    it('should fetch recipe description successfully', async () => {
      const mockDescription = 'This is a detailed recipe description.';

      mockedRecipesApi.getRecipeDescription.mockResolvedValue(mockDescription);

      const { result } = renderHook(() => useRecipeDescription(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockDescription);
      expect(mockedRecipesApi.getRecipeDescription).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeDescription(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedRecipesApi.getRecipeDescription).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch description');
      mockedRecipesApi.getRecipeDescription.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeDescription(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeHistory', () => {
    it('should fetch recipe history successfully', async () => {
      const mockHistory = 'Recipe created on 2024-01-01';

      mockedRecipesApi.getRecipeHistory.mockResolvedValue(mockHistory);

      const { result } = renderHook(() => useRecipeHistory(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockHistory);
      expect(mockedRecipesApi.getRecipeHistory).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeHistory(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedRecipesApi.getRecipeHistory).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch history');
      mockedRecipesApi.getRecipeHistory.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeHistory(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useTrendingRecipes', () => {
    it('should fetch trending recipes successfully', async () => {
      const mockResponse: SearchRecipesResponse = {
        recipes: [
          {
            recipeId: 1,
            title: 'Trending Recipe',
            description: 'A trending recipe',
            userId: 'user1',
            servings: 4,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        page: 0,
        size: 10,
        last: true,
        totalElements: 1,
        totalPages: 1,
        first: true,
        numberOfElements: 1,
        empty: false,
      };

      mockedRecipesApi.getTrendingRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTrendingRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.getTrendingRecipes).toHaveBeenCalledWith(
        undefined
      );
    });

    it('should fetch trending recipes with pagination params', async () => {
      const params: Omit<PaginationParams, 'sort'> = { page: 1, size: 10 };
      const mockResponse: SearchRecipesResponse = {
        recipes: [],
        page: 1,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: false,
        last: true,
        numberOfElements: 0,
        empty: true,
      };

      mockedRecipesApi.getTrendingRecipes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTrendingRecipes(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.getTrendingRecipes).toHaveBeenCalledWith(params);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch trending recipes');
      mockedRecipesApi.getTrendingRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useTrendingRecipes(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCreateRecipe', () => {
    it('should create recipe successfully', async () => {
      const mockRequest: CreateRecipeRequest = {
        title: 'New Recipe',
        description: 'A new recipe description',
        servings: 4,
        ingredients: [],
        steps: [],
      };

      const mockResponse: RecipeDto = {
        recipeId: 2,
        title: 'New Recipe',
        description: 'A new recipe description',
        userId: 'user1',
        servings: 4,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedRecipesApi.createRecipe.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.createRecipe).toHaveBeenCalledWith(mockRequest);
    });

    it('should handle errors', async () => {
      const mockRequest: CreateRecipeRequest = {
        title: 'New Recipe',
        description: 'A new recipe description',
        servings: 4,
        ingredients: [],
        steps: [],
      };

      const error = new Error('Failed to create recipe');
      mockedRecipesApi.createRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockRequest);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateRecipe', () => {
    it('should update recipe successfully', async () => {
      const mockRequest: UpdateRecipeRequest = {
        title: 'Updated Recipe',
        description: 'Updated description',
      };

      const mockResponse: RecipeDto = {
        recipeId: 1,
        title: 'Updated Recipe',
        description: 'Updated description',
        userId: 'user1',
        servings: 4,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T01:00:00Z',
      };

      mockedRecipesApi.updateRecipe.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.updateRecipe).toHaveBeenCalledWith(
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: UpdateRecipeRequest = {
        title: 'Updated Recipe',
      };

      const error = new Error('Failed to update recipe');
      mockedRecipesApi.updateRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      const mockResponse = undefined;

      mockedRecipesApi.deleteRecipe.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRecipesApi.deleteRecipe).toHaveBeenCalledWith(1);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to delete recipe');
      mockedRecipesApi.deleteRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
