import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RecipeMetadata } from '@/components/recipe/view/RecipeMetadata';
import { DifficultyLevel } from '@/types/recipe-management/common';

describe('RecipeMetadata', () => {
  describe('Rendering', () => {
    it('should render all metadata when all props provided', () => {
      render(
        <RecipeMetadata
          preparationTime={15}
          cookingTime={30}
          servings={4}
          difficulty={DifficultyLevel.MEDIUM}
        />
      );

      expect(screen.getByTestId('recipe-metadata')).toBeInTheDocument();
      expect(screen.getByTestId('prep-time-badge')).toBeInTheDocument();
      expect(screen.getByTestId('cook-time-badge')).toBeInTheDocument();
      expect(screen.getByTestId('servings-badge')).toBeInTheDocument();
      expect(screen.getByTestId('difficulty-badge')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <RecipeMetadata
          servings={4}
          className="custom-class"
          data-testid="recipe-metadata"
        />
      );

      const metadata = screen.getByTestId('recipe-metadata');
      expect(metadata).toHaveClass('custom-class');
    });

    it('should forward ref to container', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RecipeMetadata servings={4} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Preparation Time', () => {
    it('should display preparation time correctly', () => {
      render(<RecipeMetadata preparationTime={15} servings={4} />);

      expect(screen.getByText('Prep: 15 min')).toBeInTheDocument();
    });

    it('should hide prep time badge when preparationTime is null', () => {
      render(<RecipeMetadata preparationTime={null} servings={4} />);

      expect(screen.queryByTestId('prep-time-badge')).not.toBeInTheDocument();
    });

    it('should hide prep time badge when preparationTime is undefined', () => {
      render(<RecipeMetadata servings={4} />);

      expect(screen.queryByTestId('prep-time-badge')).not.toBeInTheDocument();
    });

    it('should handle 0 preparation time by not rendering', () => {
      render(<RecipeMetadata preparationTime={0} servings={4} />);

      expect(screen.queryByTestId('prep-time-badge')).not.toBeInTheDocument();
    });
  });

  describe('Cooking Time', () => {
    it('should display cooking time correctly', () => {
      render(<RecipeMetadata cookingTime={45} servings={4} />);

      expect(screen.getByText('Cook: 45 min')).toBeInTheDocument();
    });

    it('should hide cook time badge when cookingTime is null', () => {
      render(<RecipeMetadata cookingTime={null} servings={4} />);

      expect(screen.queryByTestId('cook-time-badge')).not.toBeInTheDocument();
    });

    it('should hide cook time badge when cookingTime is undefined', () => {
      render(<RecipeMetadata servings={4} />);

      expect(screen.queryByTestId('cook-time-badge')).not.toBeInTheDocument();
    });
  });

  describe('Servings', () => {
    it('should display singular "serving" for 1 serving', () => {
      render(<RecipeMetadata servings={1} />);

      expect(screen.getByText('1 serving')).toBeInTheDocument();
    });

    it('should display plural "servings" for multiple servings', () => {
      render(<RecipeMetadata servings={4} />);

      expect(screen.getByText('4 servings')).toBeInTheDocument();
    });

    it('should display plural "servings" for 0 servings', () => {
      render(<RecipeMetadata servings={0} />);

      expect(screen.getByText('0 servings')).toBeInTheDocument();
    });
  });

  describe('Difficulty', () => {
    it('should display EASY difficulty', () => {
      render(<RecipeMetadata servings={4} difficulty={DifficultyLevel.EASY} />);

      expect(screen.getByText('easy')).toBeInTheDocument();
    });

    it('should display MEDIUM difficulty', () => {
      render(
        <RecipeMetadata servings={4} difficulty={DifficultyLevel.MEDIUM} />
      );

      expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('should display HARD difficulty', () => {
      render(<RecipeMetadata servings={4} difficulty={DifficultyLevel.HARD} />);

      expect(screen.getByText('hard')).toBeInTheDocument();
    });

    it('should hide difficulty badge when difficulty is null', () => {
      render(<RecipeMetadata servings={4} difficulty={null} />);

      expect(screen.queryByTestId('difficulty-badge')).not.toBeInTheDocument();
    });

    it('should hide difficulty badge when difficulty is undefined', () => {
      render(<RecipeMetadata servings={4} />);

      expect(screen.queryByTestId('difficulty-badge')).not.toBeInTheDocument();
    });
  });

  describe('Minimal State', () => {
    it('should render with only servings (required prop)', () => {
      render(<RecipeMetadata servings={4} />);

      expect(screen.getByTestId('recipe-metadata')).toBeInTheDocument();
      expect(screen.getByTestId('servings-badge')).toBeInTheDocument();
      expect(screen.queryByTestId('prep-time-badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cook-time-badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('difficulty-badge')).not.toBeInTheDocument();
    });

    it('should render with servings of 0', () => {
      render(<RecipeMetadata servings={0} />);

      expect(screen.getByTestId('recipe-metadata')).toBeInTheDocument();
      expect(screen.getByText('0 servings')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on icons', () => {
      render(
        <RecipeMetadata
          preparationTime={15}
          cookingTime={30}
          servings={4}
          difficulty={DifficultyLevel.MEDIUM}
        />
      );

      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBe(4); // Clock x2, Users, ChefHat
    });

    it('should have descriptive text for screen readers', () => {
      render(
        <RecipeMetadata
          preparationTime={15}
          cookingTime={30}
          servings={4}
          difficulty={DifficultyLevel.EASY}
        />
      );

      expect(screen.getByText('Prep: 15 min')).toBeInTheDocument();
      expect(screen.getByText('Cook: 30 min')).toBeInTheDocument();
      expect(screen.getByText('4 servings')).toBeInTheDocument();
      expect(screen.getByText('easy')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have flex layout classes', () => {
      render(<RecipeMetadata servings={4} />);

      const container = screen.getByTestId('recipe-metadata');
      expect(container).toHaveClass(
        'flex',
        'flex-wrap',
        'items-center',
        'gap-3'
      );
    });

    it('should have badge styling on each metadata item', () => {
      render(
        <RecipeMetadata
          preparationTime={15}
          cookingTime={30}
          servings={4}
          difficulty={DifficultyLevel.MEDIUM}
        />
      );

      const prepBadge = screen.getByTestId('prep-time-badge');
      expect(prepBadge).toHaveClass(
        'bg-muted',
        'flex',
        'items-center',
        'rounded-full'
      );
    });

    it('should have capitalize class on difficulty badge', () => {
      render(
        <RecipeMetadata servings={4} difficulty={DifficultyLevel.MEDIUM} />
      );

      const difficultyBadge = screen.getByTestId('difficulty-badge');
      expect(difficultyBadge).toHaveClass('capitalize');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large preparation time', () => {
      render(<RecipeMetadata preparationTime={1440} servings={4} />);

      expect(screen.getByText('Prep: 1440 min')).toBeInTheDocument();
    });

    it('should handle very large cooking time', () => {
      render(<RecipeMetadata cookingTime={720} servings={4} />);

      expect(screen.getByText('Cook: 720 min')).toBeInTheDocument();
    });

    it('should handle very large servings count', () => {
      render(<RecipeMetadata servings={100} />);

      expect(screen.getByText('100 servings')).toBeInTheDocument();
    });
  });
});
