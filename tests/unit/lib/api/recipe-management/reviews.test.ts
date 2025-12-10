import { reviewsApi } from '@/lib/api/recipe-management/reviews';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  ReviewResponse,
  ReviewDto,
  AddReviewRequest,
  EditReviewRequest,
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

describe('Reviews API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReview: ReviewDto = {
    reviewId: 1,
    userId: 'user-123',
    rating: 5,
    comment: 'Absolutely delicious! Will make again.',
    createdAt: '2023-01-01T10:00:00Z',
  };

  const mockReviewResponse: ReviewResponse = {
    recipeId: 1,
    reviews: [mockReview],
    reviewCount: 1,
    averageRating: 5.0,
  };

  describe('getRecipeReviews', () => {
    it('should get recipe reviews', async () => {
      mockedClient.get.mockResolvedValue({ data: mockReviewResponse });

      const result = await reviewsApi.getRecipeReviews(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/review');
      expect(result).toEqual(mockReviewResponse);
    });

    it('should handle empty reviews list', async () => {
      const emptyReviewResponse: ReviewResponse = {
        recipeId: 1,
        reviews: [],
        reviewCount: 0,
        averageRating: 0,
      };

      mockedClient.get.mockResolvedValue({ data: emptyReviewResponse });

      const result = await reviewsApi.getRecipeReviews(1);

      expect(result).toEqual(emptyReviewResponse);
      expect(result.reviewCount).toBe(0);
      expect(result.averageRating).toBe(0);
    });

    it('should handle multiple reviews with different ratings', async () => {
      const multipleReviews: ReviewDto[] = [
        {
          reviewId: 1,
          userId: 'user-123',
          rating: 5,
          comment: 'Perfect recipe!',
          createdAt: '2023-01-01T10:00:00Z',
        },
        {
          reviewId: 2,
          userId: 'user-123',
          rating: 4,
          comment: 'Very good, but could use more seasoning.',
          createdAt: '2023-01-02T10:00:00Z',
        },
        {
          reviewId: 3,
          userId: 'user-123',
          rating: 3,
          comment: 'It was okay.',
          createdAt: '2023-01-03T10:00:00Z',
        },
      ];

      const multipleReviewsResponse: ReviewResponse = {
        recipeId: 1,
        reviews: multipleReviews,
        reviewCount: 3,
        averageRating: 4.0,
      };

      mockedClient.get.mockResolvedValue({ data: multipleReviewsResponse });

      const result = await reviewsApi.getRecipeReviews(1);

      expect(result.reviewCount).toBe(3);
      expect(result.averageRating).toBe(4.0);
      expect(result.reviews).toHaveLength(3);
    });

    it('should handle recipe not found error', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(reviewsApi.getRecipeReviews(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('addRecipeReview', () => {
    it('should add a new review with rating and comment', async () => {
      const addRequest: AddReviewRequest = {
        rating: 5,
        comment: 'Amazing recipe! Easy to follow and delicious.',
      };

      mockedClient.post.mockResolvedValue({ data: mockReview });

      const result = await reviewsApi.addRecipeReview(1, addRequest);

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/recipes/1/review',
        addRequest
      );
      expect(result).toEqual(mockReview);
    });

    it('should add review with only rating (no comment)', async () => {
      const addRequest: AddReviewRequest = {
        rating: 4,
      };

      const reviewWithoutComment = {
        ...mockReview,
        rating: 4,
        comment: undefined,
      };

      mockedClient.post.mockResolvedValue({ data: reviewWithoutComment });

      const result = await reviewsApi.addRecipeReview(1, addRequest);

      expect(result.rating).toBe(4);
      expect(result.comment).toBeUndefined();
    });

    it('should handle minimum rating', async () => {
      const addRequest: AddReviewRequest = {
        rating: 1,
        comment: 'Did not like this recipe at all.',
      };

      const lowRatingReview = {
        ...mockReview,
        rating: 1,
        comment: 'Did not like this recipe at all.',
      };

      mockedClient.post.mockResolvedValue({ data: lowRatingReview });

      const result = await reviewsApi.addRecipeReview(1, addRequest);

      expect(result.rating).toBe(1);
    });

    it('should handle maximum rating', async () => {
      const addRequest: AddReviewRequest = {
        rating: 5,
        comment: 'Perfect in every way!',
      };

      mockedClient.post.mockResolvedValue({ data: mockReview });

      const result = await reviewsApi.addRecipeReview(1, addRequest);

      expect(result.rating).toBe(5);
    });

    it('should handle invalid rating', async () => {
      const addRequest: AddReviewRequest = {
        rating: 6, // Invalid rating
        comment: 'This rating should not be allowed',
      };

      const error = new Error('Rating must be between 1 and 5');
      mockedClient.post.mockRejectedValue(error);

      await expect(reviewsApi.addRecipeReview(1, addRequest)).rejects.toThrow(
        'Rating must be between 1 and 5'
      );
    });

    it('should handle duplicate review from same user', async () => {
      const addRequest: AddReviewRequest = {
        rating: 4,
        comment: 'Trying to review again',
      };

      const error = new Error('User has already reviewed this recipe');
      mockedClient.post.mockRejectedValue(error);

      await expect(reviewsApi.addRecipeReview(1, addRequest)).rejects.toThrow(
        'User has already reviewed this recipe'
      );
    });

    it('should handle very long comments', async () => {
      const longComment = 'This is a very detailed review. '.repeat(50);
      const addRequest: AddReviewRequest = {
        rating: 5,
        comment: longComment,
      };

      const error = new Error('Comment exceeds maximum length');
      mockedClient.post.mockRejectedValue(error);

      await expect(reviewsApi.addRecipeReview(1, addRequest)).rejects.toThrow(
        'Comment exceeds maximum length'
      );
    });
  });

  describe('editRecipeReview', () => {
    it('should edit existing review', async () => {
      const editRequest: EditReviewRequest = {
        rating: 4,
        comment: 'Updated my review - still very good but not perfect',
      };

      const updatedReview = {
        ...mockReview,
        rating: 4,
        comment: 'Updated my review - still very good but not perfect',
      };

      mockedClient.put.mockResolvedValue({ data: updatedReview });

      const result = await reviewsApi.editRecipeReview(1, 1, editRequest);

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/recipes/1/review/1',
        editRequest
      );
      expect(result).toEqual(updatedReview);
      expect(result.rating).toBe(4);
    });

    it('should edit only rating', async () => {
      const editRequest: EditReviewRequest = {
        rating: 3,
      };

      const updatedReview = {
        ...mockReview,
        rating: 3,
      };

      mockedClient.put.mockResolvedValue({ data: updatedReview });

      const result = await reviewsApi.editRecipeReview(1, 1, editRequest);

      expect(result.rating).toBe(3);
      expect(result.comment).toBe(mockReview.comment); // Comment unchanged
    });

    it('should edit only comment', async () => {
      const editRequest: EditReviewRequest = {
        rating: 5,
        comment: 'Updated comment only',
      };

      const updatedReview = {
        ...mockReview,
        comment: 'Updated comment only',
      };

      mockedClient.put.mockResolvedValue({ data: updatedReview });

      const result = await reviewsApi.editRecipeReview(1, 1, editRequest);

      expect(result.comment).toBe('Updated comment only');
      expect(result.rating).toBe(mockReview.rating); // Rating unchanged
    });

    it('should handle review not found error', async () => {
      const editRequest: EditReviewRequest = {
        rating: 4,
        comment: 'Trying to edit non-existent review',
      };

      const error = new Error('Review not found');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        reviewsApi.editRecipeReview(1, 999, editRequest)
      ).rejects.toThrow('Review not found');
    });

    it('should handle permission denied error', async () => {
      const editRequest: EditReviewRequest = {
        rating: 4,
        comment: "Trying to edit someone else's review",
      };

      const error = new Error('Permission denied');
      mockedClient.put.mockRejectedValue(error);

      await expect(
        reviewsApi.editRecipeReview(1, 1, editRequest)
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('deleteRecipeReview', () => {
    it('should delete review successfully', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await reviewsApi.deleteRecipeReview(1, 1);

      expect(mockedClient.delete).toHaveBeenCalledWith('/recipes/1/review/1');
    });

    it('should handle review not found during deletion', async () => {
      const error = new Error('Review not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(reviewsApi.deleteRecipeReview(1, 999)).rejects.toThrow(
        'Review not found'
      );
    });

    it('should handle permission denied for deletion', async () => {
      const error = new Error('Permission denied');
      mockedClient.delete.mockRejectedValue(error);

      await expect(reviewsApi.deleteRecipeReview(1, 1)).rejects.toThrow(
        'Permission denied'
      );
    });

    it('should handle recipe not found during review deletion', async () => {
      const error = new Error('Recipe not found');
      mockedClient.delete.mockRejectedValue(error);

      await expect(reviewsApi.deleteRecipeReview(999, 1)).rejects.toThrow(
        'Recipe not found'
      );
    });

    it('should handle already deleted review', async () => {
      const error = new Error('Review already deleted');
      mockedClient.delete.mockRejectedValue(error);

      await expect(reviewsApi.deleteRecipeReview(1, 1)).rejects.toThrow(
        'Review already deleted'
      );
    });
  });
});
