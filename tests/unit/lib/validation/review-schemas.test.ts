import {
  reviewRatingSchema,
  reviewCommentSchema,
  addReviewFormSchema,
  editReviewFormSchema,
  convertToAddReviewRequest,
  convertToEditReviewRequest,
  convertFromReviewDto,
  addReviewDefaultValues,
} from '@/lib/validation/review-schemas';
import type { ReviewDto } from '@/types/recipe-management/review';

describe('Review Schemas', () => {
  describe('reviewRatingSchema', () => {
    it('should validate valid ratings', () => {
      expect(reviewRatingSchema.parse(1)).toBe(1);
      expect(reviewRatingSchema.parse(3)).toBe(3);
      expect(reviewRatingSchema.parse(5)).toBe(5);
    });

    it('should reject ratings below 1', () => {
      expect(() => reviewRatingSchema.parse(0)).toThrow(
        'Rating must be at least 1 star'
      );
      expect(() => reviewRatingSchema.parse(-1)).toThrow();
    });

    it('should reject ratings above 5', () => {
      expect(() => reviewRatingSchema.parse(6)).toThrow(
        'Rating must not exceed 5 stars'
      );
    });

    it('should reject non-integer ratings', () => {
      expect(() => reviewRatingSchema.parse(3.5)).toThrow(
        'Rating must be a whole number'
      );
    });
  });

  describe('reviewCommentSchema', () => {
    it('should validate valid comments', () => {
      const comment = 'This is a great recipe!';
      expect(reviewCommentSchema.parse(comment)).toBe(comment);
    });

    it('should allow empty comments', () => {
      expect(reviewCommentSchema.parse('')).toBe('');
      expect(reviewCommentSchema.parse(undefined)).toBeUndefined();
    });

    it('should trim whitespace', () => {
      expect(reviewCommentSchema.parse('  comment  ')).toBe('comment');
    });

    it('should reject comments exceeding 2000 characters', () => {
      const longComment = 'a'.repeat(2001);
      expect(() => reviewCommentSchema.parse(longComment)).toThrow(
        'Comment must not exceed 2000 characters'
      );
    });
  });

  describe('addReviewFormSchema', () => {
    const validData = {
      rating: 5,
      comment: 'Excellent recipe!',
    };

    it('should validate complete review data', () => {
      const result = addReviewFormSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should allow optional comment', () => {
      const dataWithoutComment = {
        rating: 4,
      };
      const result = addReviewFormSchema.parse(dataWithoutComment);
      expect(result.rating).toBe(4);
    });

    it('should require rating', () => {
      const dataWithoutRating = {
        comment: 'Nice',
      };
      expect(() => addReviewFormSchema.parse(dataWithoutRating)).toThrow();
    });
  });

  describe('editReviewFormSchema', () => {
    const validData = {
      reviewId: 1,
      rating: 4,
      comment: 'Updated comment',
    };

    it('should validate complete edit data', () => {
      const result = editReviewFormSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should require reviewId', () => {
      const dataWithoutReviewId = {
        rating: 4,
        comment: 'Updated',
      };
      expect(() => editReviewFormSchema.parse(dataWithoutReviewId)).toThrow();
    });

    it('should validate reviewId is positive', () => {
      const dataWithInvalidReviewId = {
        reviewId: 0,
        rating: 4,
        comment: 'Updated',
      };
      expect(() =>
        editReviewFormSchema.parse(dataWithInvalidReviewId)
      ).toThrow();
    });
  });

  describe('convertToAddReviewRequest', () => {
    it('should convert form data to API request', () => {
      const formData = {
        rating: 5,
        comment: 'Delicious!',
      };
      const result = convertToAddReviewRequest(formData);
      expect(result).toEqual({
        rating: 5,
        comment: 'Delicious!',
      });
    });

    it('should handle optional comment', () => {
      const formData = {
        rating: 4,
      };
      const result = convertToAddReviewRequest(formData);
      expect(result.rating).toBe(4);
      expect(result.comment).toBeUndefined();
    });
  });

  describe('convertToEditReviewRequest', () => {
    it('should convert form data to API request', () => {
      const formData = {
        reviewId: 1,
        rating: 4,
        comment: 'Updated review',
      };
      const result = convertToEditReviewRequest(formData);
      expect(result).toEqual({
        rating: 4,
        comment: 'Updated review',
      });
    });
  });

  describe('convertFromReviewDto', () => {
    it('should convert ReviewDto to form data', () => {
      const reviewDto: ReviewDto = {
        reviewId: 1,
        userId: 'user-123',
        rating: 5,
        comment: 'Great recipe',
        createdAt: '2023-01-01T00:00:00Z',
      };
      const result = convertFromReviewDto(reviewDto);
      expect(result).toEqual({
        reviewId: 1,
        rating: 5,
        comment: 'Great recipe',
      });
    });

    it('should handle missing comment', () => {
      const reviewDto: ReviewDto = {
        reviewId: 1,
        userId: 'user-123',
        rating: 4,
        createdAt: '2023-01-01T00:00:00Z',
      };
      const result = convertFromReviewDto(reviewDto);
      expect(result.comment).toBe('');
    });
  });

  describe('addReviewDefaultValues', () => {
    it('should have correct default values', () => {
      expect(addReviewDefaultValues).toEqual({
        rating: 5,
        comment: '',
      });
    });
  });
});
