import { collectionTagsApi } from '@/lib/api/recipe-management/collection-tags';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  CollectionTagResponse,
  CollectionTagDto,
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

describe('Collection Tags API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTag: CollectionTagDto = {
    tagId: 1,
    name: 'Desserts',
  };

  const mockTagResponse: CollectionTagResponse = {
    collectionId: 1,
    tags: [mockTag],
  };

  describe('getCollectionTags', () => {
    it('should get collection tags', async () => {
      mockedClient.get.mockResolvedValue({ data: mockTagResponse });

      const result = await collectionTagsApi.getCollectionTags(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/collections/1/tags');
      expect(result).toEqual(mockTagResponse);
    });

    it('should handle empty tags list', async () => {
      const emptyTagResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyTagResponse });

      const result = await collectionTagsApi.getCollectionTags(1);

      expect(result).toEqual(emptyTagResponse);
      expect(result.tags).toHaveLength(0);
    });

    it('should handle multiple tags', async () => {
      const multipleTags: CollectionTagDto[] = [
        { tagId: 1, name: 'Desserts' },
        { tagId: 2, name: 'Quick Meals' },
        { tagId: 3, name: 'Family Favorites' },
      ];

      const multipleTagsResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: multipleTags,
      };

      mockedClient.get.mockResolvedValue({ data: multipleTagsResponse });

      const result = await collectionTagsApi.getCollectionTags(1);

      expect(result.tags).toHaveLength(3);
    });

    it('should handle collection not found error', async () => {
      const error = new Error('Collection not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(collectionTagsApi.getCollectionTags(999)).rejects.toThrow(
        'Collection not found'
      );
    });

    it('should handle unauthorized access error', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(collectionTagsApi.getCollectionTags(1)).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('addTagToCollection', () => {
    it('should add a new tag to collection', async () => {
      const addRequest: AddTagRequest = {
        name: 'Vegetarian',
      };

      const newTag: CollectionTagDto = {
        tagId: 2,
        name: 'Vegetarian',
      };

      const updatedResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [mockTag, newTag],
      };

      mockedClient.post.mockResolvedValue({ data: updatedResponse });

      const result = await collectionTagsApi.addTagToCollection(1, addRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections/1/tags',
        addRequest
      );
      expect(result).toEqual(updatedResponse);
      expect(result.tags).toHaveLength(2);
    });

    it('should handle duplicate tag addition (conflict)', async () => {
      const addRequest: AddTagRequest = {
        name: 'Desserts', // Tag already exists
      };

      const error = new Error('Tag already exists on this collection');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionTagsApi.addTagToCollection(1, addRequest)
      ).rejects.toThrow('Tag already exists on this collection');
    });

    it('should handle invalid tag names', async () => {
      const addRequest: AddTagRequest = {
        name: '', // Empty tag name
      };

      const error = new Error('Tag name cannot be empty');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionTagsApi.addTagToCollection(1, addRequest)
      ).rejects.toThrow('Tag name cannot be empty');
    });

    it('should handle very long tag names', async () => {
      const longTagName = 'A'.repeat(100);
      const addRequest: AddTagRequest = {
        name: longTagName,
      };

      const error = new Error('Tag name exceeds maximum length');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionTagsApi.addTagToCollection(1, addRequest)
      ).rejects.toThrow('Tag name exceeds maximum length');
    });

    it('should handle special characters in tag names', async () => {
      const addRequest: AddTagRequest = {
        name: 'Gluten-Free & Vegan',
      };

      const newTag: CollectionTagDto = {
        tagId: 2,
        name: 'Gluten-Free & Vegan',
      };

      const updatedResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [mockTag, newTag],
      };

      mockedClient.post.mockResolvedValue({ data: updatedResponse });

      const result = await collectionTagsApi.addTagToCollection(1, addRequest);

      expect(result.tags[1].name).toBe('Gluten-Free & Vegan');
    });

    it('should handle collection not found when adding tag', async () => {
      const addRequest: AddTagRequest = {
        name: 'NewTag',
      };

      const error = new Error('Collection not found');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionTagsApi.addTagToCollection(999, addRequest)
      ).rejects.toThrow('Collection not found');
    });

    it('should handle permission denied when adding tag', async () => {
      const addRequest: AddTagRequest = {
        name: 'NewTag',
      };

      const error = new Error('Permission denied');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionTagsApi.addTagToCollection(1, addRequest)
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('removeTagFromCollection', () => {
    it('should remove tag from collection', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const updatedResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [],
      };

      mockedClient.delete.mockResolvedValue({ data: updatedResponse });

      const result = await collectionTagsApi.removeTagFromCollection(
        1,
        removeRequest
      );

      expect(mockedClient.delete).toHaveBeenCalledWith('/collections/1/tags', {
        data: removeRequest,
      });
      expect(result).toEqual(updatedResponse);
    });

    it('should handle removing specific tag from multiple tags', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const remainingTag: CollectionTagDto = {
        tagId: 2,
        name: 'Quick Meals',
      };

      const updatedResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [remainingTag],
      };

      mockedClient.delete.mockResolvedValue({ data: updatedResponse });

      const result = await collectionTagsApi.removeTagFromCollection(
        1,
        removeRequest
      );

      expect(result.tags[0].name).toBe('Quick Meals');
      expect(result.tags).toHaveLength(1);
    });

    it('should handle removing non-existent tag', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'NonExistentTag',
      };

      const error = new Error('Tag not found on this collection');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionTagsApi.removeTagFromCollection(1, removeRequest)
      ).rejects.toThrow('Tag not found on this collection');
    });

    it('should handle permission errors when removing tags', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const error = new Error('Permission denied');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionTagsApi.removeTagFromCollection(1, removeRequest)
      ).rejects.toThrow('Permission denied');
    });

    it('should handle collection not found during tag removal', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const error = new Error('Collection not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionTagsApi.removeTagFromCollection(999, removeRequest)
      ).rejects.toThrow('Collection not found');
    });

    it('should handle case-sensitive tag removal', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'desserts', // lowercase
      };

      const error = new Error('Tag not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionTagsApi.removeTagFromCollection(1, removeRequest)
      ).rejects.toThrow('Tag not found');
    });

    it('should handle network error during removal', async () => {
      const removeRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const error = new Error('Network error');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionTagsApi.removeTagFromCollection(1, removeRequest)
      ).rejects.toThrow('Network error');
    });
  });
});
