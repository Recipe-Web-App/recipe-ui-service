import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ReviewModal } from '@/components/recipe/view/ReviewModal';
import type { ReviewDto } from '@/types/recipe-management/review';

// Mock the toast store
jest.mock('@/stores/ui/toast-store', () => ({
  useToastStore: () => ({
    addSuccessToast: jest.fn(),
    addErrorToast: jest.fn(),
  }),
}));

// Mock the ReviewForm component
jest.mock('@/components/forms/ReviewForm', () => ({
  ReviewForm: ({
    mode,
    recipeId,
    reviewId,
    onSuccess,
    onError,
    onCancel,
  }: {
    mode: 'add' | 'edit';
    recipeId: number;
    reviewId?: number;
    onSuccess?: (data: ReviewDto) => void;
    onError?: (error: Error) => void;
    onCancel?: () => void;
  }) => (
    <div data-testid="mock-review-form">
      <span data-testid="form-mode">{mode}</span>
      <span data-testid="form-recipe-id">{recipeId}</span>
      {reviewId && <span data-testid="form-review-id">{reviewId}</span>}
      <button
        data-testid="mock-submit-button"
        onClick={() =>
          onSuccess?.({
            reviewId: reviewId ?? 999,
            userId: 'user-123',
            rating: 5,
            comment: 'Great recipe!',
            createdAt: '2024-01-01T00:00:00Z',
          })
        }
      >
        Submit
      </button>
      <button
        data-testid="mock-error-button"
        onClick={() => onError?.(new Error('Network error'))}
      >
        Error
      </button>
      <button data-testid="mock-cancel-button" onClick={() => onCancel?.()}>
        Cancel
      </button>
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Star: () => <span data-testid="star-icon">Star</span>,
}));

describe('ReviewModal', () => {
  const defaultProps = {
    recipeId: 1,
    open: true,
    onOpenChange: jest.fn(),
  };

  const mockExistingReview: ReviewDto = {
    reviewId: 42,
    userId: 'user-123',
    rating: 4,
    comment: 'Very tasty!',
    createdAt: '2024-01-15T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when open is true', () => {
      render(<ReviewModal {...defaultProps} />);

      expect(screen.getByTestId('review-modal')).toBeInTheDocument();
    });

    it('should not render modal when open is false', () => {
      render(<ReviewModal {...defaultProps} open={false} />);

      expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    });

    it('should render ReviewForm component', () => {
      render(<ReviewModal {...defaultProps} />);

      expect(screen.getByTestId('mock-review-form')).toBeInTheDocument();
    });

    it('should forward ref to modal content', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ReviewModal {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Add Mode (no existing review)', () => {
    it('should display "Write a Review" title', () => {
      render(<ReviewModal {...defaultProps} />);

      expect(screen.getByTestId('review-modal-title')).toHaveTextContent(
        'Write a Review'
      );
    });

    it('should display add description', () => {
      render(<ReviewModal {...defaultProps} />);

      expect(
        screen.getByText('Share your experience with this recipe')
      ).toBeInTheDocument();
    });

    it('should pass add mode to ReviewForm', () => {
      render(<ReviewModal {...defaultProps} />);

      expect(screen.getByTestId('form-mode')).toHaveTextContent('add');
    });

    it('should pass recipeId to ReviewForm', () => {
      render(<ReviewModal {...defaultProps} recipeId={42} />);

      expect(screen.getByTestId('form-recipe-id')).toHaveTextContent('42');
    });

    it('should not pass reviewId to ReviewForm in add mode', () => {
      render(<ReviewModal {...defaultProps} />);

      expect(screen.queryByTestId('form-review-id')).not.toBeInTheDocument();
    });
  });

  describe('Edit Mode (with existing review)', () => {
    it('should display "Edit Review" title', () => {
      render(
        <ReviewModal {...defaultProps} existingReview={mockExistingReview} />
      );

      expect(screen.getByTestId('review-modal-title')).toHaveTextContent(
        'Edit Review'
      );
    });

    it('should display edit description', () => {
      render(
        <ReviewModal {...defaultProps} existingReview={mockExistingReview} />
      );

      expect(
        screen.getByText('Update your review for this recipe')
      ).toBeInTheDocument();
    });

    it('should pass edit mode to ReviewForm', () => {
      render(
        <ReviewModal {...defaultProps} existingReview={mockExistingReview} />
      );

      expect(screen.getByTestId('form-mode')).toHaveTextContent('edit');
    });

    it('should pass reviewId to ReviewForm in edit mode', () => {
      render(
        <ReviewModal {...defaultProps} existingReview={mockExistingReview} />
      );

      expect(screen.getByTestId('form-review-id')).toHaveTextContent('42');
    });
  });

  describe('Callbacks', () => {
    it('should call onOpenChange(false) when form submit succeeds', () => {
      const onOpenChange = jest.fn();
      render(<ReviewModal {...defaultProps} onOpenChange={onOpenChange} />);

      const submitButton = screen.getByTestId('mock-submit-button');
      submitButton.click();

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange(false) when form is cancelled', () => {
      const onOpenChange = jest.fn();
      render(<ReviewModal {...defaultProps} onOpenChange={onOpenChange} />);

      const cancelButton = screen.getByTestId('mock-cancel-button');
      cancelButton.click();

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange(false) on success in edit mode', () => {
      const onOpenChange = jest.fn();
      render(
        <ReviewModal
          {...defaultProps}
          onOpenChange={onOpenChange}
          existingReview={mockExistingReview}
        />
      );

      const submitButton = screen.getByTestId('mock-submit-button');
      submitButton.click();

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should handle errors from form submission', () => {
      render(<ReviewModal {...defaultProps} />);

      const errorButton = screen.getByTestId('mock-error-button');
      errorButton.click();

      // Error should be handled (toast is mocked, so we just verify no crash)
      expect(screen.getByTestId('review-modal')).toBeInTheDocument();
    });
  });

  describe('Component Export', () => {
    it('should export ReviewModal component', () => {
      expect(ReviewModal).toBeDefined();
      expect(typeof ReviewModal).toBe('object'); // forwardRef returns object
    });

    it('should have displayName', () => {
      expect(ReviewModal.displayName).toBe('ReviewModal');
    });
  });

  describe('Props', () => {
    it('should accept all required props', () => {
      const props = {
        recipeId: 1,
        open: true,
        onOpenChange: jest.fn(),
      };

      expect(() => render(<ReviewModal {...props} />)).not.toThrow();
    });

    it('should accept optional existingReview prop', () => {
      const props = {
        recipeId: 1,
        open: true,
        onOpenChange: jest.fn(),
        existingReview: mockExistingReview,
      };

      expect(() => render(<ReviewModal {...props} />)).not.toThrow();
    });
  });
});
