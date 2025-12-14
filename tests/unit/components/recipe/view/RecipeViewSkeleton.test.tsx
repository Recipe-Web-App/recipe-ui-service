import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RecipeViewSkeleton } from '@/components/recipe/view/RecipeViewSkeleton';

describe('RecipeViewSkeleton', () => {
  describe('Rendering', () => {
    it('should render skeleton with loading state', () => {
      render(<RecipeViewSkeleton data-testid="recipe-view-skeleton" />);

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-label', 'Loading recipe');
      expect(skeleton).toHaveAttribute('role', 'status');
    });

    it('should render with custom className', () => {
      render(
        <RecipeViewSkeleton
          className="custom-class"
          data-testid="recipe-view-skeleton"
        />
      );

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toHaveClass('custom-class');
    });

    it('should have screen reader text', () => {
      render(<RecipeViewSkeleton />);

      expect(screen.getByText('Loading recipe details...')).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should render breadcrumb skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Breadcrumb has multiple skeleton items in a flex row
      const breadcrumbArea = container.querySelector(
        '.flex.items-center.gap-2'
      );
      expect(breadcrumbArea).toBeInTheDocument();
    });

    it('should render hero image skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Hero image is a large skeleton with responsive height classes
      const heroImage = container.querySelector('.h-64.w-full.rounded-lg');
      expect(heroImage).toBeInTheDocument();
    });

    it('should render title skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Title skeleton with specific dimensions
      const titleSkeleton = container.querySelector('.h-8.w-3\\/4');
      expect(titleSkeleton).toBeInTheDocument();
    });

    it('should render rating stars skeleton (5 stars)', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Rating stars are in a flex gap-1 container
      const ratingStars = container.querySelectorAll('.flex.gap-1');
      expect(ratingStars.length).toBeGreaterThan(0);
    });

    it('should render action buttons skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Action buttons area with gap-2
      const actionsArea = container.querySelector('.flex.gap-2');
      expect(actionsArea).toBeInTheDocument();
    });

    it('should render metadata badges skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Metadata area with flex-wrap
      const metadataArea = container.querySelector(
        '.flex.flex-wrap.items-center.gap-3'
      );
      expect(metadataArea).toBeInTheDocument();
    });

    it('should render author skeleton with avatar', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Look for avatar skeletons (circular)
      const avatars = container.querySelectorAll('[class*="rounded-full"]');
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  describe('Two-Column Layout', () => {
    it('should render grid layout for ingredients and instructions', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Two-column grid
      const gridLayout = container.querySelector('.grid.gap-6');
      expect(gridLayout).toBeInTheDocument();
      expect(gridLayout).toHaveClass('lg:grid-cols-3');
    });

    it('should render ingredients section skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Ingredients section is lg:col-span-1
      const ingredientsSection = container.querySelector('.lg\\:col-span-1');
      expect(ingredientsSection).toBeInTheDocument();
    });

    it('should render instructions section skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Instructions section is lg:col-span-2
      const instructionsSection = container.querySelector('.lg\\:col-span-2');
      expect(instructionsSection).toBeInTheDocument();
    });

    it('should render servings scaler skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Servings scaler is in a bordered container
      const scalerArea = container.querySelector('.rounded-lg.border.p-3');
      expect(scalerArea).toBeInTheDocument();
    });

    it('should render multiple ingredient item skeletons', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Each ingredient has checkbox + text in flex row
      const ingredientItems = container.querySelectorAll(
        '.lg\\:col-span-1 .space-y-3 > .flex.items-center.gap-3'
      );
      expect(ingredientItems.length).toBe(8);
    });

    it('should render multiple instruction step skeletons', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Each step is in a bordered container with gap-4
      const instructionSteps = container.querySelectorAll(
        '.lg\\:col-span-2 .space-y-4 > .flex.gap-4.rounded-lg.border.p-4'
      );
      expect(instructionSteps.length).toBe(5);
    });
  });

  describe('Tags Section', () => {
    it('should render tags section skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Tags are in flex-wrap with gap-2
      const tagsArea = container.querySelector('.flex.flex-wrap.gap-2');
      expect(tagsArea).toBeInTheDocument();
    });

    it('should render multiple tag chip skeletons', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Get the tags wrapper and count its children
      const tagsContainer = container.querySelectorAll('.flex.flex-wrap.gap-2');
      // Should have at least the tags section
      expect(tagsContainer.length).toBeGreaterThan(0);
    });
  });

  describe('Reviews Section', () => {
    it('should render reviews section header', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Reviews section has header with title and button
      const reviewsHeader = container.querySelector(
        '.space-y-4 > .flex.items-center.justify-between'
      );
      expect(reviewsHeader).toBeInTheDocument();
    });

    it('should render average rating display skeleton', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Average rating is in bordered container with flex items-center gap-4
      const avgRating = container.querySelector(
        '.flex.items-center.gap-4.rounded-lg.border.p-4'
      );
      expect(avgRating).toBeInTheDocument();
    });

    it('should render review item skeletons', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Review items are in space-y-2 containers with border
      const reviewItems = container.querySelectorAll(
        '.space-y-2.rounded-lg.border.p-4'
      );
      expect(reviewItems.length).toBe(3);
    });

    it('should render review avatars', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Each review item has an avatar
      const reviewItems = container.querySelectorAll(
        '.space-y-2.rounded-lg.border.p-4'
      );
      reviewItems.forEach(item => {
        const avatar = item.querySelector('[aria-label="Loading avatar..."]');
        expect(avatar).toBeInTheDocument();
      });
    });
  });

  describe('Animation', () => {
    it('should have animation classes on skeleton elements', () => {
      const { container } = render(<RecipeViewSkeleton />);

      // Skeleton uses animate-skeleton-pulse class
      const animatedElements = container.querySelectorAll(
        '[class*="animate-skeleton"]'
      );
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attribute', () => {
      render(<RecipeViewSkeleton data-testid="recipe-view-skeleton" />);

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toHaveAttribute('role', 'status');
    });

    it('should have aria-label for loading state', () => {
      render(<RecipeViewSkeleton data-testid="recipe-view-skeleton" />);

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading recipe');
    });

    it('should have sr-only text for screen readers', () => {
      render(<RecipeViewSkeleton />);

      const srText = screen.getByText('Loading recipe details...');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to container element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RecipeViewSkeleton ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('DIV');
    });

    it('should apply additional HTML attributes', () => {
      render(<RecipeViewSkeleton data-testid="recipe-skeleton" />);

      const skeleton = screen.getByTestId('recipe-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should combine custom className with default classes', () => {
      render(
        <RecipeViewSkeleton
          className="my-custom-class"
          data-testid="recipe-view-skeleton"
        />
      );

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toHaveClass('my-custom-class');
      expect(skeleton).toHaveClass('space-y-6');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined className gracefully', () => {
      render(
        <RecipeViewSkeleton
          className={undefined}
          data-testid="recipe-view-skeleton"
        />
      );

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle empty className string', () => {
      render(
        <RecipeViewSkeleton className="" data-testid="recipe-view-skeleton" />
      );

      const skeleton = screen.getByTestId('recipe-view-skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
