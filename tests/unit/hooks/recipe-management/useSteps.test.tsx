import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { stepsApi } from '@/lib/api/recipe-management';
import {
  useRecipeSteps,
  useStepComments,
  useAddStepComment,
  useEditStepComment,
  useDeleteStepComment,
  useInvalidateSteps,
} from '@/hooks/recipe-management/useSteps';
import type {
  StepCommentResponse,
  AddStepCommentRequest,
  EditStepCommentRequest,
  DeleteStepCommentRequest,
  RecipeStepDto,
  StepCommentDto,
  StepResponse,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  stepsApi: {
    getRecipeSteps: jest.fn(),
    getStepComments: jest.fn(),
    addStepComment: jest.fn(),
    editStepComment: jest.fn(),
    deleteStepComment: jest.fn(),
  },
}));

const mockedStepsApi = stepsApi as jest.Mocked<typeof stepsApi>;

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

describe('useSteps hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipeSteps', () => {
    it('should fetch recipe steps successfully', async () => {
      const mockResponse: StepResponse = {
        recipeId: 1,
        steps: [
          {
            stepId: 1,
            stepNumber: 1,
            instruction: 'Preheat oven to 350°F',
            duration: 5,
            order: 1,
          },
          {
            stepId: 2,
            stepNumber: 2,
            instruction: 'Mix ingredients',
            duration: 10,
            order: 2,
          },
        ],
      };

      mockedStepsApi.getRecipeSteps.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeSteps(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedStepsApi.getRecipeSteps).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeSteps(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedStepsApi.getRecipeSteps).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch steps');
      mockedStepsApi.getRecipeSteps.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeSteps(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useStepComments', () => {
    it('should fetch step comments successfully', async () => {
      const mockResponse: StepCommentResponse = {
        stepId: 1,
        comments: [
          {
            commentId: 1,
            stepId: 1,
            userId: 1,
            comment: 'Great tip!',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      };

      mockedStepsApi.getStepComments.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useStepComments(1, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedStepsApi.getStepComments).toHaveBeenCalledWith(1, 1);
    });

    it('should handle disabled state when ids are 0', () => {
      const { result } = renderHook(() => useStepComments(0, 0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedStepsApi.getStepComments).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch comments');
      mockedStepsApi.getStepComments.mockRejectedValue(error);

      const { result } = renderHook(() => useStepComments(1, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAddStepComment', () => {
    it('should add step comment successfully', async () => {
      const mockRequest: AddStepCommentRequest = {
        comment: 'This step is confusing',
        userId: 1,
      };

      const mockResponse: StepCommentDto = {
        commentId: 2,
        stepId: 1,
        userId: 1,
        comment: 'This step is confusing',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedStepsApi.addStepComment.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAddStepComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, stepId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedStepsApi.addStepComment).toHaveBeenCalledWith(
        1,
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: AddStepCommentRequest = {
        comment: 'Test comment',
        userId: 1,
      };

      const error = new Error('Failed to add comment');
      mockedStepsApi.addStepComment.mockRejectedValue(error);

      const { result } = renderHook(() => useAddStepComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, stepId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useEditStepComment', () => {
    it('should edit step comment successfully', async () => {
      const mockRequest: EditStepCommentRequest = {
        commentId: 1,
        comment: 'Updated comment text',
        userId: 1,
      };

      const mockResponse: StepCommentDto = {
        commentId: 1,
        stepId: 1,
        userId: 1,
        comment: 'Updated comment text',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T01:00:00Z',
      };

      mockedStepsApi.editStepComment.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEditStepComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, stepId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedStepsApi.editStepComment).toHaveBeenCalledWith(
        1,
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: EditStepCommentRequest = {
        commentId: 1,
        comment: 'Updated comment',
        userId: 1,
      };

      const error = new Error('Failed to edit comment');
      mockedStepsApi.editStepComment.mockRejectedValue(error);

      const { result } = renderHook(() => useEditStepComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, stepId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteStepComment', () => {
    it('should delete step comment successfully', async () => {
      const mockRequest: DeleteStepCommentRequest = {
        commentId: 1,
        userId: 1,
      };

      const mockResponse = undefined;

      mockedStepsApi.deleteStepComment.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteStepComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, stepId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedStepsApi.deleteStepComment).toHaveBeenCalledWith(
        1,
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: DeleteStepCommentRequest = {
        commentId: 1,
        userId: 1,
      };

      const error = new Error('Failed to delete comment');
      mockedStepsApi.deleteStepComment.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteStepComment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, stepId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useInvalidateSteps', () => {
    it('should provide invalidation function', () => {
      const { result } = renderHook(() => useInvalidateSteps(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current).toBe('function');

      // Should not throw when called
      expect(() => result.current(1)).not.toThrow();
      expect(() => result.current(1, 1)).not.toThrow();
    });
  });
});
