import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { tagsApi } from '@/lib/api/recipe-management';
import {
  useRecipeTags,
  useAddTagToRecipe,
  useRemoveTagFromRecipe,
  useRecipeTagManager,
  useInvalidateTags,
} from '@/hooks/recipe-management/useTags';
import type {
  AddTagRequest,
  RemoveTagRequest,
  RecipeTagDto,
  TagResponse,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  tagsApi: {
    getRecipeTags: jest.fn(),
    addTagToRecipe: jest.fn(),
    removeTagFromRecipe: jest.fn(),
  },
}));

const mockedTagsApi = tagsApi as jest.Mocked<typeof tagsApi>;

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

describe('useTags hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipeTags', () => {
    it('should fetch recipe tags successfully', async () => {
      const mockResponse: TagResponse = {
        recipeId: 1,
        tags: [
          {
            tagId: 1,
            name: 'vegetarian',
            category: 'dietary',
          },
          {
            tagId: 2,
            name: 'quick',
            category: 'time',
          },
        ],
      };

      mockedTagsApi.getRecipeTags.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeTags(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedTagsApi.getRecipeTags).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeTags(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedTagsApi.getRecipeTags).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch tags');
      mockedTagsApi.getRecipeTags.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeTags(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAddTagToRecipe', () => {
    it('should add tag successfully', async () => {
      const mockRequest: AddTagRequest = {
        tagName: 'healthy',
      };

      const mockResponse: TagResponse = {
        recipeId: 1,
        tag: {
          tagId: 3,
          name: 'healthy',
          category: 'dietary',
        },
        addedAt: '2024-01-01T01:00:00Z',
      };

      mockedTagsApi.addTagToRecipe.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAddTagToRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedTagsApi.addTagToRecipe).toHaveBeenCalledWith(1, mockRequest);
    });

    it('should handle errors', async () => {
      const mockRequest: AddTagRequest = {
        tagName: 'healthy',
      };

      const error = new Error('Failed to add tag');
      mockedTagsApi.addTagToRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useAddTagToRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRemoveTagFromRecipe', () => {
    it('should remove tag successfully', async () => {
      const mockRequest: RemoveTagRequest = {
        tagName: 'vegetarian',
      };

      const mockResponse: TagResponse = {
        recipeId: 1,
        removedTag: {
          tagId: 1,
          name: 'vegetarian',
          category: 'dietary',
        },
        removedAt: '2024-01-01T01:00:00Z',
      };

      mockedTagsApi.removeTagFromRecipe.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRemoveTagFromRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedTagsApi.removeTagFromRecipe).toHaveBeenCalledWith(
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: RemoveTagRequest = {
        tagName: 'vegetarian',
      };

      const error = new Error('Failed to remove tag');
      mockedTagsApi.removeTagFromRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveTagFromRecipe(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeTagManager', () => {
    it('should provide tag management functions', async () => {
      const addRequest: AddTagRequest = { tagName: 'spicy' };
      const removeRequest: RemoveTagRequest = { tagName: 'vegetarian' };

      const addResponse: TagResponse = {
        recipeId: 1,
        tag: {
          tagId: 3,
          name: 'spicy',
          category: 'flavor',
        },
        addedAt: '2024-01-01T01:00:00Z',
      };

      const removeResponse: TagResponse = {
        recipeId: 1,
        removedTag: {
          tagId: 1,
          name: 'vegetarian',
          category: 'dietary',
        },
        removedAt: '2024-01-01T02:00:00Z',
      };

      mockedTagsApi.addTagToRecipe.mockResolvedValue(addResponse);
      mockedTagsApi.removeTagFromRecipe.mockResolvedValue(removeResponse);

      const { result } = renderHook(() => useRecipeTagManager(1), {
        wrapper: createWrapper(),
      });

      // Test add tag
      await result.current.addTag(addRequest);
      expect(mockedTagsApi.addTagToRecipe).toHaveBeenCalledWith(1, addRequest);

      // Test remove tag
      await result.current.removeTag(removeRequest);
      expect(mockedTagsApi.removeTagFromRecipe).toHaveBeenCalledWith(
        1,
        removeRequest
      );
    });

    it('should handle loading states', () => {
      const { result } = renderHook(() => useRecipeTagManager(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAddingTag).toBe(false);
      expect(result.current.isRemovingTag).toBe(false);
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Tag operation failed');
      mockedTagsApi.addTagToRecipe.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeTagManager(1), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.addTag({ tagName: 'test' });
      } catch (e) {
        expect(e).toEqual(error);
      }

      await waitFor(() => {
        expect(result.current.addTagError).toEqual(error);
      });
    });
  });

  describe('useInvalidateTags', () => {
    it('should provide invalidation function', () => {
      const { result } = renderHook(() => useInvalidateTags(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current).toBe('function');

      // Should not throw when called
      expect(() => result.current(1)).not.toThrow();
    });
  });
});
