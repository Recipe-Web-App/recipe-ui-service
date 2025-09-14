import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  type CardProps,
} from '@/components/ui/card';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Card with default props
 */
const renderCard = (props: Partial<CardProps> = {}) => {
  const defaultProps: CardProps = {
    ...props,
  };

  return render(<Card {...defaultProps}>Test Card</Card>);
};

describe('Card', () => {
  describe('Basic Rendering', () => {
    test('renders card element', () => {
      renderCard();
      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      renderCard();
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'rounded-lg',
        'border'
      );
    });

    test('renders with custom className', () => {
      renderCard({ className: 'custom-class' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('custom-class');
    });

    test('renders compound components together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Test Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    test('spreads additional props', () => {
      render(
        <Card data-testid="test-card" title="Test Title">
          Test Card
        </Card>
      );
      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('title', 'Test Title');
    });
  });

  describe('Variants', () => {
    test('applies default variant styles', () => {
      renderCard({ variant: 'default' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('border-border', 'shadow-sm');
    });

    test('applies elevated variant styles', () => {
      renderCard({ variant: 'elevated' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass(
        'border-border/50',
        'shadow-md',
        'hover:shadow-lg'
      );
    });

    test('applies outlined variant styles', () => {
      renderCard({ variant: 'outlined' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass(
        'border-border',
        'bg-transparent',
        'shadow-none'
      );
    });

    test('applies ghost variant styles', () => {
      renderCard({ variant: 'ghost' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass(
        'border-transparent',
        'bg-transparent',
        'shadow-none'
      );
    });

    test('applies interactive variant styles', () => {
      renderCard({ variant: 'interactive' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass(
        'cursor-pointer',
        'hover:shadow-md',
        'active:scale-[0.98]'
      );
    });
  });

  describe('Sizes', () => {
    test('applies small size styles', () => {
      renderCard({ size: 'sm' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('p-3');
    });

    test('applies default size styles', () => {
      renderCard({ size: 'default' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('p-4');
    });

    test('applies large size styles', () => {
      renderCard({ size: 'lg' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Interactive Behavior', () => {
    test('handles click when interactive prop is true', () => {
      const handleClick = jest.fn();
      renderCard({ interactive: true, onClick: handleClick });

      const card = screen.getByText('Test Card');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('applies interactive variant when interactive prop is true', () => {
      renderCard({ interactive: true, variant: 'default' });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-md');
    });

    test('handles Enter key when interactive', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ interactive: true, onClick: handleClick });

      const card = screen.getByText('Test Card');
      card.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles Space key when interactive', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ interactive: true, onClick: handleClick });

      const card = screen.getByText('Test Card');
      card.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not handle other keys when interactive', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ interactive: true, onClick: handleClick });

      const card = screen.getByText('Test Card');
      card.focus();
      await user.keyboard('{Escape}');

      expect(handleClick).not.toHaveBeenCalled();
    });

    test('sets proper attributes when interactive', () => {
      renderCard({ interactive: true });
      const card = screen.getByText('Test Card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    test('does not set interactive attributes when not interactive', () => {
      renderCard({ interactive: false });
      const card = screen.getByText('Test Card');
      expect(card).not.toHaveAttribute('role', 'button');
      expect(card).not.toHaveAttribute('tabIndex');
    });

    test('can be focused when interactive', () => {
      renderCard({ interactive: true });
      const card = screen.getByText('Test Card');
      card.focus();
      expect(card).toHaveFocus();
    });

    test('shows focus ring styles when focused and interactive', () => {
      renderCard({ interactive: true });
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass(
        'focus-visible:ring-2',
        'focus-visible:ring-ring'
      );
    });
  });

  describe('Polymorphic Rendering', () => {
    test('renders as div by default', () => {
      renderCard();
      const card = screen.getByText('Test Card');
      expect(card.tagName).toBe('DIV');
    });

    test('renders as custom element with asChild', () => {
      render(
        <Card asChild>
          <article>Test Card</article>
        </Card>
      );
      const card = screen.getByText('Test Card');
      expect(card.tagName).toBe('ARTICLE');
    });

    test('renders as button with asChild', () => {
      render(
        <Card asChild>
          <button type="button">Test Card</button>
        </Card>
      );
      const card = screen.getByText('Test Card');
      expect(card.tagName).toBe('BUTTON');
    });

    test('renders as section with asChild', () => {
      render(
        <Card asChild>
          <section>Test Card</section>
        </Card>
      );
      const card = screen.getByText('Test Card');
      expect(card.tagName).toBe('SECTION');
    });

    test('preserves className when using asChild', () => {
      render(
        <Card asChild className="custom-class">
          <article>Test Card</article>
        </Card>
      );
      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('custom-class', 'bg-card');
    });
  });

  describe('Compound Components', () => {
    test('CardHeader renders with proper classes', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
    });

    test('CardContent renders with proper classes', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('flex', 'flex-col', 'space-y-4');
    });

    test('CardFooter renders with proper classes', () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass(
        'flex',
        'items-center',
        'justify-between',
        'pt-4'
      );
    });

    test('CardTitle renders as h3 by default with proper classes', () => {
      render(<CardTitle>Test Title</CardTitle>);
      const title = screen.getByText('Test Title');
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass(
        'text-xl',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });

    test('CardDescription renders as p by default with proper classes', () => {
      render(<CardDescription>Test Description</CardDescription>);
      const description = screen.getByText('Test Description');
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    test('compound components support asChild', () => {
      render(
        <>
          <CardHeader asChild>
            <header>Header</header>
          </CardHeader>
          <CardContent asChild>
            <main>Content</main>
          </CardContent>
          <CardFooter asChild>
            <footer>Footer</footer>
          </CardFooter>
          <CardTitle asChild>
            <h2>Title</h2>
          </CardTitle>
          <CardDescription asChild>
            <span>Description</span>
          </CardDescription>
        </>
      );

      expect(screen.getByText('Header').tagName).toBe('HEADER');
      expect(screen.getByText('Content').tagName).toBe('MAIN');
      expect(screen.getByText('Footer').tagName).toBe('FOOTER');
      expect(screen.getByText('Title').tagName).toBe('H2');
      expect(screen.getByText('Description').tagName).toBe('SPAN');
    });

    test('compound components forward refs', () => {
      const headerRef = React.createRef<HTMLDivElement>();
      const contentRef = React.createRef<HTMLDivElement>();
      const footerRef = React.createRef<HTMLDivElement>();
      const titleRef = React.createRef<HTMLHeadingElement>();
      const descriptionRef = React.createRef<HTMLParagraphElement>();

      render(
        <>
          <CardHeader ref={headerRef}>Header</CardHeader>
          <CardContent ref={contentRef}>Content</CardContent>
          <CardFooter ref={footerRef}>Footer</CardFooter>
          <CardTitle ref={titleRef}>Title</CardTitle>
          <CardDescription ref={descriptionRef}>Description</CardDescription>
        </>
      );

      expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
      expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations - basic card', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This card is accessible</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations - interactive card', async () => {
      const { container } = render(
        <Card interactive onClick={() => {}}>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Click me!</CardDescription>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper ARIA role when interactive', () => {
      renderCard({ interactive: true });
      const card = screen.getByText('Test Card');
      expect(card).toHaveAttribute('role', 'button');
    });

    test('is keyboard accessible when interactive', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ interactive: true, onClick: handleClick });

      const card = screen.getByText('Test Card');
      await user.tab();
      expect(card).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('supports screen reader with proper heading hierarchy', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Recipe Title</CardTitle>
            <CardDescription>Recipe description</CardDescription>
          </CardHeader>
        </Card>
      );

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Recipe Title');
    });

    test('maintains focus management in interactive cards', async () => {
      const user = userEvent.setup();
      renderCard({ interactive: true });

      const card = screen.getByText('Test Card');
      await user.tab();
      expect(card).toHaveFocus();

      await user.tab();
      expect(card).not.toHaveFocus();
    });
  });

  describe('Recipe Context Usage', () => {
    test('renders recipe card layout', () => {
      render(
        <Card variant="elevated" size="lg">
          <CardHeader>
            <CardTitle>Chocolate Chip Cookies</CardTitle>
            <CardDescription>30 mins • Easy • 24 cookies</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Delicious homemade chocolate chip cookies</p>
          </CardContent>
          <CardFooter>
            <span>★★★★★ (125 reviews)</span>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
      expect(
        screen.getByText('30 mins • Easy • 24 cookies')
      ).toBeInTheDocument();
      expect(screen.getByText('★★★★★ (125 reviews)')).toBeInTheDocument();
    });

    test('renders stat card layout', () => {
      render(
        <Card variant="default" size="sm">
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-muted-foreground text-sm">Total Recipes</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Total Recipes')).toBeInTheDocument();
    });

    test('renders info card layout', () => {
      render(
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Pro Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Always preheat your oven for best results!</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Pro Tip')).toBeInTheDocument();
      expect(
        screen.getByText('Always preheat your oven for best results!')
      ).toBeInTheDocument();
    });

    test('handles recipe card interactions', async () => {
      const user = userEvent.setup();
      const handleRecipeClick = jest.fn();

      render(
        <Card interactive onClick={handleRecipeClick}>
          <CardHeader>
            <CardTitle>Clickable Recipe</CardTitle>
          </CardHeader>
        </Card>
      );

      const card = screen
        .getByText('Clickable Recipe')
        .closest('[role="button"]');
      expect(card).toBeInTheDocument();

      await user.click(card!);
      expect(handleRecipeClick).toHaveBeenCalledTimes(1);
    });

    test('renders with recipe metadata', () => {
      render(
        <Card data-recipe-id="123" data-category="dessert">
          <CardTitle>Recipe with Metadata</CardTitle>
        </Card>
      );

      const card = screen
        .getByText('Recipe with Metadata')
        .closest('[data-recipe-id]');
      expect(card).toHaveAttribute('data-recipe-id', '123');
      expect(card).toHaveAttribute('data-category', 'dessert');
    });
  });

  describe('Error Handling', () => {
    test('handles missing onClick gracefully when interactive', () => {
      renderCard({ interactive: true });
      const card = screen.getByText('Test Card');

      expect(() => {
        fireEvent.click(card);
      }).not.toThrow();
    });

    test('handles empty content gracefully', () => {
      const { container } = render(<Card data-testid="empty-card" />);
      const card = screen.getByTestId('empty-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-card');
    });

    test('handles invalid variant gracefully', () => {
      // @ts-expect-error Testing invalid variant
      renderCard({ variant: 'invalid' });
      const card = screen.getByText('Test Card');
      expect(card).toBeInTheDocument();
    });

    test('handles compound components without main card', () => {
      render(
        <>
          <CardHeader>Standalone Header</CardHeader>
          <CardContent>Standalone Content</CardContent>
          <CardFooter>Standalone Footer</CardFooter>
        </>
      );

      expect(screen.getByText('Standalone Header')).toBeInTheDocument();
      expect(screen.getByText('Standalone Content')).toBeInTheDocument();
      expect(screen.getByText('Standalone Footer')).toBeInTheDocument();
    });

    test('prevents default on Enter/Space when interactive', async () => {
      const handleClick = jest.fn();
      renderCard({ interactive: true, onClick: handleClick });
      const card = screen.getByText('Test Card');

      card.focus();

      // Test Enter key
      fireEvent.keyDown(card, {
        key: 'Enter',
        preventDefault: jest.fn(),
      });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles className merging correctly', () => {
      renderCard({
        className: 'custom-padding',
        variant: 'elevated',
        size: 'lg',
      });

      const card = screen.getByText('Test Card');
      expect(card).toHaveClass('custom-padding', 'shadow-md', 'p-6');
    });
  });
});
