import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { collectionsApi } from '@/lib/api/recipe-management';
import {
  useCollections,
  useCollection,
  useSearchCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@/hooks/recipe-management/useCollections';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management';
import type {
  PageCollectionDto,
  CollectionDto,
  CollectionDetailsDto,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  SearchCollectionsRequest,
} from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

jest.mock('@/lib/api/recipe-management', () => ({
  collectionsApi: {
    getCollections: jest.fn(),
    getCollectionById: jest.fn(),
    searchCollections: jest.fn(),
    createCollection: jest.fn(),
    updateCollection: jest.fn(),
    deleteCollection: jest.fn(),
  },
}));

const mockedCollectionsApi = collectionsApi as jest.Mocked<
  typeof collectionsApi
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

describe('useCollections hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCollections', () => {
    it('should fetch all collections successfully', async () => {
      const mockResponse: PageCollectionDto = {
        content: [
          {
            collectionId: 1,
            userId: 'user123',
            name: 'My Favorites',
            description: 'Best recipes',
            visibility: 'PUBLIC' as CollectionVisibility,
            collaborationMode: 'OWNER_ONLY' as CollaborationMode,
            recipeCount: 5,
            collaboratorCount: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        last: true,
        first: true,
        numberOfElements: 1,
        size: 20,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        empty: false,
      };

      mockedCollectionsApi.getCollections.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCollections(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedCollectionsApi.getCollections).toHaveBeenCalledWith(
        undefined
      );
    });

    it('should fetch collections with pagination params', async () => {
      const params: PaginationParams = { page: 1, size: 10 };
      const mockResponse: PageCollectionDto = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        size: 10,
        number: 1,
        sort: { sorted: false, unsorted: true, empty: true },
        empty: true,
      };

      mockedCollectionsApi.getCollections.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCollections(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedCollectionsApi.getCollections).toHaveBeenCalledWith(params);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch collections');
      mockedCollectionsApi.getCollections.mockRejectedValue(error);

      const { result } = renderHook(() => useCollections(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCollection', () => {
    it('should fetch specific collection successfully', async () => {
      const mockCollection: CollectionDetailsDto = {
        collectionId: 1,
        userId: 'user123',
        name: 'My Favorites',
        description: 'Best recipes',
        visibility: 'PUBLIC' as CollectionVisibility,
        collaborationMode: 'OWNER_ONLY' as CollaborationMode,
        recipeCount: 2,
        collaboratorCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        recipes: [
          {
            recipeId: 1,
            recipeTitle: 'Pasta',
            displayOrder: 1,
            addedBy: 'user123',
            addedAt: '2024-01-02T00:00:00Z',
          },
        ],
      };

      mockedCollectionsApi.getCollectionById.mockResolvedValue(mockCollection);

      const { result } = renderHook(() => useCollection(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCollection);
      expect(mockedCollectionsApi.getCollectionById).toHaveBeenCalledWith(1);
    });

    it('should not fetch when collectionId is 0', () => {
      const { result } = renderHook(() => useCollection(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(mockedCollectionsApi.getCollectionById).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch collection');
      mockedCollectionsApi.getCollectionById.mockRejectedValue(error);

      const { result } = renderHook(() => useCollection(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useSearchCollections', () => {
    it('should search collections successfully', async () => {
      const searchRequest: SearchCollectionsRequest = {
        query: 'dessert',
      };
      const mockResponse: PageCollectionDto = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        numberOfElements: 0,
        size: 20,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        empty: true,
      };

      mockedCollectionsApi.searchCollections.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSearchCollections(searchRequest), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedCollectionsApi.searchCollections).toHaveBeenCalledWith(
        searchRequest,
        undefined
      );
    });
  });

  describe('useCreateCollection', () => {
    it('should create collection successfully', async () => {
      const newCollection: CollectionDto = {
        collectionId: 1,
        userId: 'user123',
        name: 'New Collection',
        visibility: 'PUBLIC' as CollectionVisibility,
        collaborationMode: 'OWNER_ONLY' as CollaborationMode,
        recipeCount: 0,
        collaboratorCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedCollectionsApi.createCollection.mockResolvedValue(newCollection);

      const { result } = renderHook(() => useCreateCollection(), {
        wrapper: createWrapper(),
      });

      const createData: CreateCollectionRequest = {
        name: 'New Collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
      };

      result.current.mutate(createData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCollectionsApi.createCollection).toHaveBeenCalledWith(
        createData
      );
    });
  });

  describe('useUpdateCollection', () => {
    it('should update collection successfully', async () => {
      const updatedCollection: CollectionDto = {
        collectionId: 1,
        userId: 'user123',
        name: 'Updated Name',
        visibility: 'PUBLIC' as CollectionVisibility,
        collaborationMode: 'OWNER_ONLY' as CollaborationMode,
        recipeCount: 0,
        collaboratorCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockedCollectionsApi.updateCollection.mockResolvedValue(
        updatedCollection
      );

      const { result } = renderHook(() => useUpdateCollection(), {
        wrapper: createWrapper(),
      });

      const updateData: UpdateCollectionRequest = {
        name: 'Updated Name',
      };

      result.current.mutate({ collectionId: 1, data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCollectionsApi.updateCollection).toHaveBeenCalledWith(
        1,
        updateData
      );
    });
  });

  describe('useDeleteCollection', () => {
    it('should delete collection successfully', async () => {
      mockedCollectionsApi.deleteCollection.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCollectionsApi.deleteCollection).toHaveBeenCalledWith(1);
    });
  });
});
