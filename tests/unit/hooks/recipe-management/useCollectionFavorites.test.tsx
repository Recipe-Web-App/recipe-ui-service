import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { collectionFavoritesApi } from '@/lib/api/recipe-management/collection-favorites';
import {
  useFavoriteCollections,
  useFavoriteCollection,
  useUnfavoriteCollection,
  useIsCollectionFavorited,
} from '@/hooks/recipe-management/useCollectionFavorites';
import type {
  PageCollectionDto,
  CollectionFavoriteDto,
  GetFavoriteCollectionsParams,
} from '@/types/recipe-management';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

jest.mock('@/lib/api/recipe-management/collection-favorites', () => ({
  collectionFavoritesApi: {
    getFavoriteCollections: jest.fn(),
    favoriteCollection: jest.fn(),
    unfavoriteCollection: jest.fn(),
    isCollectionFavorited: jest.fn(),
  },
}));

const mockedCollectionFavoritesApi = collectionFavoritesApi as jest.Mocked<
  typeof collectionFavoritesApi
>;

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

describe('useCollectionFavorites hooks', () => {
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

  describe('useFavoriteCollections', () => {
    it('should fetch favorite collections without parameters', async () => {
      mockedCollectionFavoritesApi.getFavoriteCollections.mockResolvedValue(
        mockPageCollectionDto
      );

      const { result } = renderHook(() => useFavoriteCollections(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPageCollectionDto);
      expect(
        mockedCollectionFavoritesApi.getFavoriteCollections
      ).toHaveBeenCalledWith(undefined);
    });

    it('should fetch favorite collections with userId', async () => {
      const params: GetFavoriteCollectionsParams = {
        userId: 'user-123-uuid',
      };

      mockedCollectionFavoritesApi.getFavoriteCollections.mockResolvedValue(
        mockPageCollectionDto
      );

      const { result } = renderHook(() => useFavoriteCollections(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPageCollectionDto);
      expect(
        mockedCollectionFavoritesApi.getFavoriteCollections
      ).toHaveBeenCalledWith(params);
    });

    it('should fetch favorite collections with pagination', async () => {
      const params: GetFavoriteCollectionsParams = {
        page: 1,
        size: 10,
        sort: ['favoritedAt,desc'],
      };

      mockedCollectionFavoritesApi.getFavoriteCollections.mockResolvedValue(
        mockPageCollectionDto
      );

      const { result } = renderHook(() => useFavoriteCollections(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPageCollectionDto);
      expect(
        mockedCollectionFavoritesApi.getFavoriteCollections
      ).toHaveBeenCalledWith(params);
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

      mockedCollectionFavoritesApi.getFavoriteCollections.mockResolvedValue(
        emptyResponse
      );

      const { result } = renderHook(() => useFavoriteCollections(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.content).toHaveLength(0);
      expect(result.current.data?.totalElements).toBe(0);
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedCollectionFavoritesApi.getFavoriteCollections.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useFavoriteCollections(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle forbidden errors for private favorites (403)', async () => {
      const params: GetFavoriteCollectionsParams = {
        userId: 'private-user-uuid',
      };

      const error = new Error(
        "User's favorites are private. Only followers can view them."
      );
      mockedCollectionFavoritesApi.getFavoriteCollections.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useFavoriteCollections(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useFavoriteCollection', () => {
    it('should favorite a collection successfully', async () => {
      mockedCollectionFavoritesApi.favoriteCollection.mockResolvedValue(
        mockCollectionFavoriteDto
      );

      const { result } = renderHook(() => useFavoriteCollection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(301);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        mockedCollectionFavoritesApi.favoriteCollection
      ).toHaveBeenCalledWith(301);
      expect(result.current.data).toEqual(mockCollectionFavoriteDto);
    });

    it('should handle collection not found (404)', async () => {
      const error = new Error('Collection not found');
      mockedCollectionFavoritesApi.favoriteCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(999);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle already favorited conflict (409)', async () => {
      const error = new Error('User has already favorited this collection');
      mockedCollectionFavoritesApi.favoriteCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(301);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedCollectionFavoritesApi.favoriteCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(301);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle forbidden access to private collection (403)', async () => {
      const error = new Error('You do not have access to view this collection');
      mockedCollectionFavoritesApi.favoriteCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useFavoriteCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(301);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUnfavoriteCollection', () => {
    it('should unfavorite a collection successfully', async () => {
      mockedCollectionFavoritesApi.unfavoriteCollection.mockResolvedValue();

      const { result } = renderHook(() => useUnfavoriteCollection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(301);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        mockedCollectionFavoritesApi.unfavoriteCollection
      ).toHaveBeenCalledWith(301);
    });

    it('should handle favorite not found (404)', async () => {
      const error = new Error(
        'Favorite not found for this user and collection'
      );
      mockedCollectionFavoritesApi.unfavoriteCollection.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useUnfavoriteCollection(), {
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
      mockedCollectionFavoritesApi.unfavoriteCollection.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useUnfavoriteCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(301);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useIsCollectionFavorited', () => {
    it('should return true when collection is favorited', async () => {
      mockedCollectionFavoritesApi.isCollectionFavorited.mockResolvedValue(
        true
      );

      const { result } = renderHook(() => useIsCollectionFavorited(301), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(true);
      expect(
        mockedCollectionFavoritesApi.isCollectionFavorited
      ).toHaveBeenCalledWith(301);
    });

    it('should return false when collection is not favorited', async () => {
      mockedCollectionFavoritesApi.isCollectionFavorited.mockResolvedValue(
        false
      );

      const { result } = renderHook(() => useIsCollectionFavorited(456), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(false);
      expect(
        mockedCollectionFavoritesApi.isCollectionFavorited
      ).toHaveBeenCalledWith(456);
    });

    it('should not fetch when collectionId is falsy', async () => {
      const { result } = renderHook(() => useIsCollectionFavorited(0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      expect(
        mockedCollectionFavoritesApi.isCollectionFavorited
      ).not.toHaveBeenCalled();
    });

    it('should handle unauthorized errors (401)', async () => {
      const error = new Error('Unauthorized');
      mockedCollectionFavoritesApi.isCollectionFavorited.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useIsCollectionFavorited(301), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
