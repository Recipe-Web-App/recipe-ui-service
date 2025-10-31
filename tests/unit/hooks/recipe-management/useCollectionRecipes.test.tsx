import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { collectionRecipesApi } from '@/lib/api/recipe-management';
import {
  useAddRecipeToCollection,
  useRemoveRecipeFromCollection,
  useUpdateRecipeOrder,
  useReorderRecipes,
} from '@/hooks/recipe-management/useCollectionRecipes';
import type {
  CollectionRecipeDto,
  UpdateRecipeOrderRequest,
  ReorderRecipesRequest,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  collectionRecipesApi: {
    addRecipeToCollection: jest.fn(),
    removeRecipeFromCollection: jest.fn(),
    updateRecipeOrder: jest.fn(),
    reorderRecipes: jest.fn(),
  },
}));

const mockedCollectionRecipesApi = collectionRecipesApi as jest.Mocked<
  typeof collectionRecipesApi
>;

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

describe('useCollectionRecipes hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAddRecipeToCollection', () => {
    it('should add recipe to collection successfully', async () => {
      const newRecipe: CollectionRecipeDto = {
        recipeId: 123,
        recipeTitle: 'Chocolate Cake',
        displayOrder: 1,
        addedBy: 'user123',
        addedAt: '2024-01-01T00:00:00Z',
      };

      mockedCollectionRecipesApi.addRecipeToCollection.mockResolvedValue(
        newRecipe
      );

      const { result } = renderHook(() => useAddRecipeToCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, recipeId: 123 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        mockedCollectionRecipesApi.addRecipeToCollection
      ).toHaveBeenCalledWith(1, 123);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add recipe');
      mockedCollectionRecipesApi.addRecipeToCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useAddRecipeToCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, recipeId: 123 });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRemoveRecipeFromCollection', () => {
    it('should remove recipe from collection successfully', async () => {
      mockedCollectionRecipesApi.removeRecipeFromCollection.mockResolvedValue(
        undefined
      );

      const { result } = renderHook(() => useRemoveRecipeFromCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, recipeId: 123 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        mockedCollectionRecipesApi.removeRecipeFromCollection
      ).toHaveBeenCalledWith(1, 123);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to remove recipe');
      mockedCollectionRecipesApi.removeRecipeFromCollection.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useRemoveRecipeFromCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, recipeId: 123 });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateRecipeOrder', () => {
    it('should update recipe order successfully', async () => {
      const updatedRecipe: CollectionRecipeDto = {
        recipeId: 123,
        recipeTitle: 'Chocolate Cake',
        displayOrder: 5,
        addedBy: 'user123',
        addedAt: '2024-01-01T00:00:00Z',
      };

      mockedCollectionRecipesApi.updateRecipeOrder.mockResolvedValue(
        updatedRecipe
      );

      const { result } = renderHook(() => useUpdateRecipeOrder(), {
        wrapper: createWrapper(),
      });

      const orderData: UpdateRecipeOrderRequest = {
        displayOrder: 5,
      };

      result.current.mutate({
        collectionId: 1,
        recipeId: 123,
        data: orderData,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCollectionRecipesApi.updateRecipeOrder).toHaveBeenCalledWith(
        1,
        123,
        orderData
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to update order');
      mockedCollectionRecipesApi.updateRecipeOrder.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateRecipeOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        collectionId: 1,
        recipeId: 123,
        data: { displayOrder: 5 },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useReorderRecipes', () => {
    it('should reorder recipes successfully', async () => {
      const reorderedRecipes: CollectionRecipeDto[] = [
        {
          recipeId: 123,
          recipeTitle: 'Recipe 1',
          displayOrder: 1,
          addedBy: 'user123',
          addedAt: '2024-01-01T00:00:00Z',
        },
        {
          recipeId: 456,
          recipeTitle: 'Recipe 2',
          displayOrder: 2,
          addedBy: 'user123',
          addedAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockedCollectionRecipesApi.reorderRecipes.mockResolvedValue(
        reorderedRecipes
      );

      const { result } = renderHook(() => useReorderRecipes(), {
        wrapper: createWrapper(),
      });

      const reorderData: ReorderRecipesRequest = {
        recipes: [
          { recipeId: 123, displayOrder: 1 },
          { recipeId: 456, displayOrder: 2 },
        ],
      };

      result.current.mutate({
        collectionId: 1,
        data: reorderData,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCollectionRecipesApi.reorderRecipes).toHaveBeenCalledWith(
        1,
        reorderData
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to reorder recipes');
      mockedCollectionRecipesApi.reorderRecipes.mockRejectedValue(error);

      const { result } = renderHook(() => useReorderRecipes(), {
        wrapper: createWrapper(),
      });

      const reorderData: ReorderRecipesRequest = {
        recipes: [{ recipeId: 123, displayOrder: 1 }],
      };

      result.current.mutate({
        collectionId: 1,
        data: reorderData,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
