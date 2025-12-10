import { stepsApi } from '@/lib/api/recipe-management/steps';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  StepResponse,
  RecipeStepDto,
  StepCommentResponse,
  StepCommentDto,
  AddStepCommentRequest,
  EditStepCommentRequest,
  DeleteStepCommentRequest,
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
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Steps API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockStep: RecipeStepDto = {
    stepId: 1,
    stepNumber: 1,
    instruction: 'Preheat the oven to 350°F',
    timerSeconds: 300,
  };

  const mockStepResponse: StepResponse = {
    steps: [mockStep],
    recipeId: 1,
  };

  const mockStepComment: StepCommentDto = {
    commentId: 1,
    stepId: 1,
    userId: 'user-123',
    commentText: 'Great step, very clear instructions!',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
  };

  const mockStepCommentResponse: StepCommentResponse = {
    stepId: 1,
    comments: [mockStepComment],
  };

  describe('getRecipeSteps', () => {
    it('should get recipe steps', async () => {
      mockedClient.get.mockResolvedValue({ data: mockStepResponse });

      const result = await stepsApi.getRecipeSteps(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/steps');
      expect(result).toEqual(mockStepResponse);
    });

    it('should handle empty steps list', async () => {
      const emptyResponse: StepResponse = {
        recipeId: 1,
        steps: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await stepsApi.getRecipeSteps(1);

      expect(result).toEqual(emptyResponse);
    });

    it('should handle recipe not found error', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(stepsApi.getRecipeSteps(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('getStepComments', () => {
    it('should get step comments', async () => {
      mockedClient.get.mockResolvedValue({ data: mockStepCommentResponse });

      const result = await stepsApi.getStepComments(1, 1);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes/1/steps/1/comment'
      );
      expect(result).toEqual(mockStepCommentResponse);
    });

    it('should handle empty comments', async () => {
      const emptyCommentResponse: StepCommentResponse = {
        stepId: 1,
        comments: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyCommentResponse });

      const result = await stepsApi.getStepComments(1, 1);

      expect(result).toEqual(emptyCommentResponse);
    });

    it('should handle step not found error', async () => {
      const error = new Error('Step not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(stepsApi.getStepComments(1, 999)).rejects.toThrow(
        'Step not found'
      );
    });
  });

  describe('addStepComment', () => {
    it('should add step comment', async () => {
      const commentRequest: AddStepCommentRequest = {
        comment: 'This step is very helpful!',
      };

      mockedClient.post.mockResolvedValue({ data: mockStepComment });

      const result = await stepsApi.addStepComment(1, 1, commentRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/1/steps/1/comment',
        commentRequest
      );
      expect(result).toEqual(mockStepComment);
    });

    it('should handle long comments', async () => {
      const longComment =
        'This is a very detailed comment about this step. '.repeat(10);
      const commentRequest: AddStepCommentRequest = {
        comment: longComment,
      };

      const commentWithLongText = {
        ...mockStepComment,
        commentText: longComment,
      };

      mockedClient.post.mockResolvedValue({ data: commentWithLongText });

      const result = await stepsApi.addStepComment(1, 1, commentRequest);

      expect(result.commentText).toBe(longComment);
    });

    it('should handle comment validation errors', async () => {
      const invalidComment: AddStepCommentRequest = {
        comment: '',
      };

      const error = new Error('Comment cannot be empty');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        stepsApi.addStepComment(1, 1, invalidComment)
      ).rejects.toThrow('Comment cannot be empty');
    });
  });

  describe('editStepComment', () => {
    it('should edit step comment', async () => {
      const editRequest: EditStepCommentRequest = {
        commentId: 1,
        comment: 'Updated comment with better information',
      };

      const updatedComment = {
        ...mockStepComment,
        commentText: editRequest.comment,
        updatedAt: '2023-01-02T10:00:00Z',
      };

      mockedClient.put.mockResolvedValue({ data: updatedComment });

      const result = await stepsApi.editStepComment(1, 1, editRequest);

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/recipes/1/steps/1/comment',
        editRequest
      );
      expect(result).toEqual(updatedComment);
    });

    it('should handle edit permission errors', async () => {
      const editRequest: EditStepCommentRequest = {
        commentId: 1,
        comment: "Trying to edit someone else's comment",
      };

      const error = new Error('Permission denied');
      mockedClient.put.mockRejectedValue(error);

      await expect(stepsApi.editStepComment(1, 1, editRequest)).rejects.toThrow(
        'Permission denied'
      );
    });

    it('should handle comment not found error', async () => {
      const editRequest: EditStepCommentRequest = {
        commentId: 999,
        comment: 'Editing non-existent comment',
      };

      const error = new Error('Comment not found');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        stepsApi.editStepComment(1, 999, editRequest)
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('deleteStepComment', () => {
    it('should delete step comment with reason', async () => {
      const deleteRequest: DeleteStepCommentRequest = {
        commentId: 1,
      };

      mockedClient.delete.mockResolvedValue({ data: undefined });

      await stepsApi.deleteStepComment(1, 1, deleteRequest);

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/recipes/1/steps/1/comment',
        { data: deleteRequest }
      );
    });

    it('should delete step comment without reason', async () => {
      const deleteRequest: DeleteStepCommentRequest = {
        commentId: 1,
      };

      mockedClient.delete.mockResolvedValue({ data: undefined });

      await stepsApi.deleteStepComment(1, 1, deleteRequest);

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/recipes/1/steps/1/comment',
        { data: deleteRequest }
      );
    });

    it('should handle delete permission errors', async () => {
      const deleteRequest: DeleteStepCommentRequest = {
        commentId: 1,
      };

      const error = new Error('Permission denied');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        stepsApi.deleteStepComment(1, 1, deleteRequest)
      ).rejects.toThrow('Permission denied');
    });

    it('should handle comment not found during deletion', async () => {
      const deleteRequest: DeleteStepCommentRequest = {
        commentId: 999,
      };

      const error = new Error('Comment not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        stepsApi.deleteStepComment(1, 999, deleteRequest)
      ).rejects.toThrow('Comment not found');
    });

    it('should handle already deleted comments', async () => {
      const deleteRequest: DeleteStepCommentRequest = {
        commentId: 1,
      };

      const error = new Error('Comment already deleted');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        stepsApi.deleteStepComment(1, 1, deleteRequest)
      ).rejects.toThrow('Comment already deleted');
    });
  });
});
