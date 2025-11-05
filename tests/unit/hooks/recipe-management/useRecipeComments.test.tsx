import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { recipeCommentsApi } from '@/lib/api/recipe-management/comments';
import {
  useRecipeComments,
  useAddRecipeComment,
  useEditRecipeComment,
  useDeleteRecipeComment,
} from '@/hooks/recipe-management/useRecipeComments';
import type {
  RecipeCommentsResponse,
  RecipeCommentDto,
  AddRecipeCommentRequest,
  EditRecipeCommentRequest,
} from '@/types/recipe-management/comment';

jest.mock('@/lib/api/recipe-management/comments', () => ({
  recipeCommentsApi: {
    getRecipeComments: jest.fn(),
    addRecipeComment: jest.fn(),
    editRecipeComment: jest.fn(),
    deleteRecipeComment: jest.fn(),
  },
}));

const mockedCommentsApi = recipeCommentsApi as jest.Mocked<
  typeof recipeCommentsApi
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

describe('useRecipeComments hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCommentDto: RecipeCommentDto = {
    commentId: 501,
    recipeId: 123,
    userId: 'user-456',
    commentText: 'This recipe is amazing!',
    isPublic: true,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  };

  const mockCommentsResponse: RecipeCommentsResponse = {
    recipeId: 123,
    comments: [mockCommentDto],
  };

  describe('useRecipeComments', () => {
    it('should fetch recipe comments successfully', async () => {
      mockedCommentsApi.getRecipeComments.mockResolvedValue(
        mockCommentsResponse
      );

      const { result } = renderHook(() => useRecipeComments(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCommentsResponse);
      expect(mockedCommentsApi.getRecipeComments).toHaveBeenCalledWith(123);
    });

    it('should handle empty comments list', async () => {
      const emptyResponse: RecipeCommentsResponse = {
        recipeId: 123,
        comments: [],
      };
      mockedCommentsApi.getRecipeComments.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useRecipeComments(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.comments).toHaveLength(0);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeComments(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedCommentsApi.getRecipeComments).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch comments');
      mockedCommentsApi.getRecipeComments.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeComments(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAddRecipeComment', () => {
    it('should add a comment successfully', async () => {
      const addRequest: AddRecipeCommentRequest = {
        commentText: 'Great recipe!',
        isPublic: true,
      };

      const newComment: RecipeCommentDto = {
        commentId: 502,
        recipeId: 123,
        userId: 'user-789',
        commentText: addRequest.commentText,
        isPublic: addRequest.isPublic!,
        createdAt: '2023-01-03T10:00:00Z',
      };

      mockedCommentsApi.addRecipeComment.mockResolvedValue(newComment);

      const { result } = renderHook(() => useAddRecipeComment(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate({ recipeId: 123, data: addRequest });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCommentsApi.addRecipeComment).toHaveBeenCalledWith(
        123,
        addRequest
      );
      expect(result.current.data).toEqual(newComment);
    });

    it('should handle validation errors', async () => {
      const invalidRequest: AddRecipeCommentRequest = {
        commentText: '',
      };

      const error = new Error('Comment text cannot be empty');
      mockedCommentsApi.addRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useAddRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 123, data: invalidRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle unauthorized errors', async () => {
      const addRequest: AddRecipeCommentRequest = {
        commentText: 'Unauthorized comment',
      };

      const error = new Error('Unauthorized');
      mockedCommentsApi.addRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useAddRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 123, data: addRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useEditRecipeComment', () => {
    it('should edit a comment successfully', async () => {
      const editRequest: EditRecipeCommentRequest = {
        commentText: 'Updated comment text',
      };

      const updatedComment: RecipeCommentDto = {
        ...mockCommentDto,
        commentText: editRequest.commentText,
        updatedAt: '2023-01-03T10:00:00Z',
      };

      mockedCommentsApi.editRecipeComment.mockResolvedValue(updatedComment);

      const { result } = renderHook(() => useEditRecipeComment(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate({
          recipeId: 123,
          commentId: 501,
          data: editRequest,
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCommentsApi.editRecipeComment).toHaveBeenCalledWith(
        123,
        501,
        editRequest
      );
      expect(result.current.data).toEqual(updatedComment);
    });

    it('should handle forbidden errors (not comment owner)', async () => {
      const editRequest: EditRecipeCommentRequest = {
        commentText: 'Trying to edit someone elses comment',
      };

      const error = new Error(
        'Forbidden - User can only edit their own comments'
      );
      mockedCommentsApi.editRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useEditRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 123,
        commentId: 501,
        data: editRequest,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle comment not found errors', async () => {
      const editRequest: EditRecipeCommentRequest = {
        commentText: 'Editing non-existent comment',
      };

      const error = new Error('Comment not found');
      mockedCommentsApi.editRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useEditRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 123,
        commentId: 999,
        data: editRequest,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteRecipeComment', () => {
    it('should delete a comment successfully', async () => {
      mockedCommentsApi.deleteRecipeComment.mockResolvedValue();

      const { result } = renderHook(() => useDeleteRecipeComment(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate({ recipeId: 123, commentId: 501 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedCommentsApi.deleteRecipeComment).toHaveBeenCalledWith(
        123,
        501
      );
    });

    it('should handle forbidden errors (not comment owner)', async () => {
      const error = new Error(
        'Forbidden - User can only delete their own comments'
      );
      mockedCommentsApi.deleteRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 123, commentId: 501 });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle comment not found errors', async () => {
      const error = new Error('Comment not found');
      mockedCommentsApi.deleteRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 123, commentId: 999 });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle recipe not found errors', async () => {
      const error = new Error('Recipe not found');
      mockedCommentsApi.deleteRecipeComment.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteRecipeComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 999, commentId: 501 });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
