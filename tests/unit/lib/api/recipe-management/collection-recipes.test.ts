import { collectionRecipesApi } from '@/lib/api/recipe-management/collection-recipes';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  CollectionRecipeDto,
  UpdateRecipeOrderRequest,
  ReorderRecipesRequest,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Collection Recipes API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCollectionRecipeDto: CollectionRecipeDto = {
    recipeId: 123,
    recipeTitle: 'Chocolate Cake',
    displayOrder: 1,
    addedBy: 'user-123',
    addedAt: '2024-01-01T00:00:00Z',
  };

  describe('addRecipeToCollection', () => {
    it('should add a recipe to a collection', async () => {
      mockedClient.post.mockResolvedValue({ data: mockCollectionRecipeDto });

      const result = await collectionRecipesApi.addRecipeToCollection(1, 123);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections/1/recipes/123'
      );
      expect(result).toEqual(mockCollectionRecipeDto);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add recipe');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionRecipesApi.addRecipeToCollection(1, 123)
      ).rejects.toThrow('Failed to add recipe');
    });
  });

  describe('removeRecipeFromCollection', () => {
    it('should remove a recipe from a collection', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await collectionRecipesApi.removeRecipeFromCollection(1, 123);

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/collections/1/recipes/123'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to remove recipe');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionRecipesApi.removeRecipeFromCollection(1, 123)
      ).rejects.toThrow('Failed to remove recipe');
    });
  });

  describe('updateRecipeOrder', () => {
    it('should update recipe display order', async () => {
      const updateRequest: UpdateRecipeOrderRequest = {
        displayOrder: 5,
      };

      mockedClient.patch.mockResolvedValue({ data: mockCollectionRecipeDto });

      const result = await collectionRecipesApi.updateRecipeOrder(
        1,
        123,
        updateRequest
      );

      expect(mockedClient.patch).toHaveBeenCalledWith(
        '/collections/1/recipes/123',
        updateRequest
      );
      expect(result).toEqual(mockCollectionRecipeDto);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to update order');
      mockedClient.patch.mockRejectedValue(error);

      await expect(
        collectionRecipesApi.updateRecipeOrder(1, 123, { displayOrder: 5 })
      ).rejects.toThrow('Failed to update order');
    });
  });

  describe('reorderRecipes', () => {
    it('should batch reorder recipes', async () => {
      const reorderRequest: ReorderRecipesRequest = {
        recipes: [
          { recipeId: 123, displayOrder: 1 },
          { recipeId: 456, displayOrder: 2 },
        ],
      };

      const mockReorderedRecipes: CollectionRecipeDto[] = [
        {
          recipeId: 123,
          recipeTitle: 'Recipe 1',
          displayOrder: 1,
          addedBy: 'user-123',
          addedAt: '2024-01-01T00:00:00Z',
        },
        {
          recipeId: 456,
          recipeTitle: 'Recipe 2',
          displayOrder: 2,
          addedBy: 'user-123',
          addedAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockedClient.put.mockResolvedValue({ data: mockReorderedRecipes });

      const result = await collectionRecipesApi.reorderRecipes(
        1,
        reorderRequest
      );

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/collections/1/recipes/reorder',
        reorderRequest
      );
      expect(result).toEqual(mockReorderedRecipes);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to reorder recipes');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        collectionRecipesApi.reorderRecipes(1, {
          recipes: [{ recipeId: 123, displayOrder: 1 }],
        })
      ).rejects.toThrow('Failed to reorder recipes');
    });
  });
});
