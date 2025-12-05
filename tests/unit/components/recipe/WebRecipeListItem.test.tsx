import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  WebRecipeListItem,
  WebRecipeListItemSkeleton,
} from '@/components/recipe/WebRecipeListItem';
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
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <>{children}</>,
}));

describe('WebRecipeListItem', () => {
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
      render(<WebRecipeListItem recipe={mockRecipe} />);

      expect(
        screen.getByText('Best Chocolate Chip Cookies')
      ).toBeInTheDocument();
    });

    it('should render source domain badge', () => {
      render(<WebRecipeListItem recipe={mockRecipe} />);

      expect(screen.getByText('allrecipes.com')).toBeInTheDocument();
    });

    it('should render external link icon', () => {
      render(<WebRecipeListItem recipe={mockRecipe} />);

      expect(
        screen.getAllByTestId('external-link-icon').length
      ).toBeGreaterThan(0);
    });

    it('should render globe icon in source badge', () => {
      render(<WebRecipeListItem recipe={mockRecipe} />);

      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    });

    it('should render Open button when showQuickActions is true', () => {
      render(<WebRecipeListItem recipe={mockRecipe} showQuickActions />);

      expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
    });

    it('should render copy link button when showQuickActions is true', () => {
      render(<WebRecipeListItem recipe={mockRecipe} showQuickActions />);

      expect(
        screen.getByRole('button', { name: /copy link/i })
      ).toBeInTheDocument();
    });

    it('should not render action buttons when showQuickActions is false', () => {
      render(
        <WebRecipeListItem recipe={mockRecipe} showQuickActions={false} />
      );

      expect(
        screen.queryByRole('button', { name: /open/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /copy link/i })
      ).not.toBeInTheDocument();
    });

    it('should render import button when onImport handler is provided', () => {
      render(
        <WebRecipeListItem
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
      render(<WebRecipeListItem recipe={mockRecipe} showQuickActions />);

      expect(
        screen.queryByRole('button', { name: /import recipe/i })
      ).not.toBeInTheDocument();
    });

    it('should show full recipe name on title attribute', () => {
      const longNameRecipe = {
        ...mockRecipe,
        recipeName: 'This is a very long recipe name that should be truncated',
      };
      render(<WebRecipeListItem recipe={longNameRecipe} />);

      const title = screen.getByText(longNameRecipe.recipeName);
      expect(title).toHaveAttribute('title', longNameRecipe.recipeName);
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when loading is true', () => {
      render(<WebRecipeListItem recipe={mockRecipe} loading />);

      expect(
        screen.queryByText('Best Chocolate Chip Cookies')
      ).not.toBeInTheDocument();
    });

    it('should render WebRecipeListItemSkeleton component', () => {
      render(<WebRecipeListItemSkeleton />);

      // Skeleton should not show recipe content
      expect(
        screen.queryByText('Best Chocolate Chip Cookies')
      ).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onOpenExternal when Open button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeListItem
          recipe={mockRecipe}
          showQuickActions
          onOpenExternal={mockHandlers.onOpenExternal}
        />
      );

      const openButton = screen.getByRole('button', { name: /open/i });
      await user.click(openButton);

      expect(mockHandlers.onOpenExternal).toHaveBeenCalledTimes(1);
    });

    it('should call onCopyLink when copy button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeListItem
          recipe={mockRecipe}
          showQuickActions
          onCopyLink={mockHandlers.onCopyLink}
        />
      );

      const copyButton = screen.getByRole('button', { name: /copy link/i });
      await user.click(copyButton);

      expect(mockHandlers.onCopyLink).toHaveBeenCalledTimes(1);
    });

    it('should call onImport when import button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeListItem
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

    it('should call onClick when list item is clicked and onClick handler is provided', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeListItem
          recipe={mockRecipe}
          onClick={mockHandlers.onClick}
          showQuickActions={false}
        />
      );

      // Find the list item by its accessible label
      const listItem = screen.getByRole('listitem');
      await user.click(listItem);

      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it('should open URL in new tab when onOpenExternal is not provided', async () => {
      const windowOpenSpy = jest
        .spyOn(window, 'open')
        .mockImplementation(() => null);
      const user = userEvent.setup();

      render(<WebRecipeListItem recipe={mockRecipe} showQuickActions />);

      const openButton = screen.getByRole('button', { name: /open/i });
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
      render(<WebRecipeListItem recipe={mockRecipe} showQuickActions />);

      const copyButton = screen.getByRole('button', { name: /copy link/i });

      // Click should not throw even without clipboard API
      await expect(user.click(copyButton)).resolves.not.toThrow();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      const { container } = render(<WebRecipeListItem recipe={mockRecipe} />);

      const listItem = container.querySelector('li');
      expect(listItem).toHaveClass('border-dashed');
    });

    it('should apply compact variant styles', () => {
      const { container } = render(
        <WebRecipeListItem recipe={mockRecipe} variant="compact" />
      );

      const listItem = container.querySelector('li');
      expect(listItem).toHaveClass('p-2');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label when interactive', () => {
      render(
        <WebRecipeListItem
          recipe={mockRecipe}
          onClick={mockHandlers.onClick}
          showQuickActions={false}
        />
      );

      const listItem = screen.getByRole('listitem');
      expect(listItem).toHaveAttribute(
        'aria-label',
        'View external recipe: Best Chocolate Chip Cookies'
      );
    });

    it('should have proper aria-label on copy button', () => {
      render(<WebRecipeListItem recipe={mockRecipe} showQuickActions />);

      expect(
        screen.getByRole('button', { name: /copy link/i })
      ).toBeInTheDocument();
    });

    it('should have proper aria-label on import button', () => {
      render(
        <WebRecipeListItem
          recipe={mockRecipe}
          showQuickActions
          onImport={mockHandlers.onImport}
        />
      );

      expect(
        screen.getByRole('button', { name: /import recipe/i })
      ).toBeInTheDocument();
    });

    it('should be keyboard navigable when interactive', () => {
      render(
        <WebRecipeListItem
          recipe={mockRecipe}
          onClick={mockHandlers.onClick}
          showQuickActions={false}
        />
      );

      const listItem = screen.getByRole('listitem');
      expect(listItem).toHaveAttribute('tabIndex', '0');
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
      ];

      recipes.forEach(recipe => {
        const { unmount } = render(<WebRecipeListItem recipe={recipe} />);
        expect(screen.getByText(recipe.sourceDomain)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
