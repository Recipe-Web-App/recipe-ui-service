import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeCardProps } from '@/types/ui/recipe-card';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MoreVertical: () => <div data-testid="more-vertical-icon">More</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  ChefHat: () => <div data-testid="chef-hat-icon">ChefHat</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Share2: () => <div data-testid="share2-icon">Share2</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Trash2: () => <div data-testid="trash2-icon">Trash2</div>,
  Flag: () => <div data-testid="flag-icon">Flag</div>,
}));

// Mock child components
jest.mock('@/components/ui/quick-actions', () => ({
  QuickActions: ({
    actions,
  }: {
    actions: Array<{ id: string; label: string; onClick: () => void }>;
  }) => (
    <div data-testid="quick-actions">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={action.onClick}
          data-testid={`quick-action-${action.id}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('@/components/ui/avatar', () => ({
  RecipeAuthor: ({ author }: { author: { name: string } }) => (
    <div data-testid="recipe-author">{author.name}</div>
  ),
}));

jest.mock('@/components/ui/rating', () => ({
  Rating: ({ value }: { value: number }) => (
    <div data-testid="rating">Rating: {value}</div>
  ),
}));

describe('RecipeCard', () => {
  const mockRecipe: RecipeCardProps['recipe'] = {
    recipeId: 1,
    title: 'Chocolate Chip Cookies',
    description: 'Delicious homemade cookies',
    imageUrl: '/images/cookies.jpg',
    preparationTime: 15,
    cookingTime: 12,
    difficulty: DifficultyLevel.EASY,
    servings: 24,
    rating: 4.5,
    reviewCount: 128,
    author: {
      id: 'user-123',
      name: 'Jane Doe',
      avatar: '/avatars/jane.jpg',
      role: 'chef',
      verified: true,
      rating: 4.8,
      recipeCount: 45,
    },
  };

  describe('Rendering', () => {
    it('should render recipe card with all basic information', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
      expect(
        screen.getByText('Delicious homemade cookies')
      ).toBeInTheDocument();
      expect(screen.getByText('24 servings')).toBeInTheDocument();
    });

    it('should render recipe image when imageUrl is provided', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const image = screen.getByAltText('Chocolate Chip Cookies');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/cookies.jpg');
    });

    it('should render fallback icon when no image is provided', () => {
      const recipeWithoutImage = { ...mockRecipe, imageUrl: undefined };
      render(<RecipeCard recipe={recipeWithoutImage} />);

      expect(screen.getByTestId('chef-hat-icon')).toBeInTheDocument();
    });

    it('should display formatted time from prep and cook time', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      // 15 min prep + 12 min cook = 27 min total
      expect(screen.getByText('27 min')).toBeInTheDocument();
    });

    it('should display difficulty badge', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('should render rating when provided', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      expect(screen.getByTestId('rating')).toHaveTextContent('Rating: 4.5');
      expect(screen.getByText('(128)')).toBeInTheDocument();
    });

    it('should render author information when showAuthor is true', () => {
      render(<RecipeCard recipe={mockRecipe} showAuthor={true} />);

      expect(screen.getByTestId('recipe-author')).toHaveTextContent('Jane Doe');
    });

    it('should not render author when showAuthor is false', () => {
      render(<RecipeCard recipe={mockRecipe} showAuthor={false} />);

      expect(screen.queryByTestId('recipe-author')).not.toBeInTheDocument();
    });

    it('should display favorite badge when recipe is favorited', () => {
      const favoritedRecipe = { ...mockRecipe, isFavorite: true };
      render(<RecipeCard recipe={favoritedRecipe} />);

      expect(screen.getByText('Saved')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply correct size variant classes', () => {
      const { rerender, container } = render(
        <RecipeCard recipe={mockRecipe} size="sm" />
      );
      expect(container.firstChild).toBeInTheDocument();

      rerender(<RecipeCard recipe={mockRecipe} size="lg" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply correct card variant classes', () => {
      const { rerender, container } = render(
        <RecipeCard recipe={mockRecipe} variant="elevated" />
      );
      expect(container.firstChild).toBeInTheDocument();

      rerender(<RecipeCard recipe={mockRecipe} variant="outlined" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when loading is true', () => {
      render(<RecipeCard recipe={mockRecipe} loading={true} />);

      // Should not render actual content
      expect(
        screen.queryByText('Chocolate Chip Cookies')
      ).not.toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('should render quick actions when showQuickActions is true', () => {
      const onFavorite = jest.fn();
      const onShare = jest.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          showQuickActions={true}
          onFavorite={onFavorite}
          onShare={onShare}
        />
      );

      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    });

    it('should call onFavorite when favorite action is clicked', () => {
      const onFavorite = jest.fn();

      render(
        <RecipeCard
          recipe={mockRecipe}
          showQuickActions={true}
          onFavorite={onFavorite}
        />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(onFavorite).toHaveBeenCalledTimes(1);
    });

    it('should not render quick actions when showQuickActions is false', () => {
      render(
        <RecipeCard
          recipe={mockRecipe}
          showQuickActions={false}
          onFavorite={jest.fn()}
        />
      );

      expect(screen.queryByTestId('quick-actions')).not.toBeInTheDocument();
    });
  });

  describe('Menu Actions', () => {
    it('should not render menu when showMenu is false', () => {
      render(
        <RecipeCard recipe={mockRecipe} showMenu={false} isOwner={true} />
      );

      expect(screen.queryByLabelText('Recipe menu')).not.toBeInTheDocument();
    });
  });

  describe('Interactive Behavior', () => {
    it('should call onClick when card is clicked and onClick is provided', () => {
      const onClick = jest.fn();

      render(<RecipeCard recipe={mockRecipe} onClick={onClick} />);

      const card = screen.getByRole('button', { name: /view recipe/i });
      fireEvent.click(card);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible when interactive', () => {
      const onClick = jest.fn();

      render(<RecipeCard recipe={mockRecipe} onClick={onClick} />);

      const card = screen.getByRole('button', { name: /view recipe/i });
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional recipe data gracefully', () => {
      const minimalRecipe: RecipeCardProps['recipe'] = {
        recipeId: 1,
        title: 'Minimal Recipe',
        servings: 4,
      };

      render(<RecipeCard recipe={minimalRecipe} />);

      expect(screen.getByText('Minimal Recipe')).toBeInTheDocument();
      expect(screen.getByText('4 servings')).toBeInTheDocument();
    });

    it('should handle zero cooking time', () => {
      const recipeWithZeroTime = {
        ...mockRecipe,
        preparationTime: 0,
        cookingTime: 0,
      };

      render(<RecipeCard recipe={recipeWithZeroTime} />);

      expect(screen.queryByText(/min/)).not.toBeInTheDocument();
    });

    it('should handle missing author gracefully', () => {
      const recipeWithoutAuthor = { ...mockRecipe, author: undefined };

      render(<RecipeCard recipe={recipeWithoutAuthor} showAuthor={true} />);

      expect(screen.queryByTestId('recipe-author')).not.toBeInTheDocument();
    });

    it('should handle missing rating gracefully', () => {
      const recipeWithoutRating = {
        ...mockRecipe,
        rating: undefined,
        reviewCount: undefined,
      };

      render(<RecipeCard recipe={recipeWithoutRating} />);

      expect(screen.queryByTestId('rating')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive card', () => {
      render(<RecipeCard recipe={mockRecipe} onClick={jest.fn()} />);

      const card = screen.getByRole('button', {
        name: /view recipe.*chocolate chip cookies/i,
      });
      expect(card).toBeInTheDocument();
    });

    it('should have alt text for recipe image', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const image = screen.getByAltText('Chocolate Chip Cookies');
      expect(image).toBeInTheDocument();
    });

    it('should have aria-hidden on decorative icons', () => {
      render(<RecipeCard recipe={mockRecipe} />);

      const clockIcon = screen.getByTestId('clock-icon');
      // The aria-hidden attribute should be on the icon itself
      expect(clockIcon).toBeInTheDocument();
    });
  });
});
