import { ingredientsApi } from '@/lib/api/recipe-management/ingredients';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeIngredientsResponse,
  RecipeIngredientDto,
  ShoppingListResponse,
  ShoppingListItemDto,
  AddIngredientCommentRequest,
  EditIngredientCommentRequest,
  DeleteIngredientCommentRequest,
  IngredientCommentResponse,
  IngredientCommentDto,
  IngredientUnit,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/recipe-management/client')
    .buildQueryParams,
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Ingredients API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockIngredient: RecipeIngredientDto = {
    ingredientId: 1,
    recipeId: 1,
    ingredientName: 'Flour',
    quantity: 2,
    unit: 'CUP' as IngredientUnit,
    isOptional: false,
    comments: [],
  };

  const mockIngredientsResponse: RecipeIngredientsResponse = {
    recipeId: 1,
    ingredients: [
      {
        ...mockIngredient,
        comments: [],
      },
    ],
  };

  const mockShoppingListItem: ShoppingListItemDto = {
    name: 'Flour',
    quantity: 2,
    unit: 'CUP' as IngredientUnit,
    category: 'Baking',
    notes: 'All-purpose flour',
  };

  const mockShoppingListResponse: ShoppingListResponse = {
    recipeId: 1,
    recipeTitle: 'Test Recipe',
    items: [mockShoppingListItem],
    generatedAt: '2023-01-01T10:00:00Z',
  };

  const mockIngredientComment: IngredientCommentDto = {
    commentId: 1,
    recipeId: 1,
    userId: 'user-123',
    commentText: 'Great ingredient!',
    isPublic: true,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
  };

  const mockCommentResponse: IngredientCommentResponse = {
    status: 'success',
    comment: mockIngredientComment,
  };

  describe('getRecipeIngredients', () => {
    it('should get recipe ingredients', async () => {
      mockedClient.get.mockResolvedValue({ data: mockIngredientsResponse });

      const result = await ingredientsApi.getRecipeIngredients(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/ingredients');
      expect(result).toEqual(mockIngredientsResponse);
    });

    it('should handle errors when getting ingredients', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(ingredientsApi.getRecipeIngredients(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('scaleIngredients', () => {
    it('should scale ingredients with valid quantity', async () => {
      const scaledResponse = {
        ...mockIngredientsResponse,
        ingredients: [
          {
            ...mockIngredient,
            quantity: 4, // doubled
            comments: [],
          },
        ],
      };

      mockedClient.get.mockResolvedValue({ data: scaledResponse });

      const result = await ingredientsApi.scaleIngredients(1, { quantity: 2 });

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes/1/ingredients/scale?quantity=2'
      );
      expect(result).toEqual(scaledResponse);
    });

    it('should handle fractional scaling', async () => {
      const scaledResponse = {
        ...mockIngredientsResponse,
        ingredients: [
          {
            ...mockIngredient,
            quantity: 1, // halved
            comments: [],
          },
        ],
      };

      mockedClient.get.mockResolvedValue({ data: scaledResponse });

      const result = await ingredientsApi.scaleIngredients(1, {
        quantity: 0.5,
      });

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes/1/ingredients/scale?quantity=0.5'
      );
      expect(result).toEqual(scaledResponse);
    });

    it('should handle scaling errors', async () => {
      const error = new Error('Invalid scaling factor');
      mockedClient.get.mockRejectedValue(error);

      await expect(
        ingredientsApi.scaleIngredients(1, { quantity: -1 })
      ).rejects.toThrow('Invalid scaling factor');
    });
  });

  describe('generateShoppingList', () => {
    it('should generate shopping list for recipe', async () => {
      mockedClient.get.mockResolvedValue({ data: mockShoppingListResponse });

      const result = await ingredientsApi.generateShoppingList(1);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes/1/ingredients/shopping-list'
      );
      expect(result).toEqual(mockShoppingListResponse);
    });

    it('should handle empty shopping list', async () => {
      const emptyResponse: ShoppingListResponse = {
        recipeId: 1,
        recipeTitle: 'Empty Recipe',
        items: [],
        generatedAt: '2023-01-01T10:00:00Z',
      };

      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await ingredientsApi.generateShoppingList(1);

      expect(result).toEqual(emptyResponse);
    });

    it('should handle shopping list generation errors', async () => {
      const error = new Error('Unable to generate shopping list');
      mockedClient.get.mockRejectedValue(error);

      await expect(ingredientsApi.generateShoppingList(999)).rejects.toThrow(
        'Unable to generate shopping list'
      );
    });
  });

  describe('addIngredientComment', () => {
    it('should add ingredient comment', async () => {
      const commentRequest: AddIngredientCommentRequest = {
        comment: 'This ingredient works well',
        userId: 1,
      };

      mockedClient.post.mockResolvedValue({ data: mockCommentResponse });

      const result = await ingredientsApi.addIngredientComment(
        1,
        1,
        commentRequest
      );

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/1/ingredients/1/comment',
        commentRequest
      );
      expect(result).toEqual(mockCommentResponse);
    });

    it('should handle comment validation errors', async () => {
      const invalidComment: AddIngredientCommentRequest = {
        comment: '',
        userId: 1,
      };

      const error = new Error('Comment cannot be empty');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        ingredientsApi.addIngredientComment(1, 1, invalidComment)
      ).rejects.toThrow('Comment cannot be empty');
    });
  });

  describe('editIngredientComment', () => {
    it('should edit ingredient comment', async () => {
      const editRequest: EditIngredientCommentRequest = {
        commentId: 1,
        comment: 'Updated comment',
        userId: 1,
      };

      const updatedCommentResponse = {
        ...mockCommentResponse,
        comment: {
          ...mockIngredientComment,
          commentText: 'Updated comment',
          updatedAt: '2023-01-02T10:00:00Z',
        },
      };

      mockedClient.put.mockResolvedValue({ data: updatedCommentResponse });

      const result = await ingredientsApi.editIngredientComment(
        1,
        1,
        editRequest
      );

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/recipes/1/ingredients/1/comment',
        editRequest
      );
      expect(result).toEqual(updatedCommentResponse);
    });

    it('should handle edit comment errors', async () => {
      const editRequest: EditIngredientCommentRequest = {
        commentId: 1,
        comment: 'Updated comment',
        userId: 1,
      };

      const error = new Error('Comment not found');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        ingredientsApi.editIngredientComment(1, 999, editRequest)
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('deleteIngredientComment', () => {
    it('should delete ingredient comment', async () => {
      const deleteRequest: DeleteIngredientCommentRequest = {
        commentId: 1,
        userId: 1,
      };

      const deleteResponse = {
        status: 'success',
      };

      mockedClient.delete.mockResolvedValue({ data: deleteResponse });

      const result = await ingredientsApi.deleteIngredientComment(
        1,
        1,
        deleteRequest
      );

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/recipes/1/ingredients/1/comment',
        { data: deleteRequest }
      );
      expect(result).toEqual(deleteResponse);
    });

    it('should handle delete comment errors', async () => {
      const deleteRequest: DeleteIngredientCommentRequest = {
        commentId: 1,
        userId: 1,
      };

      const error = new Error('Comment already deleted');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        ingredientsApi.deleteIngredientComment(1, 999, deleteRequest)
      ).rejects.toThrow('Comment already deleted');
    });

    it('should handle delete comment successfully', async () => {
      const deleteRequest: DeleteIngredientCommentRequest = {
        commentId: 1,
        userId: 1,
      };

      const deleteResponse = {
        status: 'success',
      };

      mockedClient.delete.mockResolvedValue({ data: deleteResponse });

      const result = await ingredientsApi.deleteIngredientComment(
        1,
        1,
        deleteRequest
      );

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/recipes/1/ingredients/1/comment',
        { data: deleteRequest }
      );
      expect(result).toEqual(deleteResponse);
    });
  });
});
