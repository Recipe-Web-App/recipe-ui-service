import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
  RecipeDisclosure,
  KitchenTipsDisclosure,
  FAQDisclosure,
  IngredientNotesDisclosure,
  DisclosureGroup,
} from '@/components/ui/disclosure';

expect.extend(toHaveNoViolations);

describe('Disclosure', () => {
  describe('Basic functionality', () => {
    it('renders without crashing', () => {
      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      expect(
        screen.getByRole('button', { name: 'Question' })
      ).toBeInTheDocument();
    });

    it('is closed by default', () => {
      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Answer')).not.toBeInTheDocument();
    });

    it('can be opened by default', () => {
      render(
        <Disclosure defaultOpen>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Answer')).toBeInTheDocument();
    });

    it('toggles open/closed when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Answer')).not.toBeInTheDocument();

      // Click to open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Answer')).toBeInTheDocument();

      // Click to close
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Answer')).not.toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');

      // Focus the trigger
      await user.tab();
      expect(trigger).toHaveFocus();

      // Press Enter to open
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Press Space to close
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Controlled mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      const ControlledDisclosure = () => {
        const [open, setOpen] = React.useState(false);

        React.useEffect(() => {
          handleOpenChange(open);
        }, [open]);

        return (
          <Disclosure open={open} onOpenChange={setOpen}>
            <DisclosureTrigger>Question</DisclosureTrigger>
            <DisclosureContent>Answer</DisclosureContent>
          </Disclosure>
        );
      };

      render(<ControlledDisclosure />);

      const trigger = screen.getByRole('button');

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(handleOpenChange).toHaveBeenLastCalledWith(false);

      // Click to open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    });

    it('respects external control', () => {
      const TestComponent = ({ open }: { open: boolean }) => (
        <Disclosure open={open}>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const { rerender } = render(<TestComponent open={false} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      expect(screen.queryByText('Answer')).not.toBeInTheDocument();

      rerender(<TestComponent open={true} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      expect(screen.getByText('Answer')).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('does not open when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Disclosure disabled>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Answer')).not.toBeInTheDocument();
    });

    it('can disable the trigger independently', async () => {
      const user = userEvent.setup();

      render(
        <Disclosure>
          <DisclosureTrigger disabled>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Non-collapsible mode', () => {
    it('cannot be closed once opened when collapsible is false', async () => {
      const user = userEvent.setup();

      render(
        <Disclosure defaultOpen collapsible={false}>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');

      // Initially open
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Answer')).toBeInTheDocument();

      // Try to close - should remain open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Answer')).toBeInTheDocument();
    });
  });

  describe('Variants and styling', () => {
    it('applies variant classes correctly', () => {
      const { rerender } = render(
        <Disclosure variant="default" data-testid="disclosure">
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      let container = screen.getByTestId('disclosure');
      expect(container).toHaveClass('bg-white');

      rerender(
        <Disclosure variant="outlined" data-testid="disclosure">
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      container = screen.getByTestId('disclosure');
      expect(container).toHaveClass('bg-transparent');
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(
        <Disclosure size="sm">
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      let trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('text-sm');

      rerender(
        <Disclosure size="lg">
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('text-lg');
    });
  });

  describe('Icons', () => {
    it('shows default chevron icon by default', () => {
      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('can hide the icon', () => {
      render(
        <Disclosure>
          <DisclosureTrigger showIcon={false}>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('can use custom icon', () => {
      render(
        <Disclosure>
          <DisclosureTrigger icon={<span data-testid="custom-icon">★</span>}>
            Question
          </DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('positions icon correctly', () => {
      const { rerender } = render(
        <Disclosure>
          <DisclosureTrigger iconPosition="left">Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      let svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('mr-2');

      rerender(
        <Disclosure>
          <DisclosureTrigger iconPosition="right">Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('ml-2');
    });
  });

  describe('Content mounting', () => {
    it('does not render content when closed by default', () => {
      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      expect(screen.queryByText('Answer')).not.toBeInTheDocument();
    });

    it('force mounts content when specified', () => {
      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent forceMount>Answer</DisclosureContent>
        </Disclosure>
      );

      const content = screen.getByText('Answer');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');

      const contentId = trigger.getAttribute('aria-controls');
      expect(contentId).toBeTruthy();
    });

    it('updates ARIA attributes when opened', async () => {
      const user = userEvent.setup();

      render(
        <Disclosure>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const content = screen.getByText('Answer');
      expect(content).toHaveAttribute('role', 'region');
      expect(content).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('supports custom aria-label', () => {
      render(
        <Disclosure>
          <DisclosureTrigger ariaLabel="Custom label">
            Question
          </DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'Custom label');
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <Disclosure defaultOpen>
          <DisclosureTrigger>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('RecipeDisclosure', () => {
    it('renders with proper context styling', () => {
      render(
        <RecipeDisclosure context="tips" data-testid="recipe-disclosure">
          <DisclosureTrigger>Cooking tip</DisclosureTrigger>
          <DisclosureContent>Tip content</DisclosureContent>
        </RecipeDisclosure>
      );

      const container = screen.getByTestId('recipe-disclosure');
      expect(container).toHaveClass('border-l-amber-500');
    });

    it('shows badge when provided', () => {
      render(
        <RecipeDisclosure context="tips" badge="Pro Tip">
          <DisclosureTrigger>Cooking tip</DisclosureTrigger>
          <DisclosureContent>Tip content</DisclosureContent>
        </RecipeDisclosure>
      );

      expect(screen.getByText('Pro Tip')).toBeInTheDocument();
    });

    it('renders context-specific icon', () => {
      render(
        <RecipeDisclosure context="notes">
          <DisclosureTrigger>Note</DisclosureTrigger>
          <DisclosureContent>Note content</DisclosureContent>
        </RecipeDisclosure>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('KitchenTipsDisclosure', () => {
    it('shows difficulty badge', () => {
      render(
        <KitchenTipsDisclosure tipType="technique" difficulty="advanced">
          <DisclosureTrigger>Advanced technique</DisclosureTrigger>
          <DisclosureContent>Technique details</DisclosureContent>
        </KitchenTipsDisclosure>
      );

      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('shows estimated time when provided', () => {
      render(
        <KitchenTipsDisclosure estimatedTime="5 min">
          <DisclosureTrigger>Quick tip</DisclosureTrigger>
          <DisclosureContent>Tip content</DisclosureContent>
        </KitchenTipsDisclosure>
      );

      expect(screen.getByText('5 min')).toBeInTheDocument();
    });
  });

  describe('FAQDisclosure', () => {
    it('renders question in trigger', () => {
      render(
        <FAQDisclosure question="How long does this take?">
          <DisclosureContent>Answer content</DisclosureContent>
        </FAQDisclosure>
      );

      expect(screen.getByText('How long does this take?')).toBeInTheDocument();
    });

    it('shows featured badge when featured', () => {
      render(
        <FAQDisclosure question="Featured question" featured>
          <DisclosureContent>Answer</DisclosureContent>
        </FAQDisclosure>
      );

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('applies category styling', () => {
      render(
        <FAQDisclosure
          question="Question"
          category="cooking"
          data-testid="faq-disclosure"
        >
          <DisclosureContent>Answer</DisclosureContent>
        </FAQDisclosure>
      );

      const container = screen.getByTestId('faq-disclosure');
      expect(container).toHaveClass('border-l-red-500');
    });
  });

  describe('IngredientNotesDisclosure', () => {
    it('renders with ingredient context', () => {
      render(
        <IngredientNotesDisclosure
          ingredient="Butter"
          noteType="substitution"
          data-testid="ingredient-disclosure"
        >
          <DisclosureTrigger>Substitution options</DisclosureTrigger>
          <DisclosureContent>Use coconut oil</DisclosureContent>
        </IngredientNotesDisclosure>
      );

      const container = screen.getByTestId('ingredient-disclosure');
      expect(container).toHaveClass('border-l-green-500'); // substitutions context
    });
  });

  describe('DisclosureGroup', () => {
    it('renders multiple disclosures with proper spacing', () => {
      render(
        <DisclosureGroup spacing="normal">
          <Disclosure>
            <DisclosureTrigger>Question 1</DisclosureTrigger>
            <DisclosureContent>Answer 1</DisclosureContent>
          </Disclosure>
          <Disclosure>
            <DisclosureTrigger>Question 2</DisclosureTrigger>
            <DisclosureContent>Answer 2</DisclosureContent>
          </Disclosure>
        </DisclosureGroup>
      );

      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    it('applies spacing classes correctly', () => {
      const { container } = render(
        <DisclosureGroup spacing="loose">
          <Disclosure>
            <DisclosureTrigger>Question</DisclosureTrigger>
            <DisclosureContent>Answer</DisclosureContent>
          </Disclosure>
        </DisclosureGroup>
      );

      expect(container.firstChild).toHaveClass('space-y-4');
    });
  });

  describe('Error handling', () => {
    it('throws error when DisclosureTrigger is used outside Disclosure', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<DisclosureTrigger>Question</DisclosureTrigger>);
      }).toThrow(
        'Disclosure components must be used within a Disclosure provider'
      );

      consoleError.mockRestore();
    });

    it('throws error when DisclosureContent is used outside Disclosure', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<DisclosureContent>Answer</DisclosureContent>);
      }).toThrow(
        'Disclosure components must be used within a Disclosure provider'
      );

      consoleError.mockRestore();
    });
  });

  describe('Custom props and refs', () => {
    it('forwards refs correctly', () => {
      const disclosureRef = React.createRef<HTMLDivElement>();
      const triggerRef = React.createRef<HTMLButtonElement>();
      const contentRef = React.createRef<HTMLDivElement>();

      render(
        <Disclosure ref={disclosureRef} defaultOpen>
          <DisclosureTrigger ref={triggerRef}>Question</DisclosureTrigger>
          <DisclosureContent ref={contentRef}>Answer</DisclosureContent>
        </Disclosure>
      );

      expect(disclosureRef.current).toBeInstanceOf(HTMLDivElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it('passes through custom props', () => {
      render(
        <Disclosure data-testid="disclosure" className="custom-class">
          <DisclosureTrigger data-testid="trigger" className="custom-trigger">
            Question
          </DisclosureTrigger>
          <DisclosureContent data-testid="content" className="custom-content">
            Answer
          </DisclosureContent>
        </Disclosure>
      );

      expect(screen.getByTestId('disclosure')).toHaveClass('custom-class');
      expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger');
    });

    it('handles custom onClick events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Disclosure>
          <DisclosureTrigger onClick={handleClick}>Question</DisclosureTrigger>
          <DisclosureContent>Answer</DisclosureContent>
        </Disclosure>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
