import { z } from 'zod';
import type {
  ReviewDto,
  AddReviewRequest,
  EditReviewRequest,
} from '@/types/recipe-management/review';

/**
 * Review rating validation schema
 */
export const reviewRatingSchema = z
  .number()
  .int('Rating must be a whole number')
  .min(1, 'Rating must be at least 1 star')
  .max(5, 'Rating must not exceed 5 stars');

/**
 * Review comment validation schema
 */
export const reviewCommentSchema = z
  .string()
  .max(2000, 'Comment must not exceed 2000 characters')
  .trim()
  .optional();

/**
 * Add review form validation schema
 * Note: userId is no longer included - it's extracted from auth token on the backend
 */
export const addReviewFormSchema = z.object({
  rating: reviewRatingSchema,
  comment: reviewCommentSchema,
});

/**
 * Edit review form validation schema
 * Note: userId is no longer included - it's extracted from auth token on the backend
 */
export const editReviewFormSchema = z.object({
  reviewId: z.number().int().positive(),
  rating: reviewRatingSchema,
  comment: reviewCommentSchema,
});

/**
 * Inferred TypeScript types from schemas
 */
export type AddReviewFormData = z.infer<typeof addReviewFormSchema>;
export type EditReviewFormData = z.infer<typeof editReviewFormSchema>;

/**
 * Validation options for react-hook-form
 */
export const validationOptions = {
  add: {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
  },
  edit: {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
  },
} as const;

/**
 * Convert form data to AddReviewRequest
 */
export function convertToAddReviewRequest(
  formData: AddReviewFormData
): AddReviewRequest {
  return {
    rating: formData.rating,
    comment: formData.comment,
  };
}

/**
 * Convert form data to EditReviewRequest
 */
export function convertToEditReviewRequest(
  formData: EditReviewFormData
): EditReviewRequest {
  return {
    rating: formData.rating,
    comment: formData.comment,
  };
}

/**
 * Convert ReviewDto to form data for editing
 */
export function convertFromReviewDto(review: ReviewDto): EditReviewFormData {
  return {
    reviewId: review.reviewId,
    rating: review.rating,
    comment: review.comment ?? '',
  };
}

/**
 * Default values for add review form
 */
export const addReviewDefaultValues: AddReviewFormData = {
  rating: 5,
  comment: '',
};
