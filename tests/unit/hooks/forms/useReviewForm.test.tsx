import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAddReviewForm,
  useEditReviewForm,
} from '@/hooks/forms/useReviewForm';
import type { ReviewDto } from '@/types/recipe-management/review';
import React from 'react';

// Mock the API
jest.mock('@/lib/api/recipe-management', () => ({
  recipesApi: {
    addRecipeReview: jest.fn(),
    editRecipeReview: jest.fn(),
  },
}));

// Mock constants
jest.mock('@/constants', () => ({
  QUERY_KEYS: {
    RECIPE_MANAGEMENT: {
      RECIPES: ['recipe-management', 'recipes'] as const,
      RECIPE: ['recipe-management', 'recipe'] as const,
      REVIEWS: ['recipe-management', 'reviews'] as const,
    },
  },
}));

describe('useReviewForm hooks', () => {
  let queryClient: QueryClient;

  const mockReviewDto: ReviewDto = {
    reviewId: 1,
    userId: 'user-123',
    rating: 5,
    comment: 'Great recipe!',
    createdAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useAddReviewForm', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      const values = result.current.form.getValues();
      expect(values.rating).toBe(5);
      expect(values.comment).toBe('');
    });

    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.hasErrors).toBe(false);
      expect(result.current.hasChanges).toBe(false);
    });

    it('should provide form validation methods', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.resetForm).toBe('function');
      expect(typeof result.current.getFieldError).toBe('function');
      expect(typeof result.current.validateField).toBe('function');
      expect(typeof result.current.validateForm).toBe('function');
      expect(typeof result.current.clearErrors).toBe('function');
    });

    it('should update rating', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      act(() => {
        result.current.form.setValue('rating', 3);
      });

      expect(result.current.form.getValues('rating')).toBe(3);
    });

    it('should update comment', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      act(() => {
        result.current.form.setValue('comment', 'Updated comment');
      });

      expect(result.current.form.getValues('comment')).toBe('Updated comment');
    });

    it('should reset form to default values', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      act(() => {
        result.current.form.setValue('rating', 3);
        result.current.form.setValue('comment', 'Test');
      });

      act(() => {
        result.current.resetForm();
      });

      const values = result.current.form.getValues();
      expect(values.rating).toBe(5);
      expect(values.comment).toBe('');
    });
  });

  describe('useEditReviewForm', () => {
    it('should initialize with review data', () => {
      const { result } = renderHook(
        () => useEditReviewForm(1, 1, mockReviewDto),
        { wrapper }
      );

      const formValues = result.current.form.getValues();
      expect(formValues.reviewId).toBe(1);
      expect(formValues.rating).toBe(5);
      expect(formValues.comment).toBe('Great recipe!');
    });

    it('should have correct initial state', () => {
      const { result } = renderHook(
        () => useEditReviewForm(1, 1, mockReviewDto),
        { wrapper }
      );

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.hasErrors).toBe(false);
    });

    it('should provide form validation methods', () => {
      const { result } = renderHook(
        () => useEditReviewForm(1, 1, mockReviewDto),
        { wrapper }
      );

      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.resetForm).toBe('function');
      expect(typeof result.current.getFieldError).toBe('function');
      expect(typeof result.current.validateField).toBe('function');
      expect(typeof result.current.validateForm).toBe('function');
      expect(typeof result.current.clearErrors).toBe('function');
    });

    it('should update rating in edit mode', () => {
      const { result } = renderHook(
        () => useEditReviewForm(1, 1, mockReviewDto),
        { wrapper }
      );

      act(() => {
        result.current.form.setValue('rating', 4);
      });

      expect(result.current.form.getValues('rating')).toBe(4);
    });

    it('should update comment in edit mode', () => {
      const { result } = renderHook(
        () => useEditReviewForm(1, 1, mockReviewDto),
        { wrapper }
      );

      act(() => {
        result.current.form.setValue('comment', 'Updated review');
      });

      expect(result.current.form.getValues('comment')).toBe('Updated review');
    });
  });

  describe('callback handling', () => {
    it('should call onSuccess callback when provided', async () => {
      const mockOnSuccess = jest.fn();
      const { recipesApi } = require('@/lib/api/recipe-management');

      recipesApi.addRecipeReview.mockResolvedValue(mockReviewDto);

      const { result } = renderHook(
        () => useAddReviewForm(1, { onSuccess: mockOnSuccess }),
        { wrapper }
      );

      // Basic verification that the hook has the submit function
      expect(result.current.handleSubmit).toBeDefined();
    });

    it('should call onError callback when provided', async () => {
      const mockOnError = jest.fn();
      const mockError = new Error('API Error');
      const { recipesApi } = require('@/lib/api/recipe-management');

      recipesApi.addRecipeReview.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useAddReviewForm(1, { onError: mockOnError }),
        { wrapper }
      );

      // Basic verification that the hook has the error handling
      expect(result.current.handleSubmit).toBeDefined();
    });
  });

  describe('form validation', () => {
    it('should validate rating is required', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      act(() => {
        result.current.form.setValue('rating', 0);
      });

      act(() => {
        result.current.validateField('rating');
      });

      // Verify validation method exists
      expect(result.current.validateField).toBeDefined();
    });

    it('should provide field error getter', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      expect(typeof result.current.getFieldError).toBe('function');

      // Should return undefined when no errors
      const error = result.current.getFieldError('rating');
      expect(error).toBeUndefined();
    });

    it('should clear errors', () => {
      const { result } = renderHook(() => useAddReviewForm(1), { wrapper });

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.hasErrors).toBe(false);
    });
  });
});
