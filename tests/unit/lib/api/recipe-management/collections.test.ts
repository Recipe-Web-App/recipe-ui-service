import { collectionsApi } from '@/lib/api/recipe-management/collections';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management';
import type {
  CollectionDto,
  CollectionDetailsDto,
  PageCollectionDto,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  SearchCollectionsRequest,
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

describe('Collections API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCollectionDto: CollectionDto = {
    collectionId: 1,
    userId: 'user-123',
    name: 'My Favorites',
    description: 'Best recipes',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 5,
    collaboratorCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockCollectionDetailsDto: CollectionDetailsDto = {
    ...mockCollectionDto,
    recipes: [
      {
        recipeId: 1,
        recipeTitle: 'Pasta',
        displayOrder: 1,
        addedBy: 'user-123',
        addedAt: '2024-01-02T00:00:00Z',
      },
    ],
  };

  const mockPageCollectionDto: PageCollectionDto = {
    content: [mockCollectionDto],
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
    size: 20,
    number: 0,
    sort: { sorted: false, unsorted: true, empty: true },
    empty: false,
  };

  describe('getCollections', () => {
    it('should get all collections without parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const result = await collectionsApi.getCollections();

      expect(mockedClient.get).toHaveBeenCalledWith('/collections');
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should get all collections with pagination parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const params = { page: 1, size: 10, sort: ['name,asc'] };
      await collectionsApi.getCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/collections?page=1&size=10&sort=name%2Casc'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(collectionsApi.getCollections()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('createCollection', () => {
    it('should create a new collection', async () => {
      const createRequest: CreateCollectionRequest = {
        name: 'New Collection',
        description: 'A new collection',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.OWNER_ONLY,
      };

      mockedClient.post.mockResolvedValue({ data: mockCollectionDto });

      const result = await collectionsApi.createCollection(createRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections',
        createRequest
      );
      expect(result).toEqual(mockCollectionDto);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation failed');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionsApi.createCollection({
          name: 'Test',
          visibility: CollectionVisibility.PUBLIC,
          collaborationMode: CollaborationMode.OWNER_ONLY,
        })
      ).rejects.toThrow('Creation failed');
    });

    it('should create collection with recipeIds and collaboratorIds (batch operations)', async () => {
      const createRequest: CreateCollectionRequest = {
        name: 'Batch Collection',
        description: 'With recipes and collaborators',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        recipeIds: [1, 2, 3],
        collaboratorIds: ['uuid-1', 'uuid-2'],
      };

      const mockResponse: CollectionDto = {
        ...mockCollectionDto,
        name: 'Batch Collection',
        description: 'With recipes and collaborators',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        recipeCount: 3,
        collaboratorCount: 2,
      };

      mockedClient.post.mockResolvedValue({ data: mockResponse });

      const result = await collectionsApi.createCollection(createRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections',
        createRequest
      );
      expect(result.recipeCount).toBe(3);
      expect(result.collaboratorCount).toBe(2);
    });

    it('should create collection with only recipeIds', async () => {
      const createRequest: CreateCollectionRequest = {
        name: 'Recipe Collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        recipeIds: [10, 20],
      };

      const mockResponse: CollectionDto = {
        ...mockCollectionDto,
        name: 'Recipe Collection',
        recipeCount: 2,
        collaboratorCount: 0,
      };

      mockedClient.post.mockResolvedValue({ data: mockResponse });

      const result = await collectionsApi.createCollection(createRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections',
        createRequest
      );
      expect(result.recipeCount).toBe(2);
    });
  });

  describe('getCollectionById', () => {
    it('should get a collection by ID', async () => {
      mockedClient.get.mockResolvedValue({ data: mockCollectionDetailsDto });

      const result = await collectionsApi.getCollectionById(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/collections/1');
      expect(result).toEqual(mockCollectionDetailsDto);
    });

    it('should handle errors', async () => {
      const error = new Error('Not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(collectionsApi.getCollectionById(999)).rejects.toThrow(
        'Not found'
      );
    });
  });

  describe('updateCollection', () => {
    it('should update a collection', async () => {
      const updateRequest: UpdateCollectionRequest = {
        name: 'Updated Name',
        visibility: CollectionVisibility.PUBLIC,
      };

      mockedClient.put.mockResolvedValue({ data: mockCollectionDto });

      const result = await collectionsApi.updateCollection(1, updateRequest);

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/collections/1',
        updateRequest
      );
      expect(result).toEqual(mockCollectionDto);
    });

    it('should handle errors', async () => {
      const error = new Error('Update failed');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        collectionsApi.updateCollection(1, { name: 'Test' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteCollection', () => {
    it('should delete a collection', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await collectionsApi.deleteCollection(1);

      expect(mockedClient.delete).toHaveBeenCalledWith('/collections/1');
    });

    it('should handle errors', async () => {
      const error = new Error('Delete failed');
      mockedClient.delete.mockRejectedValue(error);

      await expect(collectionsApi.deleteCollection(1)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('searchCollections', () => {
    it('should search collections without pagination', async () => {
      const searchRequest: SearchCollectionsRequest = {
        query: 'dessert',
      };

      mockedClient.post.mockResolvedValue({ data: mockPageCollectionDto });

      const result = await collectionsApi.searchCollections(searchRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections/search',
        searchRequest
      );
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should search collections with pagination parameters', async () => {
      const searchRequest: SearchCollectionsRequest = {
        query: 'dessert',
        visibility: [CollectionVisibility.PUBLIC],
      };
      const params = { page: 0, size: 20 };

      mockedClient.post.mockResolvedValue({ data: mockPageCollectionDto });

      await collectionsApi.searchCollections(searchRequest, params);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections/search?page=0&size=20',
        searchRequest
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Search failed');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionsApi.searchCollections({ query: 'test' })
      ).rejects.toThrow('Search failed');
    });
  });

  describe('getTrendingCollections', () => {
    it('should get trending collections without parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const result = await collectionsApi.getTrendingCollections();

      expect(mockedClient.get).toHaveBeenCalledWith('/collections/trending');
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should get trending collections with pagination parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const params = { page: 1, size: 10 };
      await collectionsApi.getTrendingCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/collections/trending?page=1&size=10'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockedClient.get.mockRejectedValue(error);

      await expect(collectionsApi.getTrendingCollections()).rejects.toThrow(
        'Network error'
      );
    });
  });
});
