import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  RecipeBreadcrumb,
} from '@/components/ui/breadcrumb';
import type {
  BreadcrumbItem as BreadcrumbItemType,
  RecipeWorkflowItem,
} from '@/types/ui/breadcrumb';

expect.extend(toHaveNoViolations);

describe('Breadcrumb Component', () => {
  const mockOnClick = jest.fn();
  const mockOnStepClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders breadcrumb navigation correctly', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Breadcrumb navigation'
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('applies correct size classes', () => {
      const { rerender } = render(
        <Breadcrumb size="sm" data-testid="breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByTestId('breadcrumb')).toHaveClass('text-xs');

      rerender(
        <Breadcrumb size="lg" data-testid="breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByTestId('breadcrumb')).toHaveClass('text-base');
    });

    it('auto-generates breadcrumb from items prop', () => {
      const items: BreadcrumbItemType[] = [
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Carbonara' }, // Last item has no href (current page)
      ];

      render(<Breadcrumb items={items} showHome={false} />);

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Recipes' })).toBeInTheDocument();
      expect(screen.getByText('Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Carbonara')).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('shows home icon when showHome is true', () => {
      const items: BreadcrumbItemType[] = [
        { label: 'Recipes', href: '/recipes' },
        { label: 'Pasta' },
      ];

      render(<Breadcrumb items={items} showHome={true} />);

      // Home icon should be present - get by href attribute to be specific
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveAttribute('href', '/');
      expect(homeLink.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('BreadcrumbLink Component', () => {
    it('renders link with correct attributes', () => {
      render(
        <BreadcrumbLink href="/recipes" variant="default">
          Recipes
        </BreadcrumbLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/recipes');
      expect(link).toHaveTextContent('Recipes');
    });

    it('applies variant classes correctly', () => {
      const { rerender } = render(
        <BreadcrumbLink href="/test" variant="default" data-testid="link">
          Test
        </BreadcrumbLink>
      );

      expect(screen.getByTestId('link')).toHaveClass('hover:text-foreground');

      rerender(
        <BreadcrumbLink href="/test" variant="solid" data-testid="link">
          Test
        </BreadcrumbLink>
      );

      expect(screen.getByTestId('link')).toHaveClass(
        'font-medium',
        'hover:bg-muted'
      );

      rerender(
        <BreadcrumbLink href="/test" variant="ghost" data-testid="link">
          Test
        </BreadcrumbLink>
      );

      expect(screen.getByTestId('link')).toHaveClass('hover:bg-muted');

      rerender(
        <BreadcrumbLink href="/test" variant="minimal" data-testid="link">
          Test
        </BreadcrumbLink>
      );

      expect(screen.getByTestId('link')).toHaveClass('hover:no-underline');
    });

    it('handles asChild prop correctly', () => {
      render(
        <BreadcrumbLink asChild href="/test">
          <button>Custom Button</button>
        </BreadcrumbLink>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });
  });

  describe('BreadcrumbPage Component', () => {
    it('renders current page correctly', () => {
      render(<BreadcrumbPage>Current Page</BreadcrumbPage>);

      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('role', 'link');
      expect(page).toHaveAttribute('aria-disabled', 'true');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('applies variant classes correctly', () => {
      const { rerender } = render(
        <BreadcrumbPage variant="default" data-testid="page">
          Test
        </BreadcrumbPage>
      );

      expect(screen.getByTestId('page')).toHaveClass('text-foreground');

      rerender(
        <BreadcrumbPage variant="emphasized" data-testid="page">
          Test
        </BreadcrumbPage>
      );

      expect(screen.getByTestId('page')).toHaveClass('font-medium');

      rerender(
        <BreadcrumbPage variant="subtle" data-testid="page">
          Test
        </BreadcrumbPage>
      );

      expect(screen.getByTestId('page')).toHaveClass('text-muted-foreground');
    });
  });

  describe('BreadcrumbSeparator Component', () => {
    it('renders default chevron separator', () => {
      const { container } = render(<BreadcrumbSeparator />);

      expect(container.querySelector('svg')).toBeInTheDocument();
      const listItem = container.querySelector('li');
      expect(listItem).toHaveAttribute('role', 'presentation');
      expect(listItem).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders different separator variants', () => {
      const { rerender, container } = render(
        <BreadcrumbSeparator variant="chevron" />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<BreadcrumbSeparator variant="slash" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<BreadcrumbSeparator variant="arrow" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<BreadcrumbSeparator variant="dot" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders custom separator content', () => {
      render(
        <BreadcrumbSeparator>
          <span data-testid="custom-separator">|</span>
        </BreadcrumbSeparator>
      );

      expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
      expect(screen.getByText('|')).toBeInTheDocument();
    });
  });

  describe('BreadcrumbEllipsis Component', () => {
    it('renders ellipsis button correctly', () => {
      render(<BreadcrumbEllipsis onExpand={mockOnClick} />);

      const ellipsis = screen.getByRole('button');
      expect(ellipsis).toHaveAttribute('aria-label', 'Show more breadcrumbs');
      expect(ellipsis).toHaveAttribute('tabindex', '0');
      expect(screen.getByText('More')).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      render(<BreadcrumbEllipsis onExpand={mockOnClick} />);

      const ellipsis = screen.getByRole('button');
      await user.click(ellipsis);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events', () => {
      render(<BreadcrumbEllipsis onExpand={mockOnClick} />);

      const ellipsis = screen.getByRole('button');

      fireEvent.keyDown(ellipsis, { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(ellipsis, { key: ' ' });
      expect(mockOnClick).toHaveBeenCalledTimes(2);

      fireEvent.keyDown(ellipsis, { key: 'Tab' });
      expect(mockOnClick).toHaveBeenCalledTimes(2); // Should not trigger
    });
  });

  describe('Overflow Handling', () => {
    it('collapses items when maxItems is exceeded', () => {
      const items: BreadcrumbItemType[] = [
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Italian', href: '/recipes/italian' },
        { label: 'Pasta', href: '/recipes/pasta' },
        { label: 'Carbonara' },
      ];

      render(<Breadcrumb items={items} maxItems={3} showHome={false} />);

      // Should show first item, ellipsis, and last two items
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Show.*hidden items/ })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Pasta' })).toBeInTheDocument();
      expect(screen.getByText('Carbonara')).toBeInTheDocument();

      // Hidden items should not be visible
      expect(
        screen.queryByRole('link', { name: 'Recipes' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Italian' })
      ).not.toBeInTheDocument();
    });

    it('expands collapsed items when ellipsis is clicked', async () => {
      const user = userEvent.setup();
      const items: BreadcrumbItemType[] = [
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Italian', href: '/recipes/italian' },
        { label: 'Pasta', href: '/recipes/pasta' },
        { label: 'Carbonara' },
      ];

      render(<Breadcrumb items={items} maxItems={3} showHome={false} />);

      const ellipsis = screen.getByRole('button', {
        name: /Show.*hidden items/,
      });
      await user.click(ellipsis);

      // All items should now be visible
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Recipes' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Italian' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Pasta' })).toBeInTheDocument();
      expect(screen.getByText('Carbonara')).toBeInTheDocument();
    });
  });

  describe('RecipeBreadcrumb Component', () => {
    const workflowItems: RecipeWorkflowItem[] = [
      {
        id: 'planning',
        label: 'Planning',
        icon: 'clipboard-list',
        completed: true,
        accessible: true,
      },
      {
        id: 'shopping',
        label: 'Shopping',
        icon: 'shopping-cart',
        completed: false,
        active: true,
        accessible: true,
      },
      {
        id: 'cooking',
        label: 'Cooking',
        icon: 'chef-hat',
        accessible: false,
      },
    ];

    it('renders recipe workflow correctly', () => {
      render(
        <RecipeBreadcrumb
          workflow="cooking"
          items={workflowItems}
          currentStep="shopping"
          onStepClick={mockOnStepClick}
        />
      );

      expect(screen.getByText('Planning')).toBeInTheDocument();
      expect(screen.getByText('Shopping')).toBeInTheDocument();
      expect(screen.getByText('Cooking')).toBeInTheDocument();
    });

    it('applies workflow styling correctly', () => {
      const { rerender, container } = render(
        <RecipeBreadcrumb workflow="planning" items={workflowItems} />
      );

      expect(container.firstChild).toHaveClass('border-blue-200', 'bg-blue-50');

      rerender(<RecipeBreadcrumb workflow="shopping" items={workflowItems} />);
      expect(container.firstChild).toHaveClass(
        'border-green-200',
        'bg-green-50'
      );

      rerender(<RecipeBreadcrumb workflow="cooking" items={workflowItems} />);
      expect(container.firstChild).toHaveClass(
        'border-orange-200',
        'bg-orange-50'
      );

      rerender(<RecipeBreadcrumb workflow="serving" items={workflowItems} />);
      expect(container.firstChild).toHaveClass(
        'border-purple-200',
        'bg-purple-50'
      );
    });

    it('handles step click events', async () => {
      const user = userEvent.setup();
      render(
        <RecipeBreadcrumb
          workflow="cooking"
          items={workflowItems}
          onStepClick={mockOnStepClick}
        />
      );

      // Click on accessible items
      await user.click(screen.getByText('Planning'));
      expect(mockOnStepClick).toHaveBeenCalledWith('planning');

      await user.click(screen.getByText('Shopping'));
      expect(mockOnStepClick).toHaveBeenCalledWith('shopping');

      // Non-accessible item should not trigger click
      const cookingStep = screen.getByText('Cooking');
      await user.click(cookingStep);
      expect(mockOnStepClick).toHaveBeenCalledTimes(2); // Should still be 2
    });

    it('shows completion indicators', () => {
      render(
        <RecipeBreadcrumb
          workflow="cooking"
          items={workflowItems}
          onStepClick={mockOnStepClick}
        />
      );

      // Planning step should show completion check
      const planningStep = screen.getByText('Planning').closest('div');
      expect(planningStep?.querySelector('svg')).toBeInTheDocument(); // Check icon
    });

    it('applies emphasis variants', () => {
      const { rerender, container } = render(
        <RecipeBreadcrumb
          workflow="cooking"
          items={workflowItems}
          emphasis="subtle"
        />
      );

      expect(container.firstChild).toHaveClass('opacity-70');

      rerender(
        <RecipeBreadcrumb
          workflow="cooking"
          items={workflowItems}
          emphasis="strong"
        />
      );

      expect(container.firstChild).toHaveClass('font-medium', 'shadow-sm');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation');

      const currentPage = screen.getByText('Current');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(currentPage).toHaveAttribute('aria-disabled', 'true');
    });

    it('supports keyboard navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('focus-visible:ring-2');
      });
    });

    it('passes accessibility tests', async () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles screen reader text correctly', () => {
      render(<BreadcrumbEllipsis onExpand={mockOnClick} />);

      expect(screen.getByText('More')).toHaveClass('sr-only');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(<Breadcrumb items={[]} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav.textContent).toBe('');
    });

    it('handles single item', () => {
      const items: BreadcrumbItemType[] = [{ label: 'Home' }];

      render(<Breadcrumb items={items} showHome={false} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
    });

    it('handles items without href as current page', () => {
      const items: BreadcrumbItemType[] = [
        { label: 'Home', href: '/' },
        { label: 'Current Page' }, // No href
      ];

      render(<Breadcrumb items={items} showHome={false} />);

      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(currentPage).not.toHaveAttribute('href');
    });

    it('handles custom className prop', () => {
      render(
        <Breadcrumb className="custom-breadcrumb" data-testid="breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByTestId('breadcrumb')).toHaveClass('custom-breadcrumb');
    });

    it('handles disabled items correctly', () => {
      const items: BreadcrumbItemType[] = [
        { label: 'Home', href: '/' },
        { label: 'Disabled', href: '/disabled', disabled: true },
        { label: 'Current' },
      ];

      render(<Breadcrumb items={items} showHome={false} />);

      const disabledLink = screen.getByRole('link', { name: 'Disabled' });
      expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      const TestBreadcrumb = React.memo(() => {
        renderSpy();
        return (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        );
      });

      const { rerender } = render(<TestBreadcrumb />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props should not trigger re-render
      rerender(<TestBreadcrumb />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
});
