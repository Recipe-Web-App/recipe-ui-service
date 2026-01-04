import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { collectionTagsApi } from '@/lib/api/recipe-management';
import {
  useCollectionTags,
  useAddTagToCollection,
  useRemoveTagFromCollection,
  useCollectionTagManager,
  useInvalidateCollectionTags,
} from '@/hooks/recipe-management/useCollectionTags';
import type {
  AddTagRequest,
  RemoveTagRequest,
  CollectionTagDto,
  CollectionTagResponse,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  collectionTagsApi: {
    getCollectionTags: jest.fn(),
    addTagToCollection: jest.fn(),
    removeTagFromCollection: jest.fn(),
  },
}));

const mockedCollectionTagsApi = collectionTagsApi as jest.Mocked<
  typeof collectionTagsApi
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

describe('useCollectionTags hooks', () => {
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

  describe('useCollectionTags', () => {
    it('should fetch collection tags successfully', async () => {
      const mockResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [
          {
            tagId: 1,
            name: 'Desserts',
          },
          {
            tagId: 2,
            name: 'Quick Meals',
          },
        ],
      };

      mockedCollectionTagsApi.getCollectionTags.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCollectionTags(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedCollectionTagsApi.getCollectionTags).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when collectionId is 0', () => {
      const { result } = renderHook(() => useCollectionTags(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedCollectionTagsApi.getCollectionTags).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch collection tags');
      mockedCollectionTagsApi.getCollectionTags.mockRejectedValue(error);

      const { result } = renderHook(() => useCollectionTags(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle empty tags list', async () => {
      const emptyResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [],
      };

      mockedCollectionTagsApi.getCollectionTags.mockResolvedValue(
        emptyResponse
      );

      const { result } = renderHook(() => useCollectionTags(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.tags).toHaveLength(0);
    });
  });

  describe('useAddTagToCollection', () => {
    it('should add tag successfully', async () => {
      const mockRequest: AddTagRequest = {
        name: 'Vegetarian',
      };

      const mockResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [mockTag, { tagId: 2, name: 'Vegetarian' }],
      };

      mockedCollectionTagsApi.addTagToCollection.mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => useAddTagToCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedCollectionTagsApi.addTagToCollection).toHaveBeenCalledWith(
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: AddTagRequest = {
        name: 'Vegetarian',
      };

      const error = new Error('Failed to add tag to collection');
      mockedCollectionTagsApi.addTagToCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useAddTagToCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle duplicate tag conflict', async () => {
      const mockRequest: AddTagRequest = {
        name: 'Desserts', // Already exists
      };

      const error = new Error('Tag already exists on this collection');
      mockedCollectionTagsApi.addTagToCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useAddTagToCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(
        'Tag already exists on this collection'
      );
    });
  });

  describe('useRemoveTagFromCollection', () => {
    it('should remove tag successfully', async () => {
      const mockRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const mockResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [],
      };

      mockedCollectionTagsApi.removeTagFromCollection.mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => useRemoveTagFromCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(
        mockedCollectionTagsApi.removeTagFromCollection
      ).toHaveBeenCalledWith(1, mockRequest);
    });

    it('should handle errors', async () => {
      const mockRequest: RemoveTagRequest = {
        tagName: 'Desserts',
      };

      const error = new Error('Failed to remove tag from collection');
      mockedCollectionTagsApi.removeTagFromCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveTagFromCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle non-existent tag', async () => {
      const mockRequest: RemoveTagRequest = {
        tagName: 'NonExistent',
      };

      const error = new Error('Tag not found on this collection');
      mockedCollectionTagsApi.removeTagFromCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveTagFromCollection(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ collectionId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(
        'Tag not found on this collection'
      );
    });
  });

  describe('useCollectionTagManager', () => {
    it('should provide tag management functions', async () => {
      const addRequest: AddTagRequest = { name: 'Spicy' };
      const removeRequest: RemoveTagRequest = { tagName: 'Desserts' };

      const addResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [mockTag, { tagId: 2, name: 'Spicy' }],
      };

      const removeResponse: CollectionTagResponse = {
        collectionId: 1,
        tags: [],
      };

      mockedCollectionTagsApi.addTagToCollection.mockResolvedValue(addResponse);
      mockedCollectionTagsApi.removeTagFromCollection.mockResolvedValue(
        removeResponse
      );

      const { result } = renderHook(() => useCollectionTagManager(1), {
        wrapper: createWrapper(),
      });

      // Test add tag
      await result.current.addTag(addRequest);
      expect(mockedCollectionTagsApi.addTagToCollection).toHaveBeenCalledWith(
        1,
        addRequest
      );

      // Test remove tag
      await result.current.removeTag(removeRequest);
      expect(
        mockedCollectionTagsApi.removeTagFromCollection
      ).toHaveBeenCalledWith(1, removeRequest);
    });

    it('should handle loading states', () => {
      const { result } = renderHook(() => useCollectionTagManager(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAddingTag).toBe(false);
      expect(result.current.isRemovingTag).toBe(false);
    });

    it('should handle add tag errors correctly', async () => {
      const error = new Error('Tag operation failed');
      mockedCollectionTagsApi.addTagToCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useCollectionTagManager(1), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.addTag({ name: 'test' });
      } catch (e) {
        expect(e).toEqual(error);
      }

      await waitFor(() => {
        expect(result.current.addTagError).toEqual(error);
      });
    });

    it('should handle remove tag errors correctly', async () => {
      const error = new Error('Remove tag operation failed');
      mockedCollectionTagsApi.removeTagFromCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useCollectionTagManager(1), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.removeTag({ tagName: 'test' });
      } catch (e) {
        expect(e).toEqual(error);
      }

      await waitFor(() => {
        expect(result.current.removeTagError).toEqual(error);
      });
    });

    it('should provide combined error state', async () => {
      const error = new Error('Tag operation failed');
      mockedCollectionTagsApi.addTagToCollection.mockRejectedValue(error);

      const { result } = renderHook(() => useCollectionTagManager(1), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.addTag({ name: 'test' });
      } catch {
        // Expected error
      }

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
      });
    });
  });

  describe('useInvalidateCollectionTags', () => {
    it('should provide invalidation function', () => {
      const { result } = renderHook(() => useInvalidateCollectionTags(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current).toBe('function');

      // Should not throw when called
      expect(() => result.current(1)).not.toThrow();
    });

    it('should handle multiple invalidation calls', () => {
      const { result } = renderHook(() => useInvalidateCollectionTags(), {
        wrapper: createWrapper(),
      });

      // Should not throw when called multiple times
      expect(() => {
        result.current(1);
        result.current(2);
        result.current(3);
      }).not.toThrow();
    });
  });
});
