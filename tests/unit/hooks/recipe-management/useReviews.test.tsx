import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { reviewsApi } from '@/lib/api/recipe-management';
import {
  useRecipeReviews,
  useAddRecipeReview,
  useEditRecipeReview,
  useDeleteRecipeReview,
  useRecipeReviewManager,
  useInvalidateReviews,
} from '@/hooks/recipe-management/useReviews';
import type {
  ReviewResponse,
  AddReviewRequest,
  EditReviewRequest,
  ReviewDto,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  reviewsApi: {
    getRecipeReviews: jest.fn(),
    addRecipeReview: jest.fn(),
    editRecipeReview: jest.fn(),
    deleteRecipeReview: jest.fn(),
  },
}));

const mockedReviewsApi = reviewsApi as jest.Mocked<typeof reviewsApi>;

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

describe('useReviews hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipeReviews', () => {
    it('should fetch recipe reviews successfully', async () => {
      const mockResponse: ReviewResponse = {
        reviews: [
          {
            reviewId: 1,
            userId: 1,
            rating: 5,
            comment: 'Great recipe!',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        reviewCount: 1,
        averageRating: 5.0,
      };

      mockedReviewsApi.getRecipeReviews.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeReviews(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedReviewsApi.getRecipeReviews).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeReviews(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedReviewsApi.getRecipeReviews).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch reviews');
      mockedReviewsApi.getRecipeReviews.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeReviews(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAddRecipeReview', () => {
    it('should add review successfully', async () => {
      const mockRequest: AddReviewRequest = {
        rating: 4,
        comment: 'Nice recipe!',
        userId: 1,
      };

      const mockResponse: ReviewDto = {
        reviewId: 2,
        userId: 1,
        rating: 4,
        comment: 'Nice recipe!',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedReviewsApi.addRecipeReview.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAddRecipeReview(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedReviewsApi.addRecipeReview).toHaveBeenCalledWith(
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: AddReviewRequest = {
        rating: 4,
        comment: 'Nice recipe!',
        userId: 1,
      };

      const error = new Error('Failed to add review');
      mockedReviewsApi.addRecipeReview.mockRejectedValue(error);

      const { result } = renderHook(() => useAddRecipeReview(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useEditRecipeReview', () => {
    it('should edit review successfully', async () => {
      const mockRequest: EditReviewRequest = {
        rating: 5,
        comment: 'Updated comment - amazing!',
        userId: 1,
      };

      const mockResponse: ReviewDto = {
        reviewId: 1,
        userId: 1,
        rating: 5,
        comment: 'Updated comment - amazing!',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T01:00:00Z',
      };

      mockedReviewsApi.editRecipeReview.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEditRecipeReview(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, reviewId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedReviewsApi.editRecipeReview).toHaveBeenCalledWith(
        1,
        1,
        mockRequest
      );
    });

    it('should handle errors', async () => {
      const mockRequest: EditReviewRequest = {
        rating: 5,
        userId: 1,
      };

      const error = new Error('Failed to edit review');
      mockedReviewsApi.editRecipeReview.mockRejectedValue(error);

      const { result } = renderHook(() => useEditRecipeReview(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, reviewId: 1, data: mockRequest });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteRecipeReview', () => {
    it('should delete review successfully', async () => {
      const mockResponse = undefined;

      mockedReviewsApi.deleteRecipeReview.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteRecipeReview(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, reviewId: 1 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedReviewsApi.deleteRecipeReview).toHaveBeenCalledWith(1, 1);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to delete review');
      mockedReviewsApi.deleteRecipeReview.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteRecipeReview(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ recipeId: 1, reviewId: 1 });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeReviewManager', () => {
    it('should provide review management functions', async () => {
      const addRequest: AddReviewRequest = {
        rating: 5,
        comment: 'Great!',
        userId: 1,
      };
      const editRequest: EditReviewRequest = {
        rating: 4,
        comment: 'Good!',
        userId: 1,
      };

      const addResponse: ReviewDto = {
        reviewId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great!',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const editResponse: ReviewDto = {
        ...addResponse,
        rating: 4,
        comment: 'Good!',
        updatedAt: '2024-01-01T01:00:00Z',
      };

      mockedReviewsApi.addRecipeReview.mockResolvedValue(addResponse);
      mockedReviewsApi.editRecipeReview.mockResolvedValue(editResponse);
      mockedReviewsApi.deleteRecipeReview.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRecipeReviewManager(1), {
        wrapper: createWrapper(),
      });

      // Test add review
      await result.current.addReview(addRequest);
      expect(mockedReviewsApi.addRecipeReview).toHaveBeenCalledWith(
        1,
        addRequest
      );

      // Test edit review
      await result.current.editReview(1, editRequest);
      expect(mockedReviewsApi.editRecipeReview).toHaveBeenCalledWith(
        1,
        1,
        editRequest
      );

      // Test delete review
      await result.current.deleteReview(1);
      expect(mockedReviewsApi.deleteRecipeReview).toHaveBeenCalledWith(1, 1);
    });

    it('should handle loading states', () => {
      const { result } = renderHook(() => useRecipeReviewManager(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAddingReview).toBe(false);
      expect(result.current.isEditingReview).toBe(false);
      expect(result.current.isDeletingReview).toBe(false);
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Review operation failed');
      mockedReviewsApi.addRecipeReview.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeReviewManager(1), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.addReview({
          rating: 5,
          comment: 'Test',
          userId: 1,
        });
      } catch (e) {
        expect(e).toEqual(error);
      }

      await waitFor(() => {
        expect(result.current.addReviewError).toEqual(error);
      });
    });
  });

  describe('useInvalidateReviews', () => {
    it('should provide invalidation function', () => {
      const { result } = renderHook(() => useInvalidateReviews(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current).toBe('function');

      // Should not throw when called
      expect(() => result.current(1)).not.toThrow();
    });
  });
});
