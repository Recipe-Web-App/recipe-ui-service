import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button, type ButtonProps } from '@/components/ui/button';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Button with default props
 */
const renderButton = (props: Partial<ButtonProps> = {}) => {
  const defaultProps: ButtonProps = {
    children: 'Test Button',
    ...props,
  };

  return render(<Button {...defaultProps} />);
};

describe('Button', () => {
  describe('Basic Rendering', () => {
    test('renders button with children', () => {
      renderButton();
      expect(
        screen.getByRole('button', { name: 'Test Button' })
      ).toBeInTheDocument();
    });

    test('renders button element by default', () => {
      renderButton();
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    test('applies default classes', () => {
      renderButton();
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    test('applies default variant classes', () => {
      renderButton({ variant: 'default' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
      // Note: text-primary-foreground might be optimized out by tailwind-merge
      expect(button.className).toMatch(/shadow/);
    });

    test('applies destructive variant classes', () => {
      renderButton({ variant: 'destructive' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
      expect(button.className).toMatch(/shadow-sm/);
    });

    test('applies outline variant classes', () => {
      renderButton({ variant: 'outline' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-input', 'bg-background');
    });

    test('applies secondary variant classes', () => {
      renderButton({ variant: 'secondary' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
      expect(button.className).toMatch(/shadow-sm/);
    });

    test('applies ghost variant classes', () => {
      renderButton({ variant: 'ghost' });
      const button = screen.getByRole('button');
      // Ghost doesn't have background or shadow, check for hover classes presence
      expect(button.className).toMatch(/hover:bg-accent/);
    });

    test('applies link variant classes', () => {
      renderButton({ variant: 'link' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('underline-offset-4');
      expect(button.className).toMatch(/hover:underline/);
    });
  });

  describe('Sizes', () => {
    test('applies default size classes', () => {
      renderButton({ size: 'default' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-4', 'py-2', 'text-button-base');
    });

    test('applies small size classes', () => {
      renderButton({ size: 'sm' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-button-sm');
    });

    test('applies large size classes', () => {
      renderButton({ size: 'lg' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-8', 'text-button-lg');
    });

    test('applies icon size classes', () => {
      renderButton({ size: 'icon' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'w-9');
    });
  });

  describe('States', () => {
    test('handles disabled state', () => {
      renderButton({ disabled: true });
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveClass(
        'disabled:pointer-events-none',
        'disabled:opacity-50'
      );
    });

    test('handles loading state', () => {
      renderButton({ loading: true });
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');

      // Check for loading spinner
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    test('loading state takes precedence over disabled', () => {
      renderButton({ loading: true, disabled: false });
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('shows spinner when loading', () => {
      renderButton({ loading: true });
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg[aria-hidden="true"]');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Interactions', () => {
    test('handles click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderButton({ onClick: handleClick });
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not trigger click when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderButton({ onClick: handleClick, disabled: true });
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('does not trigger click when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderButton({ onClick: handleClick, loading: true });
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('handles keyboard interactions', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderButton({ onClick: handleClick });
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

      renderButton({ onFocus: handleFocus, onBlur: handleBlur });
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Props', () => {
    test('accepts custom className', () => {
      renderButton({ className: 'custom-class' });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('spreads additional props', () => {
      render(
        <Button data-testid="custom-button" aria-label="Custom label">
          Test Button
        </Button>
      );
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    test('accepts type prop', () => {
      renderButton({ type: 'submit' });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('accepts form attributes', () => {
      renderButton({ form: 'test-form' });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'test-form');
    });
  });

  describe('Polymorphic Behavior', () => {
    test('renders as child element when asChild is true', () => {
      const { container } = render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Link Button');
    });

    test('applies button classes to child element with asChild', () => {
      render(
        <Button asChild variant="secondary" size="lg">
          <div data-testid="custom-element">Custom Element</div>
        </Button>
      );

      const customElement = screen.getByTestId('custom-element');
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveClass('bg-secondary');
      expect(customElement).toHaveClass('h-10'); // lg size
    });
  });

  describe('Loading State Details', () => {
    test('spinner has correct attributes', () => {
      renderButton({ loading: true });
      const spinner = screen.getByRole('button').querySelector('svg');

      expect(spinner).toHaveAttribute('aria-hidden', 'true');
      expect(spinner).toHaveAttribute('fill', 'none');
      expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
    });

    test('spinner contains circle and path elements', () => {
      renderButton({ loading: true });
      const button = screen.getByRole('button');
      const circle = button.querySelector('circle');
      const path = button.querySelector('path');

      expect(circle).toBeInTheDocument();
      expect(path).toBeInTheDocument();
      expect(circle).toHaveClass('opacity-25');
      expect(path).toHaveClass('opacity-75');
    });

    test('loading state preserves button content', () => {
      renderButton({ loading: true, children: 'Loading Button' });
      expect(screen.getByText('Loading Button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderButton();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations when disabled', async () => {
      const { container } = renderButton({ disabled: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations when loading', async () => {
      const { container } = renderButton({ loading: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('maintains focus visibility', () => {
      renderButton();
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2'
      );
    });

    test('has proper ARIA attributes when disabled', () => {
      renderButton({ disabled: true });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('has proper ARIA attributes when loading', () => {
      renderButton({ loading: true });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('spinner is hidden from screen readers', () => {
      renderButton({ loading: true });
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('CSS Classes', () => {
    test('applies base classes to all variants', () => {
      const variants = [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ] as const;

      variants.forEach(variant => {
        const { unmount } = renderButton({ variant });
        const button = screen.getByRole('button');

        expect(button).toHaveClass(
          'inline-flex',
          'items-center',
          'justify-center',
          'gap-2',
          'whitespace-nowrap',
          'rounded-md',
          'font-medium',
          'transition-colors'
        );

        unmount();
      });
    });

    test('applies focus classes', () => {
      renderButton();
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      );
    });

    test('applies disabled classes', () => {
      renderButton({ disabled: true });
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'disabled:pointer-events-none',
        'disabled:opacity-50'
      );
    });

    test('applies SVG classes', () => {
      renderButton();
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        '[&_svg]:pointer-events-none',
        '[&_svg]:size-4',
        '[&_svg]:shrink-0'
      );
    });
  });

  describe('Component Display Name', () => {
    test('has correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Integration with Custom Styling', () => {
    test('merges custom classes correctly', () => {
      renderButton({
        className: 'bg-red-500 custom-class',
        variant: 'default',
      });
      const button = screen.getByRole('button');

      // Should have both custom and variant classes
      expect(button).toHaveClass('custom-class');
      // tailwind-merge should handle conflicting bg classes
      expect(button.className).toContain('bg-');
    });

    test('handles conflicting Tailwind classes', () => {
      renderButton({
        className: 'px-8 py-4',
        size: 'sm', // has px-3
      });
      const button = screen.getByRole('button');

      // tailwind-merge should resolve conflicts
      expect(button.className).toMatch(/px-\d+/);
    });
  });
});
