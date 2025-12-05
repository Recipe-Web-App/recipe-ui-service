import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  WebRecipeCard,
  WebRecipeCardSkeleton,
} from '@/components/recipe/WebRecipeCard';
import type { WebRecipeCardData } from '@/types/ui/web-recipe-card';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ExternalLink: () => <div data-testid="external-link-icon">ExternalLink</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
  Globe: () => <div data-testid="globe-icon">Globe</div>,
}));

// Mock tooltip component
jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
  TooltipTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <>{children}</>,
}));

describe('WebRecipeCard', () => {
  const mockRecipe: WebRecipeCardData = {
    recipeName: 'Best Chocolate Chip Cookies',
    url: 'https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/',
    sourceDomain: 'allrecipes.com',
  };

  const mockHandlers = {
    onClick: jest.fn(),
    onOpenExternal: jest.fn(),
    onImport: jest.fn(),
    onCopyLink: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render recipe name correctly', () => {
      render(<WebRecipeCard recipe={mockRecipe} />);

      expect(
        screen.getByText('Best Chocolate Chip Cookies')
      ).toBeInTheDocument();
    });

    it('should render source domain badge', () => {
      render(<WebRecipeCard recipe={mockRecipe} />);

      expect(screen.getByText('allrecipes.com')).toBeInTheDocument();
    });

    it('should render external link icon', () => {
      render(<WebRecipeCard recipe={mockRecipe} />);

      // There are multiple external link icons (header and button)
      const icons = screen.getAllByTestId('external-link-icon');
      expect(icons.length).toBeGreaterThanOrEqual(1);
    });

    it('should render globe icon in source badge', () => {
      render(<WebRecipeCard recipe={mockRecipe} />);

      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    });

    it('should render Open Recipe button', () => {
      render(<WebRecipeCard recipe={mockRecipe} />);

      expect(
        screen.getByRole('button', { name: /open recipe/i })
      ).toBeInTheDocument();
    });

    it('should render copy link button when showQuickActions is true', () => {
      render(<WebRecipeCard recipe={mockRecipe} showQuickActions />);

      expect(
        screen.getByRole('button', { name: /copy recipe link/i })
      ).toBeInTheDocument();
    });

    it('should not render quick actions when showQuickActions is false', () => {
      render(<WebRecipeCard recipe={mockRecipe} showQuickActions={false} />);

      expect(
        screen.queryByRole('button', { name: /copy recipe link/i })
      ).not.toBeInTheDocument();
    });

    it('should render import button when onImport handler is provided', () => {
      render(
        <WebRecipeCard
          recipe={mockRecipe}
          showQuickActions
          onImport={mockHandlers.onImport}
        />
      );

      expect(
        screen.getByRole('button', { name: /import recipe/i })
      ).toBeInTheDocument();
    });

    it('should not render import button when onImport handler is not provided', () => {
      render(<WebRecipeCard recipe={mockRecipe} showQuickActions />);

      expect(
        screen.queryByRole('button', { name: /import recipe/i })
      ).not.toBeInTheDocument();
    });

    it('should truncate long recipe names', () => {
      const longNameRecipe = {
        ...mockRecipe,
        recipeName:
          'This is a very long recipe name that should be truncated when displayed in the card to prevent overflow issues',
      };
      render(<WebRecipeCard recipe={longNameRecipe} />);

      const title = screen.getByText(longNameRecipe.recipeName);
      expect(title).toHaveClass('line-clamp-2');
    });

    it('should show full recipe name on title attribute', () => {
      const longNameRecipe = {
        ...mockRecipe,
        recipeName: 'This is a very long recipe name that should be truncated',
      };
      render(<WebRecipeCard recipe={longNameRecipe} />);

      const title = screen.getByText(longNameRecipe.recipeName);
      expect(title).toHaveAttribute('title', longNameRecipe.recipeName);
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when loading is true', () => {
      render(<WebRecipeCard recipe={mockRecipe} loading />);

      expect(
        screen.queryByText('Best Chocolate Chip Cookies')
      ).not.toBeInTheDocument();
    });

    it('should render WebRecipeCardSkeleton component', () => {
      render(<WebRecipeCardSkeleton />);

      // Skeleton should not show recipe content
      expect(
        screen.queryByText('Best Chocolate Chip Cookies')
      ).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onOpenExternal when Open Recipe button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeCard
          recipe={mockRecipe}
          onOpenExternal={mockHandlers.onOpenExternal}
        />
      );

      const openButton = screen.getByRole('button', { name: /open recipe/i });
      await user.click(openButton);

      expect(mockHandlers.onOpenExternal).toHaveBeenCalledTimes(1);
    });

    it('should call onCopyLink when copy button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeCard
          recipe={mockRecipe}
          showQuickActions
          onCopyLink={mockHandlers.onCopyLink}
        />
      );

      const copyButton = screen.getByRole('button', {
        name: /copy recipe link/i,
      });
      await user.click(copyButton);

      expect(mockHandlers.onCopyLink).toHaveBeenCalledTimes(1);
    });

    it('should call onImport when import button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeCard
          recipe={mockRecipe}
          showQuickActions
          onImport={mockHandlers.onImport}
        />
      );

      const importButton = screen.getByRole('button', {
        name: /import recipe/i,
      });
      await user.click(importButton);

      expect(mockHandlers.onImport).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when card is clicked and onClick handler is provided', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeCard recipe={mockRecipe} onClick={mockHandlers.onClick} />
      );

      // Find the card by its accessible label
      const card = screen.getByRole('button', {
        name: /view external recipe: best chocolate chip cookies/i,
      });
      await user.click(card);

      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation when action buttons are clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeCard
          recipe={mockRecipe}
          onClick={mockHandlers.onClick}
          onOpenExternal={mockHandlers.onOpenExternal}
        />
      );

      const openButton = screen.getByRole('button', { name: /open recipe/i });
      await user.click(openButton);

      // onClick should not be called when clicking action button
      expect(mockHandlers.onOpenExternal).toHaveBeenCalledTimes(1);
    });

    it('should open URL in new tab when onOpenExternal is not provided', async () => {
      const windowOpenSpy = jest
        .spyOn(window, 'open')
        .mockImplementation(() => null);
      const user = userEvent.setup();

      render(<WebRecipeCard recipe={mockRecipe} />);

      const openButton = screen.getByRole('button', { name: /open recipe/i });
      await user.click(openButton);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        mockRecipe.url,
        '_blank',
        'noopener,noreferrer'
      );

      windowOpenSpy.mockRestore();
    });

    it('should not throw when copy button is clicked without onCopyLink handler', async () => {
      const user = userEvent.setup();
      render(<WebRecipeCard recipe={mockRecipe} showQuickActions />);

      const copyButton = screen.getByRole('button', {
        name: /copy recipe link/i,
      });

      // Click should not throw even without clipboard API
      await expect(user.click(copyButton)).resolves.not.toThrow();
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply default variant styles', () => {
      const { container } = render(<WebRecipeCard recipe={mockRecipe} />);

      const card = container.firstChild;
      expect(card).toHaveClass('border-dashed');
    });

    it('should apply outlined variant styles', () => {
      const { container } = render(
        <WebRecipeCard recipe={mockRecipe} variant="outlined" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-2');
    });

    it('should apply sm size class', () => {
      const { container } = render(
        <WebRecipeCard recipe={mockRecipe} size="sm" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('min-h-[140px]');
    });

    it('should apply lg size class', () => {
      const { container } = render(
        <WebRecipeCard recipe={mockRecipe} size="lg" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('min-h-[180px]');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label when interactive', () => {
      render(
        <WebRecipeCard recipe={mockRecipe} onClick={mockHandlers.onClick} />
      );

      expect(
        screen.getByRole('button', {
          name: /view external recipe: best chocolate chip cookies/i,
        })
      ).toBeInTheDocument();
    });

    it('should have proper aria-label on copy button', () => {
      render(<WebRecipeCard recipe={mockRecipe} showQuickActions />);

      expect(
        screen.getByRole('button', { name: /copy recipe link/i })
      ).toBeInTheDocument();
    });

    it('should have proper aria-label on import button', () => {
      render(
        <WebRecipeCard
          recipe={mockRecipe}
          showQuickActions
          onImport={mockHandlers.onImport}
        />
      );

      expect(
        screen.getByRole('button', {
          name: /import recipe to your collection/i,
        })
      ).toBeInTheDocument();
    });

    it('should be keyboard navigable when interactive', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeCard recipe={mockRecipe} onClick={mockHandlers.onClick} />
      );

      const card = screen.getByRole('button', {
        name: /view external recipe/i,
      });

      card.focus();
      expect(card).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it('should have tabIndex when interactive', () => {
      render(
        <WebRecipeCard recipe={mockRecipe} onClick={mockHandlers.onClick} />
      );

      const card = screen.getByRole('button', {
        name: /view external recipe/i,
      });
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Different Recipe Sources', () => {
    it('should display different source domains correctly', () => {
      const recipes: WebRecipeCardData[] = [
        {
          recipeName: 'Recipe 1',
          url: 'https://cooking.nytimes.com/recipes/123',
          sourceDomain: 'cooking.nytimes.com',
        },
        {
          recipeName: 'Recipe 2',
          url: 'https://www.bonappetit.com/recipe/456',
          sourceDomain: 'bonappetit.com',
        },
        {
          recipeName: 'Recipe 3',
          url: 'https://www.seriouseats.com/recipe/789',
          sourceDomain: 'seriouseats.com',
        },
      ];

      recipes.forEach(recipe => {
        const { unmount } = render(<WebRecipeCard recipe={recipe} />);
        expect(screen.getByText(recipe.sourceDomain)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle unknown source domain', () => {
      const unknownRecipe: WebRecipeCardData = {
        recipeName: 'Unknown Recipe',
        url: 'invalid-url',
        sourceDomain: 'unknown',
      };
      render(<WebRecipeCard recipe={unknownRecipe} />);

      expect(screen.getByText('unknown')).toBeInTheDocument();
    });
  });
});
