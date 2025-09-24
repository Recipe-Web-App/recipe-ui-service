import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Badge, type BadgeProps } from '@/components/ui/badge';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Badge with default props
 */
const renderBadge = (props: Partial<BadgeProps> = {}) => {
  const defaultProps: BadgeProps = {
    children: 'Test Badge',
    ...props,
  };

  return render(<Badge {...defaultProps} />);
};

describe('Badge', () => {
  describe('Basic Rendering', () => {
    test('renders badge with children', () => {
      renderBadge();
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    test('renders div element by default', () => {
      renderBadge();
      const badge = screen.getByText('Test Badge');
      expect(badge.tagName).toBe('DIV');
    });

    test('applies default classes', () => {
      renderBadge();
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-full'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Badge ref={ref}>Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    test('applies default variant classes', () => {
      renderBadge({ variant: 'default' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-gray-900', 'text-white');
      expect(badge.className).toMatch(/shadow/);
    });

    test('applies secondary variant classes', () => {
      renderBadge({ variant: 'secondary' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    test('applies destructive variant classes', () => {
      renderBadge({ variant: 'destructive' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-red-500', 'text-white');
      expect(badge.className).toMatch(/shadow/);
    });

    test('applies outline variant classes', () => {
      renderBadge({ variant: 'outline' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'border-input',
        'bg-background',
        'text-foreground'
      );
    });

    test('applies success variant classes', () => {
      renderBadge({ variant: 'success' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-green-500', 'text-white');
      expect(badge.className).toMatch(/shadow/);
    });

    test('applies warning variant classes', () => {
      renderBadge({ variant: 'warning' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-yellow-500', 'text-white');
      expect(badge.className).toMatch(/shadow/);
    });

    test('applies info variant classes', () => {
      renderBadge({ variant: 'info' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('bg-blue-500', 'text-white');
      expect(badge.className).toMatch(/shadow/);
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderBadge({ size: 'sm' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'text-xs',
        'h-5',
        'px-2',
        'py-0',
        'min-w-[1.25rem]'
      );
    });

    test('applies default size classes', () => {
      renderBadge({ size: 'default' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'text-xs',
        'h-6',
        'px-2.5',
        'py-0.5',
        'min-w-[1.5rem]'
      );
    });

    test('applies large size classes', () => {
      renderBadge({ size: 'lg' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'text-sm',
        'h-7',
        'px-3',
        'py-1',
        'min-w-[1.75rem]'
      );
    });
  });

  describe('Custom Props', () => {
    test('accepts custom className', () => {
      renderBadge({ className: 'custom-class' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('custom-class');
    });

    test('spreads additional props', () => {
      render(
        <Badge data-testid="custom-badge" aria-label="Custom label">
          Test Badge
        </Badge>
      );
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toHaveAttribute('aria-label', 'Custom label');
    });

    test('accepts id prop', () => {
      renderBadge({ id: 'test-badge-id' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveAttribute('id', 'test-badge-id');
    });

    test('accepts role prop', () => {
      renderBadge({ role: 'status' });
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveAttribute('role', 'status');
    });
  });

  describe('Polymorphic Behavior', () => {
    test('renders as child element when asChild is true', () => {
      const { container } = render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>
      );

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Link Badge');
    });

    test('applies badge classes to child element with asChild', () => {
      render(
        <Badge asChild variant="secondary" size="lg">
          <div data-testid="custom-element">Custom Element</div>
        </Badge>
      );

      const customElement = screen.getByTestId('custom-element');
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveClass('bg-secondary');
      expect(customElement).toHaveClass('h-7'); // lg size
    });

    test('renders as button with asChild', () => {
      render(
        <Badge asChild variant="outline">
          <button type="button" data-testid="badge-button">
            Button Badge
          </button>
        </Badge>
      );

      const button = screen.getByTestId('badge-button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveClass('border-input', 'bg-background');
    });
  });

  describe('Interactions', () => {
    test('handles click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderBadge({ onClick: handleClick });
      const badge = screen.getByText('Test Badge');

      await user.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles click events with asChild', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Badge asChild>
          <button onClick={handleClick}>Clickable Badge</button>
        </Badge>
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles keyboard interactions with asChild button', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Badge asChild>
          <button onClick={handleClick}>Keyboard Badge</button>
        </Badge>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    test('handles focus and blur events', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const user = userEvent.setup();

      renderBadge({
        onFocus: handleFocus,
        onBlur: handleBlur,
        tabIndex: 0,
      });
      const badge = screen.getByText('Test Badge');

      badge.focus();
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content Types', () => {
    test('renders text content', () => {
      renderBadge({ children: 'Simple Text' });
      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    test('renders with numbers', () => {
      renderBadge({ children: 42 });
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    test('renders with JSX content', () => {
      renderBadge({
        children: (
          <>
            <span>Icon</span>
            <span>Text</span>
          </>
        ),
      });
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    test('renders empty badge', () => {
      const { container } = renderBadge({ children: '' });
      const badge = container.firstChild;
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex');
    });
  });

  describe('Recipe App Use Cases', () => {
    test('renders difficulty badge', () => {
      renderBadge({
        variant: 'warning',
        children: 'Medium',
        'aria-label': 'Difficulty level: Medium',
      });
      const badge = screen.getByLabelText('Difficulty level: Medium');
      expect(badge).toHaveTextContent('Medium');
      expect(badge).toHaveClass('bg-yellow-500');
    });

    test('renders cooking time badge', () => {
      renderBadge({
        variant: 'outline',
        size: 'sm',
        children: '30 min',
      });
      const badge = screen.getByText('30 min');
      expect(badge).toHaveClass('h-5', 'border-input');
    });

    test('renders category badges', () => {
      render(
        <div>
          <Badge variant="info">Breakfast</Badge>
          <Badge variant="info">Vegetarian</Badge>
          <Badge variant="info">Quick</Badge>
        </div>
      );

      expect(screen.getByText('Breakfast')).toHaveClass('bg-blue-500');
      expect(screen.getByText('Vegetarian')).toHaveClass('bg-blue-500');
      expect(screen.getByText('Quick')).toHaveClass('bg-blue-500');
    });

    test('renders status badges', () => {
      render(
        <div>
          <Badge variant="success">Published</Badge>
          <Badge variant="warning">Draft</Badge>
          <Badge variant="secondary">Private</Badge>
        </div>
      );

      expect(screen.getByText('Published')).toHaveClass('bg-green-500');
      expect(screen.getByText('Draft')).toHaveClass('bg-yellow-500');
      expect(screen.getByText('Private')).toHaveClass('bg-secondary');
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderBadge();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations with different variants', async () => {
      const variants = [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
      ] as const;

      for (const variant of variants) {
        const { container, unmount } = renderBadge({ variant });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
        unmount();
      }
    });

    test('has no accessibility violations when interactive', async () => {
      const { container } = render(
        <Badge asChild>
          <button>Interactive Badge</button>
        </Badge>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('maintains focus visibility', () => {
      renderBadge();
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:ring-offset-2'
      );
    });

    test('supports aria-label for context', () => {
      renderBadge({
        'aria-label': 'Recipe status: Published',
        children: 'Published',
      });
      const badge = screen.getByLabelText('Recipe status: Published');
      expect(badge).toBeInTheDocument();
    });

    test('supports role attribute', () => {
      renderBadge({ role: 'status' });
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    test('applies base classes to all variants', () => {
      const variants = [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
      ] as const;

      variants.forEach(variant => {
        const { unmount } = renderBadge({ variant });
        const badge = screen.getByText('Test Badge');

        expect(badge).toHaveClass(
          'inline-flex',
          'items-center',
          'justify-center',
          'rounded-full',
          'border',
          'text-xs',
          'font-semibold',
          'transition-colors',
          'whitespace-nowrap'
        );

        unmount();
      });
    });

    test('applies focus classes', () => {
      renderBadge();
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:ring-offset-2'
      );
    });

    test('applies size-specific classes', () => {
      const sizes = ['sm', 'default', 'lg'] as const;
      const expectedClasses = {
        sm: ['h-5', 'px-2', 'py-0', 'min-w-[1.25rem]'],
        default: ['h-6', 'px-2.5', 'py-0.5', 'min-w-[1.5rem]'],
        lg: ['h-7', 'px-3', 'py-1', 'min-w-[1.75rem]'],
      };

      sizes.forEach(size => {
        const { unmount } = renderBadge({ size });
        const badge = screen.getByText('Test Badge');

        expectedClasses[size].forEach(className => {
          expect(badge).toHaveClass(className);
        });

        unmount();
      });
    });
  });

  describe('Component Display Name', () => {
    test('has correct display name', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('Integration with Custom Styling', () => {
    test('merges custom classes correctly', () => {
      renderBadge({
        className: 'bg-red-500 custom-class',
        variant: 'default',
      });
      const badge = screen.getByText('Test Badge');

      // Should have both custom and variant classes
      expect(badge).toHaveClass('custom-class');
      // tailwind-merge should handle conflicting bg classes
      expect(badge.className).toContain('bg-');
    });

    test('handles conflicting Tailwind classes', () => {
      renderBadge({
        className: 'px-8 py-4',
        size: 'sm', // has px-2 py-0
      });
      const badge = screen.getByText('Test Badge');

      // tailwind-merge should resolve conflicts in favor of custom classes
      expect(badge.className).toMatch(/px-\d+/);
    });

    test('preserves important custom classes', () => {
      renderBadge({
        className: 'z-50 shadow-2xl transform scale-110',
        variant: 'default',
      });
      const badge = screen.getByText('Test Badge');

      expect(badge).toHaveClass('z-50', 'shadow-2xl', 'transform', 'scale-110');
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined children gracefully', () => {
      const { container } = render(<Badge>{undefined}</Badge>);
      const badge = container.firstChild;
      expect(badge).toBeInTheDocument();
    });

    test('handles null children gracefully', () => {
      const { container } = render(<Badge>{null}</Badge>);
      const badge = container.firstChild;
      expect(badge).toBeInTheDocument();
    });

    test('handles boolean children gracefully', () => {
      const { container } = render(<Badge>{true}</Badge>);
      const badge = container.firstChild;
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });

    test('handles array children', () => {
      renderBadge({ children: ['Item 1', ' - ', 'Item 2'] });
      expect(screen.getByText('Item 1 - Item 2')).toBeInTheDocument();
    });
  });
});
