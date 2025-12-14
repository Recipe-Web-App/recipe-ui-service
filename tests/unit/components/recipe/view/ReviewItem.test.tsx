import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ReviewItem } from '@/components/recipe/view/ReviewItem';

describe('ReviewItem', () => {
  const defaultProps = {
    reviewId: 1,
    userId: 'user-123',
    rating: 4,
    comment: 'Great recipe! Easy to follow.',
    createdAt: '2024-01-15T10:00:00Z',
  };

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<ReviewItem {...defaultProps} />);

      expect(screen.getByTestId('review-item')).toBeInTheDocument();
    });

    it('should display review id as data attribute', () => {
      render(<ReviewItem {...defaultProps} />);

      expect(screen.getByTestId('review-item')).toHaveAttribute(
        'data-review-id',
        '1'
      );
    });

    it('should render with custom className', () => {
      render(<ReviewItem {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('review-item')).toHaveClass('custom-class');
    });

    it('should forward ref to container', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ReviewItem {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('User Avatar', () => {
    it('should display user initial in avatar', () => {
      render(<ReviewItem {...defaultProps} userId="alice-123" />);

      expect(screen.getByTestId('user-avatar')).toHaveTextContent('A');
    });

    it('should uppercase the initial', () => {
      render(<ReviewItem {...defaultProps} userId="bob" />);

      expect(screen.getByTestId('user-avatar')).toHaveTextContent('B');
    });

    it('should handle numeric user IDs', () => {
      render(<ReviewItem {...defaultProps} userId="123abc" />);

      expect(screen.getByTestId('user-avatar')).toHaveTextContent('1');
    });
  });

  describe('Rating Stars', () => {
    it('should display star rating component', () => {
      render(<ReviewItem {...defaultProps} />);

      expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
    });

    it('should have correct aria-label for rating 4', () => {
      render(<ReviewItem {...defaultProps} rating={4} />);

      expect(screen.getByTestId('rating-stars')).toHaveAttribute(
        'aria-label',
        '4 out of 5 stars'
      );
    });

    it('should have correct aria-label for rating 1', () => {
      render(<ReviewItem {...defaultProps} rating={1} />);

      expect(screen.getByTestId('rating-stars')).toHaveAttribute(
        'aria-label',
        '1 out of 5 stars'
      );
    });

    it('should have correct aria-label for rating 5', () => {
      render(<ReviewItem {...defaultProps} rating={5} />);

      expect(screen.getByTestId('rating-stars')).toHaveAttribute(
        'aria-label',
        '5 out of 5 stars'
      );
    });

    it('should display half-star ratings correctly', () => {
      render(<ReviewItem {...defaultProps} rating={4.5} />);

      expect(screen.getByTestId('rating-stars')).toHaveAttribute(
        'aria-label',
        '4.5 out of 5 stars'
      );
    });
  });

  describe('Comment', () => {
    it('should display comment when provided', () => {
      render(<ReviewItem {...defaultProps} />);

      expect(screen.getByTestId('review-comment')).toHaveTextContent(
        'Great recipe! Easy to follow.'
      );
    });

    it('should not display comment section when comment is null', () => {
      render(<ReviewItem {...defaultProps} comment={null} />);

      expect(screen.queryByTestId('review-comment')).not.toBeInTheDocument();
    });

    it('should not display comment section when comment is undefined', () => {
      const { comment, ...propsWithoutComment } = defaultProps;
      render(<ReviewItem {...propsWithoutComment} />);

      expect(screen.queryByTestId('review-comment')).not.toBeInTheDocument();
    });

    it('should display empty string comment (edge case)', () => {
      render(<ReviewItem {...defaultProps} comment="" />);

      // Empty string is falsy, so comment section should not render
      expect(screen.queryByTestId('review-comment')).not.toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    it('should display formatted date', () => {
      render(<ReviewItem {...defaultProps} />);

      // Date format depends on locale, just check it's rendered
      expect(screen.getByTestId('review-date')).toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      render(
        <ReviewItem {...defaultProps} createdAt="2024-12-25T00:00:00.000Z" />
      );

      expect(screen.getByTestId('review-date')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have sr-only text for rating', () => {
      render(<ReviewItem {...defaultProps} rating={4} />);

      expect(screen.getByText('4 out of 5 stars')).toHaveClass('sr-only');
    });

    it('should have aria-label on star rating container', () => {
      render(<ReviewItem {...defaultProps} rating={4} />);

      expect(screen.getByTestId('rating-stars')).toHaveAttribute(
        'aria-label',
        '4 out of 5 stars'
      );
    });
  });

  describe('Styling', () => {
    it('should have border and padding', () => {
      render(<ReviewItem {...defaultProps} />);

      expect(screen.getByTestId('review-item')).toHaveClass(
        'rounded-lg',
        'border',
        'p-4'
      );
    });

    it('should have avatar styling', () => {
      render(<ReviewItem {...defaultProps} />);

      expect(screen.getByTestId('user-avatar')).toHaveClass(
        'bg-muted',
        'rounded-full',
        'h-8',
        'w-8'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long comments', () => {
      const longComment =
        'This is a very long review comment that goes on and on describing every detail of the recipe including the texture, taste, and how it turned out. I followed all the steps carefully and the result was amazing!';

      render(<ReviewItem {...defaultProps} comment={longComment} />);

      expect(screen.getByTestId('review-comment')).toHaveTextContent(
        longComment
      );
    });

    it('should handle special characters in user ID', () => {
      render(<ReviewItem {...defaultProps} userId="@user.name" />);

      expect(screen.getByTestId('user-avatar')).toHaveTextContent('@');
    });
  });
});
