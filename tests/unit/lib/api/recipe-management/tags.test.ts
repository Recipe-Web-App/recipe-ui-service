import { tagsApi } from '@/lib/api/recipe-management/tags';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  TagResponse,
  RecipeTagDto,
  AddTagRequest,
  RemoveTagRequest,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Tags API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTag: RecipeTagDto = {
    tagId: 1,
    name: 'Italian',
    category: 'cuisine',
    description: 'Italian cuisine tag',
    usageCount: 150,
  };

  const mockTagResponse: TagResponse = {
    recipeId: 1,
    tags: [mockTag],
    tag: mockTag,
  };

  describe('getRecipeTags', () => {
    it('should get recipe tags', async () => {
      mockedClient.get.mockResolvedValue({ data: mockTagResponse });

      const result = await tagsApi.getRecipeTags(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/tags');
      expect(result).toEqual(mockTagResponse);
    });

    it('should handle empty tags list', async () => {
      const emptyTagResponse: TagResponse = {
        tags: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyTagResponse });

      const result = await tagsApi.getRecipeTags(1);

      expect(result).toEqual(emptyTagResponse);
    });

    it('should handle multiple tags', async () => {
      const multipleTags: RecipeTagDto[] = [
        {
          tagId: 1,
          name: 'Italian',
          category: 'cuisine',
        },
        {
          tagId: 2,
          name: 'Pasta',
          category: 'ingredient',
        },
        {
          tagId: 3,
          name: 'Quick',
          category: 'time',
        },
      ];

      const multipleTagsResponse: TagResponse = {
        tags: multipleTags,
      };

      mockedClient.get.mockResolvedValue({ data: multipleTagsResponse });

      const result = await tagsApi.getRecipeTags(1);

      expect(result.tags!).toHaveLength(3);
    });

    it('should handle recipe not found error', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(tagsApi.getRecipeTags(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('addTagToRecipe', () => {
    it('should add a new tag to recipe', async () => {
      const addRequest: AddTagRequest = {
        tagName: 'Vegetarian',
      };

      const newTag: RecipeTagDto = {
        tagId: 2,
        name: 'Vegetarian',
        category: 'dietary',
      };

      const updatedResponse: TagResponse = {
        tags: [mockTag, newTag],
        tag: newTag,
        addedAt: '2023-01-01T11:00:00Z',
      };

      mockedClient.post.mockResolvedValue({ data: updatedResponse });

      const result = await tagsApi.addTagToRecipe(1, addRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/1/tags',
        addRequest
      );
      expect(result).toEqual(updatedResponse);
      expect(result.tags!).toHaveLength(2);
    });

    it('should handle duplicate tag addition', async () => {
      const addRequest: AddTagRequest = {
        tagName: 'Italian', // Tag already exists
      };

      const error = new Error('Tag already exists');
      mockedClient.post.mockRejectedValue(error);

      await expect(tagsApi.addTagToRecipe(1, addRequest)).rejects.toThrow(
        'Tag already exists'
      );
    });

    it('should handle invalid tag names', async () => {
      const addRequest: AddTagRequest = {
        tagName: '', // Empty tag name
      };

      const error = new Error('Tag name cannot be empty');
      mockedClient.post.mockRejectedValue(error);

      await expect(tagsApi.addTagToRecipe(1, addRequest)).rejects.toThrow(
        'Tag name cannot be empty'
      );
    });

    it('should handle very long tag names', async () => {
      const longTagName = 'A'.repeat(100);
      const addRequest: AddTagRequest = {
        tagName: longTagName,
      };

      const error = new Error('Tag name too long');
      mockedClient.post.mockRejectedValue(error);

      await expect(tagsApi.addTagToRecipe(1, addRequest)).rejects.toThrow(
        'Tag name too long'
      );
    });

    it('should handle special characters in tag names', async () => {
      const addRequest: AddTagRequest = {
        tagName: 'Gluten-Free & Vegan',
      };

      const newTag: RecipeTagDto = {
        tagId: 2,
        name: 'Gluten-Free & Vegan',
        category: 'dietary',
      };

      const updatedResponse: TagResponse = {
        tags: [mockTag, newTag],
      };

      mockedClient.post.mockResolvedValue({ data: updatedResponse });

      const result = await tagsApi.addTagToRecipe(1, addRequest);

      expect(result.tags![1].name).toBe('Gluten-Free & Vegan');
    });
  });

  describe('removeTagFromRecipe', () => {
    it('should remove tag from recipe', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Italian',
      };

      const updatedResponse: TagResponse = {
        tags: [],
      };

      mockedClient.delete.mockResolvedValue({ data: updatedResponse });

      const result = await tagsApi.removeTagFromRecipe(1, removeRequest);

      expect(mockedClient.delete).toHaveBeenCalledWith('/recipes/1/tags', {
        data: removeRequest,
      });
      expect(result).toEqual(updatedResponse);
    });

    it('should handle removing specific tag from multiple tags', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Italian',
      };

      const remainingTag: RecipeTagDto = {
        tagId: 2,
        name: 'Quick',
        category: 'prep-time',
      };

      const updatedResponse: TagResponse = {
        tags: [remainingTag],
      };

      mockedClient.delete.mockResolvedValue({ data: updatedResponse });

      const result = await tagsApi.removeTagFromRecipe(1, removeRequest);

      expect(result.tags![0].name).toBe('Quick');
    });

    it('should handle removing non-existent tag', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'NonExistentTag',
      };

      const error = new Error('Tag not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        tagsApi.removeTagFromRecipe(1, removeRequest)
      ).rejects.toThrow('Tag not found');
    });

    it('should handle permission errors when removing tags', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Italian',
      };

      const error = new Error('Permission denied');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        tagsApi.removeTagFromRecipe(1, removeRequest)
      ).rejects.toThrow('Permission denied');
    });

    it('should handle recipe not found during tag removal', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Italian',
      };

      const error = new Error('Recipe not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        tagsApi.removeTagFromRecipe(999, removeRequest)
      ).rejects.toThrow('Recipe not found');
    });

    it('should handle case-sensitive tag removal', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'italian', // lowercase
      };

      const error = new Error('Tag not found'); // Assuming case-sensitive matching
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        tagsApi.removeTagFromRecipe(1, removeRequest)
      ).rejects.toThrow('Tag not found');
    });
  });
});
