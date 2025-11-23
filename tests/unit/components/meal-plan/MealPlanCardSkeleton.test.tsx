import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MealPlanCardSkeleton } from '@/components/meal-plan/MealPlanCardSkeleton';

describe('MealPlanCardSkeleton', () => {
  describe('Rendering', () => {
    it('should render skeleton with default size', () => {
      render(<MealPlanCardSkeleton />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-label', 'Loading meal plan card');
    });

    it('should render skeleton with sm size', () => {
      render(<MealPlanCardSkeleton size="sm" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skeleton with lg size', () => {
      render(<MealPlanCardSkeleton size="lg" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skeleton with custom className', () => {
      render(<MealPlanCardSkeleton className="custom-skeleton" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('custom-skeleton');
    });
  });

  describe('Structure', () => {
    it('should render mosaic skeleton with 4 image placeholders', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      // Check for 4 mosaic grid items (2x2 grid)
      const mosaicItems = container.querySelectorAll('.grid-cols-2 > div');
      expect(mosaicItems.length).toBe(4);
    });

    it('should render title skeleton', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      // Title skeleton should be present
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render description skeleton (2 lines)', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      // Check for multiple skeleton elements (title, descriptions, badges, stats)
      const skeletons = container.querySelectorAll('.animate-pulse');
      // Should have: 4 mosaic + 1 title + 2 descriptions + 2 badges + 2 footer = 11 total
      expect(skeletons.length).toBeGreaterThanOrEqual(7);
    });

    it('should render metadata badges skeleton', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      // Check for badge skeletons in metadata section
      const badgeSkeletons = container.querySelectorAll(
        '.flex-wrap .animate-pulse'
      );
      expect(badgeSkeletons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render footer skeleton with stats and badge', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      // Footer should be present
      const footers = container.querySelectorAll('[class*="border-t"]');
      expect(footers.length).toBeGreaterThan(0);
    });
  });

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const { container } = render(<MealPlanCardSkeleton size="sm" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('min-h-[280px]');
    });

    it('should apply default size classes', () => {
      const { container } = render(<MealPlanCardSkeleton size="default" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('min-h-[320px]');
    });

    it('should apply large size classes', () => {
      const { container } = render(<MealPlanCardSkeleton size="lg" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('min-h-[380px]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(<MealPlanCardSkeleton />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading meal plan card');
    });

    it('should use status role for loading indication', () => {
      render(<MealPlanCardSkeleton />);

      const statusElements = screen.getAllByRole('status');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to skeleton element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<MealPlanCardSkeleton ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('DIV');
    });

    it('should combine custom className with default classes', () => {
      render(<MealPlanCardSkeleton className="my-custom-class" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('my-custom-class');
      // Should also have default classes
      expect(skeleton.className).toContain('relative');
    });
  });

  describe('Animation', () => {
    it('should have animate-pulse class on skeleton elements', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('should apply animation to all skeleton parts', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      // All skeleton parts should have the animate-pulse class
      const animatedElements = container.querySelectorAll('.animate-pulse');
      // Mosaic (4) + title (1) + descriptions (2) + badges (2) + footer (2) = 11
      expect(animatedElements.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('Layout', () => {
    it('should maintain card structure in all sizes', () => {
      const sizes: Array<'sm' | 'default' | 'lg'> = ['sm', 'default', 'lg'];

      sizes.forEach(size => {
        const { container } = render(<MealPlanCardSkeleton size={size} />);

        // Should have mosaic container
        const mosaicContainer = container.querySelector('.grid-cols-2');
        expect(mosaicContainer).toBeInTheDocument();

        // Should have content area
        const contentArea = container.querySelector('.space-y-2');
        expect(contentArea).toBeInTheDocument();
      });
    });

    it('should render mosaic as 2x2 grid', () => {
      const { container } = render(<MealPlanCardSkeleton />);

      const grid = container.querySelector('.grid-cols-2');
      expect(grid).toHaveClass('grid-rows-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined className gracefully', () => {
      render(<MealPlanCardSkeleton className={undefined} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle undefined size (defaults to default)', () => {
      render(<MealPlanCardSkeleton size={undefined} />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('min-h-[320px]'); // default size
    });

    it('should handle empty className string', () => {
      render(<MealPlanCardSkeleton className="" />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
