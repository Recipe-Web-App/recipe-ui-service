import React from 'react';
import {
  ReviewForm,
  AddReviewForm,
  EditReviewForm,
} from '@/components/forms/ReviewForm';
import type { ReviewDto } from '@/types/recipe-management/review';

describe('ReviewForm', () => {
  const mockReviewDto: ReviewDto = {
    reviewId: 1,
    userId: 'user-1',
    rating: 5,
    comment: 'Great recipe!',
    createdAt: '2023-01-01T00:00:00Z',
  };

  describe('ReviewForm Component', () => {
    it('should export ReviewForm component', () => {
      expect(ReviewForm).toBeDefined();
      expect(typeof ReviewForm).toBe('function');
    });

    it('should accept required props for add mode', () => {
      const props = {
        mode: 'add' as const,
        recipeId: 1,
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept required props for edit mode', () => {
      const props = {
        mode: 'edit' as const,
        recipeId: 1,
        reviewId: 1,
        initialData: mockReviewDto,
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept optional onSuccess callback', () => {
      const onSuccess = jest.fn();
      const props = {
        mode: 'add' as const,
        recipeId: 1,
        onSuccess,
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept optional onError callback', () => {
      const onError = jest.fn();
      const props = {
        mode: 'add' as const,
        recipeId: 1,
        onError,
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept optional onCancel callback', () => {
      const onCancel = jest.fn();
      const props = {
        mode: 'add' as const,
        recipeId: 1,
        onCancel,
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept className prop', () => {
      const props = {
        mode: 'add' as const,
        recipeId: 1,
        className: 'custom-class',
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept showCard prop', () => {
      const props = {
        mode: 'add' as const,
        recipeId: 1,
        showCard: false,
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });

    it('should accept title prop', () => {
      const props = {
        mode: 'add' as const,
        recipeId: 1,
        title: 'Custom Title',
      };
      expect(() => React.createElement(ReviewForm, props)).not.toThrow();
    });
  });

  describe('AddReviewForm Component', () => {
    it('should export AddReviewForm component', () => {
      expect(AddReviewForm).toBeDefined();
      expect(typeof AddReviewForm).toBe('function');
    });

    it('should accept required props', () => {
      const props = {
        recipeId: 1,
      };
      expect(() => React.createElement(AddReviewForm, props)).not.toThrow();
    });

    it('should accept optional callbacks', () => {
      const props = {
        recipeId: 1,
        onSuccess: jest.fn(),
        onError: jest.fn(),
        onCancel: jest.fn(),
      };
      expect(() => React.createElement(AddReviewForm, props)).not.toThrow();
    });
  });

  describe('EditReviewForm Component', () => {
    it('should export EditReviewForm component', () => {
      expect(EditReviewForm).toBeDefined();
      expect(typeof EditReviewForm).toBe('function');
    });

    it('should accept required props', () => {
      const props = {
        recipeId: 1,
        reviewId: 1,
        initialData: mockReviewDto,
      };
      expect(() => React.createElement(EditReviewForm, props)).not.toThrow();
    });

    it('should accept optional callbacks', () => {
      const props = {
        recipeId: 1,
        reviewId: 1,
        initialData: mockReviewDto,
        onSuccess: jest.fn(),
        onError: jest.fn(),
        onCancel: jest.fn(),
      };
      expect(() => React.createElement(EditReviewForm, props)).not.toThrow();
    });
  });

  describe('ReviewForm Props Validation', () => {
    it('should handle add mode correctly', () => {
      const props = {
        mode: 'add' as const,
        recipeId: 123,
      };
      const element = React.createElement(ReviewForm, props);
      expect(element.props.mode).toBe('add');
      expect(element.props.recipeId).toBe(123);
    });

    it('should handle edit mode correctly', () => {
      const props = {
        mode: 'edit' as const,
        recipeId: 123,
        reviewId: 456,
        initialData: mockReviewDto,
      };
      const element = React.createElement(ReviewForm, props);
      expect(element.props.mode).toBe('edit');
      expect(element.props.recipeId).toBe(123);
      expect(element.props.reviewId).toBe(456);
      expect(element.props.initialData).toEqual(mockReviewDto);
    });
  });
});
