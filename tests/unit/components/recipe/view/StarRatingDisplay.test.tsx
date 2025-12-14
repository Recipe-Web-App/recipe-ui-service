import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { StarRatingDisplay } from '@/components/recipe/view/StarRatingDisplay';

describe('StarRatingDisplay', () => {
  describe('Rendering', () => {
    it('should render the component', () => {
      render(<StarRatingDisplay rating={3} data-testid="stars" />);

      expect(screen.getByTestId('stars')).toBeInTheDocument();
    });

    it('should render 5 star containers by default', () => {
      render(<StarRatingDisplay rating={3} data-testid="stars" />);

      const container = screen.getByTestId('stars');
      // Each star is in a relative div container
      const starContainers = container.querySelectorAll(
        ':scope > div.relative'
      );
      expect(starContainers).toHaveLength(5);
    });

    it('should render custom number of stars', () => {
      render(
        <StarRatingDisplay rating={3} maxStars={10} data-testid="stars" />
      );

      const container = screen.getByTestId('stars');
      const starContainers = container.querySelectorAll(
        ':scope > div.relative'
      );
      expect(starContainers).toHaveLength(10);
    });
  });

  describe('Rating Display', () => {
    it('should have correct aria-label for whole number rating', () => {
      render(<StarRatingDisplay rating={4} data-testid="stars" />);

      expect(screen.getByTestId('stars')).toHaveAttribute(
        'aria-label',
        '4 out of 5 stars'
      );
    });

    it('should have correct aria-label for half-star rating', () => {
      render(<StarRatingDisplay rating={4.5} data-testid="stars" />);

      expect(screen.getByTestId('stars')).toHaveAttribute(
        'aria-label',
        '4.5 out of 5 stars'
      );
    });

    it('should have correct aria-label for minimum rating', () => {
      render(<StarRatingDisplay rating={0.5} data-testid="stars" />);

      expect(screen.getByTestId('stars')).toHaveAttribute(
        'aria-label',
        '0.5 out of 5 stars'
      );
    });

    it('should have correct aria-label for zero rating', () => {
      render(<StarRatingDisplay rating={0} data-testid="stars" />);

      expect(screen.getByTestId('stars')).toHaveAttribute(
        'aria-label',
        '0 out of 5 stars'
      );
    });
  });

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      render(<StarRatingDisplay rating={3} size="sm" data-testid="stars" />);

      const container = screen.getByTestId('stars');
      const svgs = container.querySelectorAll('svg');
      expect(svgs[0]).toHaveClass('h-3', 'w-3');
    });

    it('should apply medium size classes by default', () => {
      render(<StarRatingDisplay rating={3} data-testid="stars" />);

      const container = screen.getByTestId('stars');
      const svgs = container.querySelectorAll('svg');
      expect(svgs[0]).toHaveClass('h-4', 'w-4');
    });

    it('should apply large size classes', () => {
      render(<StarRatingDisplay rating={3} size="lg" data-testid="stars" />);

      const container = screen.getByTestId('stars');
      const svgs = container.querySelectorAll('svg');
      expect(svgs[0]).toHaveClass('h-5', 'w-5');
    });
  });

  describe('Show Value', () => {
    it('should not show numeric value by default', () => {
      render(<StarRatingDisplay rating={4.5} data-testid="stars" />);

      expect(screen.queryByText('4.5')).not.toBeInTheDocument();
    });

    it('should show numeric value when showValue is true', () => {
      render(<StarRatingDisplay rating={4.5} showValue data-testid="stars" />);

      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should format value to one decimal place', () => {
      render(<StarRatingDisplay rating={3} showValue data-testid="stars" />);

      expect(screen.getByText('3.0')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should accept custom className', () => {
      render(
        <StarRatingDisplay
          rating={3}
          className="custom-class"
          data-testid="stars"
        />
      );

      expect(screen.getByTestId('stars')).toHaveClass('custom-class');
    });

    it('should forward ref to container', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<StarRatingDisplay rating={3} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should pass through additional props', () => {
      render(<StarRatingDisplay rating={3} data-testid="custom-stars" />);

      expect(screen.getByTestId('custom-stars')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have sr-only text for rating', () => {
      render(<StarRatingDisplay rating={4} />);

      expect(screen.getByText('4 out of 5 stars')).toHaveClass('sr-only');
    });

    it('should mark individual stars as aria-hidden', () => {
      render(<StarRatingDisplay rating={3} data-testid="stars" />);

      const container = screen.getByTestId('stars');
      const starContainers = container.querySelectorAll('[aria-hidden="true"]');
      expect(starContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Half-Star Display', () => {
    it('should display half-star for 0.5 rating', () => {
      render(<StarRatingDisplay rating={0.5} data-testid="stars" />);

      const container = screen.getByTestId('stars');
      // Check for half-star clipping div (width: 50%)
      const halfStarClip = container.querySelector('[style*="width: 50%"]');
      expect(halfStarClip).toBeInTheDocument();
    });

    it('should display half-star for 2.5 rating', () => {
      render(<StarRatingDisplay rating={2.5} data-testid="stars" />);

      const container = screen.getByTestId('stars');
      const halfStarClip = container.querySelector('[style*="width: 50%"]');
      expect(halfStarClip).toBeInTheDocument();
    });

    it('should not display half-star for whole number rating', () => {
      render(<StarRatingDisplay rating={3} data-testid="stars" />);

      const container = screen.getByTestId('stars');
      const halfStarClip = container.querySelector('[style*="width: 50%"]');
      expect(halfStarClip).not.toBeInTheDocument();
    });
  });
});
