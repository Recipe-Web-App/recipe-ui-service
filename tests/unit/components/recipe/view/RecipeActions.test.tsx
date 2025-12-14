import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeActions } from '@/components/recipe/view/RecipeActions';

describe('RecipeActions', () => {
  describe('Rendering', () => {
    it('should render all action buttons', () => {
      render(<RecipeActions />);

      expect(screen.getByTestId('recipe-actions')).toBeInTheDocument();
      expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
      expect(screen.getByTestId('share-button')).toBeInTheDocument();
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<RecipeActions className="custom-class" />);

      const actions = screen.getByTestId('recipe-actions');
      expect(actions).toHaveClass('custom-class');
    });

    it('should forward ref to container', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RecipeActions ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Favorite Button', () => {
    it('should display "Add to favorites" aria-label when not favorited', () => {
      render(<RecipeActions isFavorited={false} />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      expect(favoriteBtn).toHaveAttribute('aria-label', 'Add to favorites');
    });

    it('should display "Remove from favorites" aria-label when favorited', () => {
      render(<RecipeActions isFavorited={true} />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      expect(favoriteBtn).toHaveAttribute(
        'aria-label',
        'Remove from favorites'
      );
    });

    it('should call onToggleFavorite when clicked', async () => {
      const user = userEvent.setup();
      const handleToggle = jest.fn();

      render(<RecipeActions onToggleFavorite={handleToggle} />);

      await user.click(screen.getByTestId('favorite-button'));
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when loading', () => {
      render(<RecipeActions isFavoriteLoading={true} />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      expect(favoriteBtn).toBeDisabled();
    });

    it('should not be disabled when not loading', () => {
      render(<RecipeActions isFavoriteLoading={false} />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      expect(favoriteBtn).not.toBeDisabled();
    });

    it('should have red fill when favorited', () => {
      render(<RecipeActions isFavorited={true} />);

      const heartIcon = screen
        .getByTestId('favorite-button')
        .querySelector('svg');
      expect(heartIcon).toHaveClass('fill-red-500', 'text-red-500');
    });

    it('should not have red fill when not favorited', () => {
      render(<RecipeActions isFavorited={false} />);

      const heartIcon = screen
        .getByTestId('favorite-button')
        .querySelector('svg');
      expect(heartIcon).not.toHaveClass('fill-red-500');
    });
  });

  describe('Share Button', () => {
    it('should have correct aria-label', () => {
      render(<RecipeActions />);

      const shareBtn = screen.getByTestId('share-button');
      expect(shareBtn).toHaveAttribute('aria-label', 'Share recipe');
    });

    it('should call onShare when clicked', async () => {
      const user = userEvent.setup();
      const handleShare = jest.fn();

      render(<RecipeActions onShare={handleShare} />);

      await user.click(screen.getByTestId('share-button'));
      expect(handleShare).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when undefined', async () => {
      const user = userEvent.setup();

      render(<RecipeActions />);

      // Should not throw when clicking without handler
      await user.click(screen.getByTestId('share-button'));
    });
  });

  describe('Bookmark Button', () => {
    it('should have correct aria-label', () => {
      render(<RecipeActions />);

      const bookmarkBtn = screen.getByTestId('bookmark-button');
      expect(bookmarkBtn).toHaveAttribute('aria-label', 'Save to collection');
    });

    it('should call onBookmark when clicked', async () => {
      const user = userEvent.setup();
      const handleBookmark = jest.fn();

      render(<RecipeActions onBookmark={handleBookmark} />);

      await user.click(screen.getByTestId('bookmark-button'));
      expect(handleBookmark).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when undefined', async () => {
      const user = userEvent.setup();

      render(<RecipeActions />);

      // Should not throw when clicking without handler
      await user.click(screen.getByTestId('bookmark-button'));
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on all icons', () => {
      render(
        <RecipeActions
          isFavorited={false}
          onToggleFavorite={jest.fn()}
          onShare={jest.fn()}
          onBookmark={jest.fn()}
        />
      );

      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBe(3); // Heart, Share2, SquarePlus
    });

    it('should have unique aria-labels for all buttons', () => {
      render(<RecipeActions />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      const shareBtn = screen.getByTestId('share-button');
      const bookmarkBtn = screen.getByTestId('bookmark-button');

      expect(favoriteBtn).toHaveAttribute('aria-label');
      expect(shareBtn).toHaveAttribute('aria-label');
      expect(bookmarkBtn).toHaveAttribute('aria-label');

      // All should be different
      const labels = [
        favoriteBtn.getAttribute('aria-label'),
        shareBtn.getAttribute('aria-label'),
        bookmarkBtn.getAttribute('aria-label'),
      ];
      expect(new Set(labels).size).toBe(3);
    });
  });

  describe('Styling', () => {
    it('should have flex layout with gap', () => {
      render(<RecipeActions />);

      const container = screen.getByTestId('recipe-actions');
      expect(container).toHaveClass('flex', 'gap-2');
    });

    it('should use outline variant for all buttons', () => {
      const { container } = render(<RecipeActions />);

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);
    });
  });

  describe('Default Props', () => {
    it('should default isFavorited to false', () => {
      render(<RecipeActions />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      expect(favoriteBtn).toHaveAttribute('aria-label', 'Add to favorites');
    });

    it('should default isFavoriteLoading to false', () => {
      render(<RecipeActions />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      expect(favoriteBtn).not.toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      const handleToggle = jest.fn();

      render(<RecipeActions onToggleFavorite={handleToggle} />);

      const favoriteBtn = screen.getByTestId('favorite-button');
      await user.click(favoriteBtn);
      await user.click(favoriteBtn);
      await user.click(favoriteBtn);

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it('should not call onToggleFavorite when disabled', async () => {
      const user = userEvent.setup();
      const handleToggle = jest.fn();

      render(
        <RecipeActions
          isFavoriteLoading={true}
          onToggleFavorite={handleToggle}
        />
      );

      const favoriteBtn = screen.getByTestId('favorite-button');
      await user.click(favoriteBtn);

      expect(handleToggle).not.toHaveBeenCalled();
    });
  });
});
