import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRecipeIngredients,
  useScaleIngredients,
  useShoppingList,
  useAddIngredientComment,
  useEditIngredientComment,
  useDeleteIngredientComment,
  useInvalidateIngredients,
} from '@/hooks/recipe-management/useIngredients';
import { ingredientsApi } from '@/lib/api/recipe-management';
import type {
  RecipeIngredientsResponse,
  ShoppingListResponse,
  IngredientCommentResponse,
  AddIngredientCommentRequest,
  EditIngredientCommentRequest,
  DeleteIngredientCommentRequest,
  RecipeIngredientDto,
  IngredientCommentDto,
  ShoppingListItemDto,
} from '@/types/recipe-management';
import { IngredientUnit } from '@/types/recipe-management';

// Mock the API
jest.mock('@/lib/api/recipe-management', () => ({
  ingredientsApi: {
    getRecipeIngredients: jest.fn(),
    scaleIngredients: jest.fn(),
    generateShoppingList: jest.fn(),
    addIngredientComment: jest.fn(),
    editIngredientComment: jest.fn(),
    deleteIngredientComment: jest.fn(),
  },
}));

const mockedIngredientsApi = ingredientsApi as jest.Mocked<
  typeof ingredientsApi
>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useIngredients hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockIngredientDto: RecipeIngredientDto = {
    ingredientId: 1,
    ingredientName: 'Flour',
    quantity: 2,
    unit: IngredientUnit.CUP,
    isOptional: false,
  };

  const mockCommentDto: IngredientCommentDto = {
    commentId: 1,
    recipeId: 1,
    userId: '123',
    commentText: 'Use organic flour if available',
    isPublic: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockIngredientsResponse: RecipeIngredientsResponse = {
    recipeId: 1,
    ingredients: [
      {
        ...mockIngredientDto,
        comments: [mockCommentDto],
      },
      {
        ingredientId: 2,
        ingredientName: 'Sugar',
        quantity: 1,
        unit: IngredientUnit.CUP,
        isOptional: false,
        comments: [],
      },
    ],
  };

  const mockShoppingListItem: ShoppingListItemDto = {
    name: 'Flour',
    quantity: 2,
    unit: IngredientUnit.CUP,
    category: 'Baking',
    notes: 'Aisle 5',
  };

  const mockShoppingListResponse: ShoppingListResponse = {
    recipeId: 1,
    recipeTitle: 'Chocolate Chip Cookies',
    items: [mockShoppingListItem],
    generatedAt: '2023-01-01T00:00:00Z',
  };

  const mockCommentResponse: IngredientCommentResponse = {
    comment: mockCommentDto,
    status: 'success',
  };

  describe('useRecipeIngredients', () => {
    it('should fetch recipe ingredients successfully', async () => {
      mockedIngredientsApi.getRecipeIngredients.mockResolvedValue(
        mockIngredientsResponse
      );

      const { result } = renderHook(() => useRecipeIngredients(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedIngredientsApi.getRecipeIngredients).toHaveBeenCalledWith(1);
      expect(result.current.data).toEqual(mockIngredientsResponse);
    });

    it('should not fetch when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeIngredients(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedIngredientsApi.getRecipeIngredients).not.toHaveBeenCalled();
    });

    it('should handle negative recipeId by attempting to fetch', async () => {
      const error = new Error('Invalid recipe ID');
      mockedIngredientsApi.getRecipeIngredients.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeIngredients(-1), {
        wrapper: createWrapper(),
      });

      // The hook will attempt to fetch (since -1 is truthy), but it should fail
      await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));
      expect(mockedIngredientsApi.getRecipeIngredients).toHaveBeenCalledWith(
        -1
      );
      expect(result.current.isError).toBe(true);
    });

    it('should handle ingredients fetch failure gracefully', async () => {
      const error = new Error('Failed to fetch ingredients');
      mockedIngredientsApi.getRecipeIngredients.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeIngredients(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));
      expect(result.current.isError).toBe(true);
    });

    it('should refetch when recipeId changes', async () => {
      mockedIngredientsApi.getRecipeIngredients.mockResolvedValue(
        mockIngredientsResponse
      );

      const { result, rerender } = renderHook(
        ({ recipeId }) => useRecipeIngredients(recipeId),
        {
          wrapper: createWrapper(),
          initialProps: { recipeId: 1 },
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedIngredientsApi.getRecipeIngredients).toHaveBeenCalledWith(1);

      // Change recipe ID
      const newIngredientsResponse = {
        ...mockIngredientsResponse,
        recipeId: 2,
      };
      mockedIngredientsApi.getRecipeIngredients.mockResolvedValue(
        newIngredientsResponse
      );

      rerender({ recipeId: 2 });

      await waitFor(() => expect(result.current.data?.recipeId).toBe(2));
      expect(mockedIngredientsApi.getRecipeIngredients).toHaveBeenCalledWith(2);
    });
  });

  describe('useScaleIngredients', () => {
    it('should scale ingredients successfully', async () => {
      const scaledResponse = {
        ...mockIngredientsResponse,
        ingredients: mockIngredientsResponse.ingredients.map(ing => ({
          ...ing,
          quantity: ing.quantity * 2,
        })),
      };

      mockedIngredientsApi.scaleIngredients.mockResolvedValue(scaledResponse);

      const { result } = renderHook(
        () => useScaleIngredients(1, { quantity: 2 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedIngredientsApi.scaleIngredients).toHaveBeenCalledWith(1, {
        quantity: 2,
      });
      expect(result.current.data).toEqual(scaledResponse);
      expect(result.current.data?.ingredients[0].quantity).toBe(4); // 2 * 2
    });

    it('should not scale when recipeId is falsy', () => {
      const { result } = renderHook(
        () => useScaleIngredients(0, { quantity: 2 }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedIngredientsApi.scaleIngredients).not.toHaveBeenCalled();
    });

    it('should not scale when quantity is 0', () => {
      const { result } = renderHook(
        () => useScaleIngredients(1, { quantity: 0 }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedIngredientsApi.scaleIngredients).not.toHaveBeenCalled();
    });

    it('should not scale when enabled is false', () => {
      const { result } = renderHook(
        () => useScaleIngredients(1, { quantity: 2 }, false),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedIngredientsApi.scaleIngredients).not.toHaveBeenCalled();
    });

    it('should handle negative scaling factors', async () => {
      const scaledResponse = {
        ...mockIngredientsResponse,
        ingredients: mockIngredientsResponse.ingredients.map(ing => ({
          ...ing,
          quantity: Math.abs(ing.quantity * -0.5),
        })),
      };

      mockedIngredientsApi.scaleIngredients.mockResolvedValue(scaledResponse);

      const { result } = renderHook(
        () => useScaleIngredients(1, { quantity: -0.5 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedIngredientsApi.scaleIngredients).toHaveBeenCalledWith(1, {
        quantity: -0.5,
      });
    });

    it('should handle decimal scaling factors', async () => {
      const scaledResponse = {
        ...mockIngredientsResponse,
        ingredients: mockIngredientsResponse.ingredients.map(ing => ({
          ...ing,
          quantity: ing.quantity * 1.5,
        })),
      };

      mockedIngredientsApi.scaleIngredients.mockResolvedValue(scaledResponse);

      const { result } = renderHook(
        () => useScaleIngredients(1, { quantity: 1.5 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.ingredients[0].quantity).toBe(3); // 2 * 1.5
    });
  });

  describe('useShoppingList', () => {
    it('should generate shopping list successfully', async () => {
      mockedIngredientsApi.generateShoppingList.mockResolvedValue(
        mockShoppingListResponse
      );

      const { result } = renderHook(() => useShoppingList(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedIngredientsApi.generateShoppingList).toHaveBeenCalledWith(1);
      expect(result.current.data).toEqual(mockShoppingListResponse);
    });

    it('should not generate when recipeId is falsy', () => {
      const { result } = renderHook(() => useShoppingList(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedIngredientsApi.generateShoppingList).not.toHaveBeenCalled();
    });

    it('should not generate when enabled is false', () => {
      const { result } = renderHook(() => useShoppingList(1, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedIngredientsApi.generateShoppingList).not.toHaveBeenCalled();
    });

    it('should handle empty shopping list', async () => {
      const emptyShoppingList: ShoppingListResponse = {
        recipeId: 1,
        recipeTitle: 'Empty Recipe',
        items: [],
        generatedAt: '2023-01-01T00:00:00Z',
      };

      mockedIngredientsApi.generateShoppingList.mockResolvedValue(
        emptyShoppingList
      );

      const { result } = renderHook(() => useShoppingList(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.items).toHaveLength(0);
    });

    it('should handle shopping list with multiple categories', async () => {
      const multiCategoryList: ShoppingListResponse = {
        recipeId: 1,
        recipeTitle: 'Complex Recipe',
        items: [
          {
            name: 'Flour',
            quantity: 2,
            unit: IngredientUnit.CUP,
            category: 'Baking',
            notes: 'Aisle 5',
          },
          {
            name: 'Chicken',
            quantity: 1,
            unit: IngredientUnit.LB,
            category: 'Meat',
            notes: 'Aisle 1',
          },
          {
            name: 'Milk',
            quantity: 1,
            unit: IngredientUnit.CUP,
            category: 'Dairy',
            notes: 'Aisle 10',
          },
        ],
        generatedAt: '2023-01-01T00:00:00Z',
      };

      mockedIngredientsApi.generateShoppingList.mockResolvedValue(
        multiCategoryList
      );

      const { result } = renderHook(() => useShoppingList(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.items).toHaveLength(3);
      expect(result.current.data?.items.map(item => item.category)).toEqual([
        'Baking',
        'Meat',
        'Dairy',
      ]);
    });
  });

  describe('useAddIngredientComment', () => {
    it('should add ingredient comment successfully', async () => {
      mockedIngredientsApi.addIngredientComment.mockResolvedValue(
        mockCommentResponse
      );

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useAddIngredientComment(), {
        wrapper,
      });

      const commentData: AddIngredientCommentRequest = {
        comment: 'Great ingredient!',
        userId: 123,
      };

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: commentData,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedIngredientsApi.addIngredientComment).toHaveBeenCalledWith(
        1,
        1,
        commentData
      );
      expect(result.current.data).toEqual(mockCommentResponse);
      expect(invalidateSpy).toHaveBeenCalledTimes(2); // Two invalidateQueries calls
    });

    it('should handle add comment failure', async () => {
      const error = new Error('Failed to add comment');
      mockedIngredientsApi.addIngredientComment.mockRejectedValue(error);

      const { result } = renderHook(() => useAddIngredientComment(), {
        wrapper: createWrapper(),
      });

      const commentData: AddIngredientCommentRequest = {
        comment: 'Failed comment',
        userId: 123,
      };

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: commentData,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should invalidate correct queries on success', async () => {
      mockedIngredientsApi.addIngredientComment.mockResolvedValue(
        mockCommentResponse
      );

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useAddIngredientComment(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: { comment: 'Test', userId: 123 },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should invalidate recipe ingredients and specific ingredient comments
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'recipeIngredients',
          1,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'ingredients',
          1,
          1,
          'comments',
        ]),
      });
    });
  });

  describe('useEditIngredientComment', () => {
    it('should edit ingredient comment successfully', async () => {
      const editedComment = {
        ...mockCommentResponse,
        comment: {
          ...mockCommentDto,
          comment: 'Updated comment',
          updatedAt: '2023-01-02T00:00:00Z',
        },
      };

      mockedIngredientsApi.editIngredientComment.mockResolvedValue(
        editedComment
      );

      const { result } = renderHook(() => useEditIngredientComment(), {
        wrapper: createWrapper(),
      });

      const editData: EditIngredientCommentRequest = {
        commentId: 1,
        comment: 'Updated comment',
        userId: 123,
      };

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: editData,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedIngredientsApi.editIngredientComment).toHaveBeenCalledWith(
        1,
        1,
        editData
      );
      expect(result.current.data).toEqual(editedComment);
    });

    it('should handle edit comment failure', async () => {
      const error = new Error('Failed to edit comment');
      mockedIngredientsApi.editIngredientComment.mockRejectedValue(error);

      const { result } = renderHook(() => useEditIngredientComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: { commentId: 1, comment: 'Failed edit', userId: 123 },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should invalidate queries after successful edit', async () => {
      mockedIngredientsApi.editIngredientComment.mockResolvedValue(
        mockCommentResponse
      );

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useEditIngredientComment(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: { commentId: 1, comment: 'Edit test', userId: 123 },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('useDeleteIngredientComment', () => {
    it('should delete ingredient comment successfully', async () => {
      const deleteResponse: IngredientCommentResponse = {
        status: 'deleted',
      };

      mockedIngredientsApi.deleteIngredientComment.mockResolvedValue(
        deleteResponse
      );

      const { result } = renderHook(() => useDeleteIngredientComment(), {
        wrapper: createWrapper(),
      });

      const deleteData: DeleteIngredientCommentRequest = {
        commentId: 1,
        userId: 123,
      };

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: deleteData,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedIngredientsApi.deleteIngredientComment).toHaveBeenCalledWith(
        1,
        1,
        deleteData
      );
      expect(result.current.data).toEqual(deleteResponse);
    });

    it('should handle delete comment failure', async () => {
      const error = new Error('Failed to delete comment');
      mockedIngredientsApi.deleteIngredientComment.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteIngredientComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: { commentId: 1, userId: 123 },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should invalidate queries after successful deletion', async () => {
      const deleteResponse: IngredientCommentResponse = { status: 'deleted' };
      mockedIngredientsApi.deleteIngredientComment.mockResolvedValue(
        deleteResponse
      );

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useDeleteIngredientComment(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: { commentId: 1, userId: 123 },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('useInvalidateIngredients', () => {
    it('should return a function that invalidates ingredient queries', () => {
      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useInvalidateIngredients(), {
        wrapper,
      });

      expect(typeof result.current).toBe('function');

      // Call the returned function
      result.current(1);

      expect(invalidateSpy).toHaveBeenCalledTimes(2);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'recipeIngredients',
          1,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'ingredients',
          1,
        ]),
      });
    });

    it('should handle multiple recipe invalidations', () => {
      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useInvalidateIngredients(), {
        wrapper,
      });

      // Invalidate multiple recipes
      result.current(1);
      result.current(2);
      result.current(3);

      expect(invalidateSpy).toHaveBeenCalledTimes(6); // 2 calls per recipe × 3 recipes
    });
  });

  describe('Integration tests', () => {
    it('should work together: fetch ingredients, add comment, and invalidate', async () => {
      mockedIngredientsApi.getRecipeIngredients.mockResolvedValue(
        mockIngredientsResponse
      );
      mockedIngredientsApi.addIngredientComment.mockResolvedValue(
        mockCommentResponse
      );

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result: ingredientsResult } = renderHook(
        () => useRecipeIngredients(1),
        { wrapper }
      );
      const { result: addCommentResult } = renderHook(
        () => useAddIngredientComment(),
        { wrapper }
      );

      // First fetch ingredients
      await waitFor(() =>
        expect(ingredientsResult.current.isSuccess).toBe(true)
      );

      // Then add a comment
      addCommentResult.current.mutate({
        recipeId: 1,
        ingredientId: 1,
        data: { comment: 'Test comment', userId: 123 },
      });

      await waitFor(() =>
        expect(addCommentResult.current.isSuccess).toBe(true)
      );

      // Verify invalidation happened
      expect(invalidateSpy).toHaveBeenCalled();
    });

    it('should handle scaling ingredients with different quantities', async () => {
      const baseIngredients = mockIngredientsResponse;

      // Test different scaling factors
      const scalingFactors = [0.5, 1.5, 2, 3];

      for (const factor of scalingFactors) {
        const scaledResponse = {
          ...baseIngredients,
          ingredients: baseIngredients.ingredients.map(ing => ({
            ...ing,
            quantity: ing.quantity * factor,
          })),
        };

        mockedIngredientsApi.scaleIngredients.mockResolvedValue(scaledResponse);

        const { result } = renderHook(
          () => useScaleIngredients(1, { quantity: factor }),
          { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data?.ingredients[0].quantity).toBe(
          mockIngredientDto.quantity * factor
        );
      }
    });
  });
});
