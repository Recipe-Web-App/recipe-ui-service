import { recipeCommentsApi } from '@/lib/api/recipe-management/comments';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeCommentDto,
  RecipeCommentsResponse,
  AddRecipeCommentRequest,
  EditRecipeCommentRequest,
} from '@/types/recipe-management/comment';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Recipe Comments API', () => {
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

  describe('getRecipeComments', () => {
    it('should get all comments for a recipe', async () => {
      mockedClient.get.mockResolvedValue({ data: mockCommentsResponse });

      const result = await recipeCommentsApi.getRecipeComments(123);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/123/comments');
      expect(result).toEqual(mockCommentsResponse);
    });

    it('should handle empty comments list', async () => {
      const emptyResponse: RecipeCommentsResponse = {
        recipeId: 123,
        comments: [],
      };
      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await recipeCommentsApi.getRecipeComments(123);

      expect(result.comments).toHaveLength(0);
      expect(result.recipeId).toBe(123);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(recipeCommentsApi.getRecipeComments(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('addRecipeComment', () => {
    it('should add a new comment to a recipe', async () => {
      const addRequest: AddRecipeCommentRequest = {
        commentText: 'Great recipe!',
        isPublic: true,
      };

      mockedClient.post.mockResolvedValue({ data: mockCommentDto });

      const result = await recipeCommentsApi.addRecipeComment(123, addRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/123/comments',
        addRequest
      );
      expect(result).toEqual(mockCommentDto);
    });

    it('should add a comment with default isPublic', async () => {
      const addRequest: AddRecipeCommentRequest = {
        commentText: 'Needs improvement',
      };

      mockedClient.post.mockResolvedValue({ data: mockCommentDto });

      const result = await recipeCommentsApi.addRecipeComment(123, addRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/123/comments',
        addRequest
      );
      expect(result).toEqual(mockCommentDto);
    });

    it('should handle validation errors', async () => {
      const invalidRequest: AddRecipeCommentRequest = {
        commentText: '', // Empty text
      };
      const error = new Error('Comment text cannot be empty');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.addRecipeComment(123, invalidRequest)
      ).rejects.toThrow('Comment text cannot be empty');
    });

    it('should handle authentication errors', async () => {
      const addRequest: AddRecipeCommentRequest = {
        commentText: 'Unauthorized comment',
      };
      const error = new Error('Unauthorized');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.addRecipeComment(123, addRequest)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('editRecipeComment', () => {
    it('should edit an existing comment', async () => {
      const editRequest: EditRecipeCommentRequest = {
        commentText: 'Updated comment text',
      };

      const updatedComment: RecipeCommentDto = {
        ...mockCommentDto,
        commentText: editRequest.commentText,
        updatedAt: '2023-01-03T10:00:00Z',
      };

      mockedClient.put.mockResolvedValue({ data: updatedComment });

      const result = await recipeCommentsApi.editRecipeComment(
        123,
        501,
        editRequest
      );

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/recipes/123/comments/501',
        editRequest
      );
      expect(result).toEqual(updatedComment);
      expect(result.commentText).toBe('Updated comment text');
    });

    it('should handle forbidden errors (not comment owner)', async () => {
      const editRequest: EditRecipeCommentRequest = {
        commentText: 'Trying to edit someone elses comment',
      };
      const error = new Error(
        'Forbidden - User can only edit their own comments'
      );
      mockedClient.put.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.editRecipeComment(123, 501, editRequest)
      ).rejects.toThrow('Forbidden - User can only edit their own comments');
    });

    it('should handle comment not found errors', async () => {
      const editRequest: EditRecipeCommentRequest = {
        commentText: 'Editing non-existent comment',
      };
      const error = new Error('Comment not found');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.editRecipeComment(123, 999, editRequest)
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('deleteRecipeComment', () => {
    it('should delete a comment successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await recipeCommentsApi.deleteRecipeComment(123, 501);

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/recipes/123/comments/501'
      );
    });

    it('should handle forbidden errors (not comment owner)', async () => {
      const error = new Error(
        'Forbidden - User can only delete their own comments'
      );
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.deleteRecipeComment(123, 501)
      ).rejects.toThrow('Forbidden - User can only delete their own comments');
    });

    it('should handle comment not found errors', async () => {
      const error = new Error('Comment not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.deleteRecipeComment(123, 999)
      ).rejects.toThrow('Comment not found');
    });

    it('should handle recipe not found errors', async () => {
      const error = new Error('Recipe not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        recipeCommentsApi.deleteRecipeComment(999, 501)
      ).rejects.toThrow('Recipe not found');
    });
  });
});
