import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spinner } from '@/components/ui/spinner';

expect.extend(toHaveNoViolations);

describe('Spinner', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const { container } = render(<Spinner />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('inline-flex');
      expect(spinner).toHaveClass('animate-spin');
    });

    it('includes screen reader text', () => {
      render(<Spinner />);
      expect(screen.getByText('Loading')).toHaveClass('sr-only');
    });

    it('accepts custom label', () => {
      render(<Spinner label="Processing data" />);
      expect(screen.getByText('Processing data')).toHaveClass('sr-only');
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Processing data'
      );
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Spinner ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('accepts custom className', () => {
      const { container } = render(<Spinner className="custom-class" />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toHaveClass('custom-class');
    });

    it('spreads additional props', () => {
      render(<Spinner data-testid="custom-spinner" />);
      expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders spinner variant by default', () => {
      const { container } = render(<Spinner variant="spinner" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('animate-spin');
    });

    it('renders dots variant correctly', () => {
      const { container } = render(<Spinner variant="dots" />);
      const spans = container.querySelectorAll('span:not(.sr-only)');
      expect(spans).toHaveLength(3);
      expect(container.firstChild).toHaveClass('gap-1');
    });

    it('renders pulse variant correctly', () => {
      const { container } = render(<Spinner variant="pulse" />);
      const spans = container.querySelectorAll('span:not(.sr-only)');
      expect(spans).toHaveLength(1);
    });

    it('renders bars variant correctly', () => {
      const { container } = render(<Spinner variant="bars" />);
      const spans = container.querySelectorAll('span:not(.sr-only)');
      expect(spans).toHaveLength(3);
      expect(container.firstChild).toHaveClass('gap-1');
    });
  });

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'default', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`applies ${size} size correctly`, () => {
        const { container } = render(<Spinner size={size} />);
        const spinner = container.firstChild as HTMLElement;

        const sizeClasses = {
          xs: 'h-4 w-4',
          sm: 'h-5 w-5',
          default: 'h-6 w-6',
          lg: 'h-8 w-8',
          xl: 'h-12 w-12',
        };

        sizeClasses[size].split(' ').forEach(className => {
          expect(spinner).toHaveClass(className);
        });
      });
    });

    it('applies size-specific classes to dots variant', () => {
      const { container } = render(<Spinner variant="dots" size="lg" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('[&>span]:h-2.5');
      expect(spinner).toHaveClass('[&>span]:w-2.5');
    });

    it('applies size-specific classes to bars variant', () => {
      const { container } = render(<Spinner variant="bars" size="lg" />);
      const spinner = container.firstChild as HTMLElement;
      expect(spinner).toHaveClass('[&>span]:h-6');
      expect(spinner).toHaveClass('[&>span]:w-2');
    });
  });

  describe('Colors', () => {
    const colors = [
      'default',
      'primary',
      'secondary',
      'muted',
      'destructive',
      'success',
      'warning',
      'info',
    ] as const;

    colors.forEach(color => {
      it(`applies ${color} color correctly`, () => {
        const { container } = render(<Spinner color={color} />);
        const spinner = container.firstChild as HTMLElement;

        const colorClasses = {
          default: 'text-foreground',
          primary: 'text-primary',
          secondary: 'text-secondary',
          muted: 'text-muted-foreground',
          destructive: 'text-destructive',
          success: 'text-green-600',
          warning: 'text-yellow-600',
          info: 'text-blue-600',
        };

        expect(spinner).toHaveClass(colorClasses[color]);
      });
    });
  });

  describe('Speed', () => {
    const speeds = ['slow', 'default', 'fast'] as const;

    speeds.forEach(speed => {
      it(`applies ${speed} speed to spinner variant`, () => {
        const { container } = render(
          <Spinner variant="spinner" speed={speed} />
        );
        const spinner = container.firstChild as HTMLElement;

        const speedClasses = {
          slow: '[animation-duration:1.5s]',
          default: '[animation-duration:1s]',
          fast: '[animation-duration:0.6s]',
        };

        if (speed !== 'default') {
          expect(spinner).toHaveClass(speedClasses[speed]);
        }
      });

      it(`applies ${speed} speed to dots variant`, () => {
        const { container } = render(<Spinner variant="dots" speed={speed} />);
        const spinner = container.firstChild as HTMLElement;

        const speedClasses = {
          slow: '[&>span]:[animation-duration:1.8s]',
          default: '[&>span]:[animation-duration:1.4s]',
          fast: '[&>span]:[animation-duration:0.8s]',
        };

        if (speed !== 'default') {
          expect(spinner).toHaveClass(speedClasses[speed]);
        }
      });
    });
  });

  describe('Loading Text', () => {
    it('renders text below spinner by default', () => {
      const { container } = render(<Spinner text="Loading recipes..." />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex-col');
      expect(screen.getByText('Loading recipes...')).toBeInTheDocument();
      expect(screen.getByText('Loading recipes...')).toHaveClass('text-sm');
      expect(screen.getByText('Loading recipes...')).toHaveClass(
        'text-muted-foreground'
      );
    });

    it('renders text to the right when specified', () => {
      const { container } = render(
        <Spinner text="Processing..." textPosition="right" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex-row');
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('maintains gap between spinner and text', () => {
      const { container } = render(<Spinner text="Loading..." />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('gap-3');
    });
  });

  describe('Overlay Mode', () => {
    it('renders as fullscreen overlay when overlay is true', () => {
      const { container } = render(<Spinner overlay />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('fixed');
      expect(wrapper).toHaveClass('inset-0');
      expect(wrapper).toHaveClass('z-50');
      expect(wrapper).toHaveClass('bg-background/80');
      expect(wrapper).toHaveClass('backdrop-blur-sm');
    });

    it('combines overlay with text', () => {
      render(<Spinner overlay text="Please wait..." />);
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('Centered Mode', () => {
    it('centers spinner in container when centered is true', () => {
      const { container } = render(<Spinner centered />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('justify-center');
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('h-full');
      expect(wrapper).toHaveClass('min-h-[100px]');
    });

    it('can combine centered with overlay', () => {
      const { container } = render(<Spinner centered overlay />);
      const wrapper = container.firstChild as HTMLElement;
      // Should have overlay classes
      expect(wrapper).toHaveClass('fixed');
      expect(wrapper).toHaveClass('inset-0');
      // Centered classes are handled by overlay's flex centering
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Spinner />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Loading');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('uses custom label for ARIA', () => {
      render(<Spinner label="Uploading file" />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Uploading file');
    });

    it('has no accessibility violations with default props', async () => {
      const { container } = render(<Spinner />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with all variants', async () => {
      const { container } = render(
        <div>
          <Spinner variant="spinner" />
          <Spinner variant="dots" />
          <Spinner variant="pulse" />
          <Spinner variant="bars" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with text', async () => {
      const { container } = render(<Spinner text="Loading..." />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in overlay mode', async () => {
      const { container } = render(<Spinner overlay />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty text gracefully', () => {
      const { container } = render(<Spinner text="" />);
      // Should not render text wrapper when text is empty
      expect(container.querySelector('.flex-col')).not.toBeInTheDocument();
    });

    it('handles multiple props combinations', () => {
      const { container } = render(
        <Spinner
          variant="dots"
          size="lg"
          color="primary"
          speed="fast"
          text="Loading..."
          textPosition="right"
          className="custom-class"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex-row');
      expect(screen.getByRole('status')).toHaveClass('custom-class');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('maintains proper structure with all features enabled', () => {
      const { container } = render(
        <Spinner
          overlay
          centered
          text="Please wait..."
          variant="pulse"
          size="xl"
          color="primary"
          speed="slow"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('fixed');
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('works as inline component in button', () => {
      render(
        <button>
          <Spinner size="sm" />
          <span>Save</span>
        </button>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('works in card loading state', () => {
      render(
        <div className="card">
          <Spinner centered text="Loading content..." />
        </div>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('works with conditional rendering', () => {
      const { rerender } = render(<div>{false && <Spinner />}</div>);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      rerender(<div>{true && <Spinner />}</div>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
