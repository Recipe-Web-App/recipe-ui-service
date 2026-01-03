import { collectionFavoritesApi } from '@/lib/api/recipe-management/collection-favorites';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  CollectionFavoriteDto,
  GetFavoriteCollectionsParams,
  PageCollectionDto,
} from '@/types/recipe-management';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

// Mock the client
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

describe('Collection Favorites API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCollectionFavoriteDto: CollectionFavoriteDto = {
    collectionId: 301,
    userId: 'user-456-uuid',
    favoritedAt: '2023-01-01T10:00:00Z',
  };

  const mockPageCollectionDto: PageCollectionDto = {
    content: [
      {
        collectionId: 301,
        userId: 'user-789',
        name: 'Favorite Desserts',
        description: 'My favorite dessert recipes',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        recipeCount: 10,
        collaboratorCount: 0,
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-15T12:00:00Z',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
    size: 20,
    number: 0,
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
    empty: false,
  };

  describe('getFavoriteCollections', () => {
    it('should get favorite collections without parameters', async () => {
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const result = await collectionFavoritesApi.getFavoriteCollections();

      expect(mockedClient.get).toHaveBeenCalledWith('/favorites/collections');
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should get favorite collections with userId', async () => {
      const params: GetFavoriteCollectionsParams = {
        userId: 'user-123-uuid',
      };
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const result =
        await collectionFavoritesApi.getFavoriteCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/collections?userId=user-123-uuid'
      );
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should get favorite collections with pagination', async () => {
      const params: GetFavoriteCollectionsParams = {
        page: 1,
        size: 10,
        sort: ['favoritedAt,desc'],
      };
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const result =
        await collectionFavoritesApi.getFavoriteCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/collections?page=1&size=10&sort=favoritedAt%2Cdesc'
      );
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should get favorite collections with userId and pagination', async () => {
      const params: GetFavoriteCollectionsParams = {
        userId: 'user-456-uuid',
        page: 0,
        size: 20,
      };
      mockedClient.get.mockResolvedValue({ data: mockPageCollectionDto });

      const result =
        await collectionFavoritesApi.getFavoriteCollections(params);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/collections?userId=user-456-uuid&page=0&size=20'
      );
      expect(result).toEqual(mockPageCollectionDto);
    });

    it('should handle empty favorites list', async () => {
      const emptyResponse: PageCollectionDto = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        size: 20,
        number: 0,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true,
        },
        empty: true,
      };
      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await collectionFavoritesApi.getFavoriteCollections();

      expect(result.content).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.getFavoriteCollections()
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle forbidden access to private favorites (403)', async () => {
      const params: GetFavoriteCollectionsParams = {
        userId: 'private-user-uuid',
      };
      const error = new Error(
        "User's favorites are private. Only followers can view them."
      );
      mockedClient.get.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.getFavoriteCollections(params)
      ).rejects.toThrow(
        "User's favorites are private. Only followers can view them."
      );
    });
  });

  describe('favoriteCollection', () => {
    it('should favorite a collection successfully', async () => {
      mockedClient.post.mockResolvedValue({ data: mockCollectionFavoriteDto });

      const result = await collectionFavoritesApi.favoriteCollection(301);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/favorites/collections/301'
      );
      expect(result).toEqual(mockCollectionFavoriteDto);
      expect(result.collectionId).toBe(301);
    });

    it('should handle collection not found (404)', async () => {
      const error = new Error('Collection not found');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.favoriteCollection(999)
      ).rejects.toThrow('Collection not found');
    });

    it('should handle already favorited (409)', async () => {
      const error = new Error('User has already favorited this collection');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.favoriteCollection(301)
      ).rejects.toThrow('User has already favorited this collection');
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.favoriteCollection(301)
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle forbidden access to private collection (403)', async () => {
      const error = new Error('You do not have access to view this collection');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.favoriteCollection(301)
      ).rejects.toThrow('You do not have access to view this collection');
    });
  });

  describe('unfavoriteCollection', () => {
    it('should unfavorite a collection successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await collectionFavoritesApi.unfavoriteCollection(301);

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/favorites/collections/301'
      );
    });

    it('should handle favorite not found (404)', async () => {
      const error = new Error(
        'Favorite not found for this user and collection'
      );
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.unfavoriteCollection(999)
      ).rejects.toThrow('Favorite not found for this user and collection');
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.unfavoriteCollection(301)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('isCollectionFavorited', () => {
    it('should return true when collection is favorited', async () => {
      mockedClient.get.mockResolvedValue({ data: true });

      const result = await collectionFavoritesApi.isCollectionFavorited(301);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/collections/301/is-favorited'
      );
      expect(result).toBe(true);
    });

    it('should return false when collection is not favorited', async () => {
      mockedClient.get.mockResolvedValue({ data: false });

      const result = await collectionFavoritesApi.isCollectionFavorited(456);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/favorites/collections/456/is-favorited'
      );
      expect(result).toBe(false);
    });

    it('should handle unauthorized access (401)', async () => {
      const error = new Error('Unauthorized');
      mockedClient.get.mockRejectedValue(error);

      await expect(
        collectionFavoritesApi.isCollectionFavorited(301)
      ).rejects.toThrow('Unauthorized');
    });
  });
});
