import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Collapse,
  CollapseTrigger,
  CollapseContent,
  RecipeCollapse,
  KitchenTipsCollapse,
  FAQCollapse,
  IngredientNotesCollapse,
  CollapseGroup,
} from '@/components/ui/collapse';

expect.extend(toHaveNoViolations);

describe('Collapse', () => {
  describe('Basic functionality', () => {
    it('renders without crashing', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      expect(
        screen.getByRole('button', { name: 'Expand me' })
      ).toBeInTheDocument();
    });

    it('renders with trigger prop', () => {
      render(
        <Collapse trigger="Click to expand">
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      expect(
        screen.getByRole('button', { name: 'Click to expand' })
      ).toBeInTheDocument();
    });

    it('is collapsed by default', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Content here')).not.toBeInTheDocument();
    });

    it('can be expanded by default', () => {
      render(
        <Collapse defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });

    it('toggles expanded/collapsed when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');

      // Initially collapsed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Content here')).not.toBeInTheDocument();

      // Click to expand
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content here')).toBeInTheDocument();

      // Click to collapse
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Content here')).not.toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');

      // Focus the trigger
      await user.tab();
      expect(trigger).toHaveFocus();

      // Press Enter to expand
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Press Space to collapse
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Controlled mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      const ControlledCollapse = () => {
        const [open, setOpen] = React.useState(false);

        React.useEffect(() => {
          handleOpenChange(open);
        }, [open]);

        return (
          <Collapse open={open} onOpenChange={setOpen}>
            <CollapseTrigger>Expand me</CollapseTrigger>
            <CollapseContent>Content here</CollapseContent>
          </Collapse>
        );
      };

      render(<ControlledCollapse />);

      const trigger = screen.getByRole('button');

      // Initially collapsed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(handleOpenChange).toHaveBeenLastCalledWith(false);

      // Click to expand
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    });

    it('respects external control', () => {
      const TestComponent = ({ open }: { open: boolean }) => (
        <Collapse open={open}>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const { rerender } = render(<TestComponent open={false} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      expect(screen.queryByText('Content here')).not.toBeInTheDocument();

      rerender(<TestComponent open={true} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });

    it('calls onOpenChange when controlled', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      render(
        <Collapse open={false} onOpenChange={handleOpenChange}>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      await user.click(screen.getByRole('button'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Disabled state', () => {
    it('does not expand when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Collapse disabled>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Content here')).not.toBeInTheDocument();
    });

    it('can disable the trigger independently', async () => {
      const user = userEvent.setup();

      render(
        <Collapse>
          <CollapseTrigger disabled>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('ignores disabled trigger when collapse is not disabled', async () => {
      const user = userEvent.setup();

      render(
        <Collapse>
          <CollapseTrigger disabled={false}>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).not.toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Variants and styling', () => {
    it('applies variant classes correctly', () => {
      const { rerender } = render(
        <Collapse variant="default" data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      let container = screen.getByTestId('collapse');
      expect(container).toHaveClass('bg-white');

      rerender(
        <Collapse variant="outlined" data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      container = screen.getByTestId('collapse');
      expect(container).toHaveClass('bg-transparent');

      rerender(
        <Collapse variant="elevated" data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      container = screen.getByTestId('collapse');
      expect(container).toHaveClass('shadow-md');

      rerender(
        <Collapse variant="minimal" data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      container = screen.getByTestId('collapse');
      expect(container).toHaveClass('border-0');

      rerender(
        <Collapse variant="card" data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      container = screen.getByTestId('collapse');
      expect(container).toHaveClass('bg-gray-50');
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(
        <Collapse size="sm">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      let trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('text-sm');

      rerender(
        <Collapse size="lg">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('text-lg');
    });

    it('applies custom className correctly', () => {
      render(
        <Collapse className="custom-collapse" data-testid="collapse">
          <CollapseTrigger className="custom-trigger">
            Expand me
          </CollapseTrigger>
          <CollapseContent className="custom-content">
            Content here
          </CollapseContent>
        </Collapse>
      );

      expect(screen.getByTestId('collapse')).toHaveClass('custom-collapse');
      expect(screen.getByRole('button')).toHaveClass('custom-trigger');
    });
  });

  describe('Icons and triggers', () => {
    it('shows default chevron icon by default', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('can hide the icon', () => {
      render(
        <Collapse>
          <CollapseTrigger showIcon={false}>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('can use custom icon', () => {
      render(
        <Collapse>
          <CollapseTrigger icon={<span data-testid="custom-icon">★</span>}>
            Expand me
          </CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      // Should not show default chevron when custom icon is provided
      const chevronSvg = screen.getByRole('button').querySelector('svg');
      expect(chevronSvg).not.toBeInTheDocument();
    });

    it('positions icon correctly', () => {
      const { rerender } = render(
        <Collapse>
          <CollapseTrigger iconPosition="left">Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      let svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('mr-2');

      rerender(
        <Collapse>
          <CollapseTrigger iconPosition="right">Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('ml-2');
    });

    it('rotates icon when expanded', async () => {
      const user = userEvent.setup();

      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('rotate-0');

      await user.click(screen.getByRole('button'));
      expect(svg).toHaveClass('rotate-180');
    });

    it('supports different animation speeds for icon', () => {
      const { rerender } = render(
        <Collapse>
          <CollapseTrigger animationSpeed="fast">Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      let svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('duration-150');

      rerender(
        <Collapse>
          <CollapseTrigger animationSpeed="slow">Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('duration-300');
    });
  });

  describe('Content mounting and animations', () => {
    it('does not render content when collapsed by default', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      expect(screen.queryByText('Content here')).not.toBeInTheDocument();
    });

    it('force mounts content when specified', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent forceMount>Content here</CollapseContent>
        </Collapse>
      );

      const content = screen.getByText('Content here');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-state', 'closed');
    });

    it('applies animation duration correctly', () => {
      render(
        <Collapse animationDuration={500} defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const content = screen.getByText('Content here');
      expect(content).toHaveStyle({ '--collapse-duration': '500ms' });
    });

    it('supports custom animation duration on content', () => {
      render(
        <Collapse defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent animationDuration={750}>
            Content here
          </CollapseContent>
        </Collapse>
      );

      const content = screen.getByText('Content here');
      expect(content).toHaveStyle({ '--collapse-duration': '750ms' });
    });

    it('supports different animation speeds on content', () => {
      const { rerender } = render(
        <Collapse defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent animationSpeed="fast">Content here</CollapseContent>
        </Collapse>
      );

      let content = screen.getByText('Content here');
      expect(content).toHaveClass('duration-150');

      rerender(
        <Collapse defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent animationSpeed="slow">Content here</CollapseContent>
        </Collapse>
      );

      content = screen.getByText('Content here');
      expect(content).toHaveClass('duration-500');
    });

    it('supports different animation easing functions', () => {
      render(
        <Collapse defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent animationEasing="ease-in">
            Content here
          </CollapseContent>
        </Collapse>
      );

      const content = screen.getByText('Content here');
      expect(content).toHaveStyle({ '--collapse-timing': 'ease-in' });
    });

    it('supports collapsed height configuration', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent collapsedHeight={50} forceMount>
            Content here
          </CollapseContent>
        </Collapse>
      );

      const content = screen.getByText('Content here');
      expect(content).toHaveStyle({ '--collapse-height': '50' });
    });

    it('can disable smooth transitions', () => {
      render(
        <Collapse smoothTransitions={false} defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const content = screen.getByText('Content here');
      expect(content.style.transitionDuration).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');

      const contentId = trigger.getAttribute('aria-controls');
      expect(contentId).toBeTruthy();
    });

    it('updates ARIA attributes when expanded', async () => {
      const user = userEvent.setup();

      render(
        <Collapse>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const content = screen.getByText('Content here');
      expect(content).toHaveAttribute('role', 'region');
      expect(content).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('supports custom aria-label', () => {
      render(
        <Collapse>
          <CollapseTrigger ariaLabel="Custom expand label">
            Expand me
          </CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'Custom expand label');
    });

    it('maintains proper tab order', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <Collapse>
            <CollapseTrigger>Expand me</CollapseTrigger>
            <CollapseContent>
              <button>Inside content</button>
            </CollapseContent>
          </Collapse>
          <button>After</button>
        </div>
      );

      // Tab through elements
      await user.tab();
      expect(screen.getByText('Before')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Expand me' })).toHaveFocus();

      await user.tab();
      expect(screen.getByText('After')).toHaveFocus();

      // Expand and check content is accessible
      await user.click(screen.getByRole('button', { name: 'Expand me' }));

      // Tab to content button inside
      await user.tab();
      expect(screen.getByText('Inside content')).toHaveFocus();

      // Tab back to After button
      await user.tab();
      expect(screen.getByText('After')).toHaveFocus();
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <Collapse defaultOpen>
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('RecipeCollapse', () => {
    it('renders with proper section styling', () => {
      render(
        <RecipeCollapse section="ingredients" data-testid="recipe-collapse">
          <CollapseTrigger>Ingredients</CollapseTrigger>
          <CollapseContent>Ingredient list</CollapseContent>
        </RecipeCollapse>
      );

      const container = screen.getByTestId('recipe-collapse');
      expect(container).toHaveClass('border-l-green-500');
    });

    it('shows count and count label when provided', () => {
      render(
        <RecipeCollapse section="ingredients" count={5}>
          <CollapseTrigger>Ingredients</CollapseTrigger>
          <CollapseContent>Ingredient list</CollapseContent>
        </RecipeCollapse>
      );

      expect(screen.getByText('5 ingredients')).toBeInTheDocument();
    });

    it('shows custom count label', () => {
      render(
        <RecipeCollapse section="equipment" count={3} countLabel="tools">
          <CollapseTrigger>Equipment</CollapseTrigger>
          <CollapseContent>Equipment list</CollapseContent>
        </RecipeCollapse>
      );

      expect(screen.getByText('3 tools')).toBeInTheDocument();
    });

    it('shows estimated time when provided', () => {
      render(
        <RecipeCollapse section="ingredients" estimatedTime="5 min prep">
          <CollapseTrigger>Ingredients</CollapseTrigger>
          <CollapseContent>Ingredient list</CollapseContent>
        </RecipeCollapse>
      );

      expect(screen.getByText('• 5 min prep')).toBeInTheDocument();
    });

    it('renders section-specific icon', () => {
      render(
        <RecipeCollapse section="instructions">
          <CollapseTrigger>Instructions</CollapseTrigger>
          <CollapseContent>Instruction list</CollapseContent>
        </RecipeCollapse>
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('can use custom section icon', () => {
      render(
        <RecipeCollapse
          section="notes"
          sectionIcon={<span data-testid="custom-section-icon">📝</span>}
        >
          <CollapseTrigger>Notes</CollapseTrigger>
          <CollapseContent>Note content</CollapseContent>
        </RecipeCollapse>
      );

      expect(screen.getByTestId('custom-section-icon')).toBeInTheDocument();
    });

    it('applies correct styling for different sections', () => {
      const sections = [
        { section: 'ingredients', expectedClass: 'border-l-green-500' },
        { section: 'instructions', expectedClass: 'border-l-blue-500' },
        { section: 'nutrition', expectedClass: 'border-l-purple-500' },
        { section: 'notes', expectedClass: 'border-l-yellow-500' },
        { section: 'tips', expectedClass: 'border-l-orange-500' },
        { section: 'variations', expectedClass: 'border-l-pink-500' },
        { section: 'equipment', expectedClass: 'border-l-indigo-500' },
        { section: 'timeline', expectedClass: 'border-l-red-500' },
      ] as const;

      sections.forEach(({ section, expectedClass }) => {
        const { container } = render(
          <RecipeCollapse section={section} data-testid={`recipe-${section}`}>
            <CollapseTrigger>{section}</CollapseTrigger>
            <CollapseContent>Content</CollapseContent>
          </RecipeCollapse>
        );

        const element = container.querySelector(
          `[data-testid="recipe-${section}"]`
        );
        expect(element).toHaveClass(expectedClass);

        // Clean up for next iteration
        container.remove();
      });
    });
  });

  describe('KitchenTipsCollapse', () => {
    it('shows difficulty badge', () => {
      render(
        <KitchenTipsCollapse tipType="technique" difficulty="advanced">
          <CollapseTrigger>Advanced technique</CollapseTrigger>
          <CollapseContent>Technique details</CollapseContent>
        </KitchenTipsCollapse>
      );

      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('shows estimated time when provided', () => {
      render(
        <KitchenTipsCollapse estimatedTime="5 min">
          <CollapseTrigger>Quick tip</CollapseTrigger>
          <CollapseContent>Tip content</CollapseContent>
        </KitchenTipsCollapse>
      );

      expect(screen.getByText('5 min')).toBeInTheDocument();
    });

    it('shows pro tip badge when specified', () => {
      render(
        <KitchenTipsCollapse proTip>
          <CollapseTrigger>Pro technique</CollapseTrigger>
          <CollapseContent>Advanced tip</CollapseContent>
        </KitchenTipsCollapse>
      );

      expect(screen.getByText('Pro Tip')).toBeInTheDocument();
    });

    it('applies correct difficulty styling', () => {
      const difficulties = [
        { difficulty: 'beginner', expectedColor: 'text-green-800' },
        { difficulty: 'intermediate', expectedColor: 'text-yellow-800' },
        { difficulty: 'advanced', expectedColor: 'text-red-800' },
      ] as const;

      difficulties.forEach(({ difficulty, expectedColor }) => {
        const { container } = render(
          <KitchenTipsCollapse difficulty={difficulty}>
            <CollapseTrigger>Tip</CollapseTrigger>
            <CollapseContent>Content</CollapseContent>
          </KitchenTipsCollapse>
        );

        const badge = container.querySelector('.rounded-full');
        expect(badge).toHaveClass(expectedColor);

        // Clean up for next iteration
        container.remove();
      });
    });
  });

  describe('FAQCollapse', () => {
    it('renders question in trigger', () => {
      render(
        <FAQCollapse question="How long does this take?">
          <CollapseContent>Answer content</CollapseContent>
        </FAQCollapse>
      );

      expect(screen.getByText('How long does this take?')).toBeInTheDocument();
    });

    it('shows featured badge when featured', () => {
      render(
        <FAQCollapse question="Featured question" featured>
          <CollapseContent>Answer</CollapseContent>
        </FAQCollapse>
      );

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('applies featured styling when featured', () => {
      render(
        <FAQCollapse
          question="Featured question"
          featured
          data-testid="faq-collapse"
        >
          <CollapseContent>Answer</CollapseContent>
        </FAQCollapse>
      );

      const container = screen.getByTestId('faq-collapse');
      expect(container).toHaveClass(
        'ring-2',
        'ring-blue-200',
        'border-blue-300'
      );
    });

    it('supports custom question ID', () => {
      render(
        <FAQCollapse question="Test question" questionId="custom-faq-1">
          <CollapseContent>Answer</CollapseContent>
        </FAQCollapse>
      );

      // The content should have the custom ID when expanded
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Answer')).toHaveAttribute('id', 'custom-faq-1');
    });
  });

  describe('IngredientNotesCollapse', () => {
    it('renders with ingredient name', () => {
      render(
        <IngredientNotesCollapse ingredient="Butter" noteType="substitution">
          <CollapseTrigger>Substitution options</CollapseTrigger>
          <CollapseContent>Use coconut oil</CollapseContent>
        </IngredientNotesCollapse>
      );

      expect(screen.getByText('(Butter)')).toBeInTheDocument();
    });

    it('shows importance badge', () => {
      render(
        <IngredientNotesCollapse ingredient="Eggs" importance="high">
          <CollapseTrigger>Important note</CollapseTrigger>
          <CollapseContent>Critical information</CollapseContent>
        </IngredientNotesCollapse>
      );

      expect(screen.getByText('Important')).toBeInTheDocument();
    });

    it('shows allergen warning when specified', () => {
      render(
        <IngredientNotesCollapse ingredient="Peanuts" allergenWarning>
          <CollapseTrigger>Allergen info</CollapseTrigger>
          <CollapseContent>Contains peanuts</CollapseContent>
        </IngredientNotesCollapse>
      );

      expect(screen.getByText('Allergen')).toBeInTheDocument();
    });

    it('applies allergen warning styling', () => {
      render(
        <IngredientNotesCollapse
          ingredient="Nuts"
          allergenWarning
          data-testid="ingredient-collapse"
        >
          <CollapseTrigger>Warning</CollapseTrigger>
          <CollapseContent>Contains allergens</CollapseContent>
        </IngredientNotesCollapse>
      );

      const container = screen.getByTestId('ingredient-collapse');
      expect(container).toHaveClass('border-red-300', 'bg-red-50');
    });

    it('applies correct importance styling', () => {
      const importanceLevels = [
        { importance: 'low', expectedColor: 'text-gray-700' },
        { importance: 'medium', expectedColor: 'text-blue-700' },
        { importance: 'high', expectedColor: 'text-yellow-700' },
      ] as const;

      importanceLevels.forEach(({ importance, expectedColor }) => {
        const { container } = render(
          <IngredientNotesCollapse ingredient="Test" importance={importance}>
            <CollapseTrigger>Note</CollapseTrigger>
            <CollapseContent>Content</CollapseContent>
          </IngredientNotesCollapse>
        );

        const badge = container.querySelector('.rounded-full');
        expect(badge).toHaveClass(expectedColor);

        // Clean up for next iteration
        container.remove();
      });
    });
  });

  describe('CollapseGroup', () => {
    it('renders multiple collapses with proper spacing', () => {
      render(
        <CollapseGroup spacing="normal">
          <Collapse>
            <CollapseTrigger>Question 1</CollapseTrigger>
            <CollapseContent>Answer 1</CollapseContent>
          </Collapse>
          <Collapse>
            <CollapseTrigger>Question 2</CollapseTrigger>
            <CollapseContent>Answer 2</CollapseContent>
          </Collapse>
        </CollapseGroup>
      );

      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    it('applies spacing classes correctly', () => {
      const spacings = [
        { spacing: 'tight', expectedClass: 'space-y-1' },
        { spacing: 'normal', expectedClass: 'space-y-2' },
        { spacing: 'loose', expectedClass: 'space-y-4' },
      ] as const;

      spacings.forEach(({ spacing, expectedClass }) => {
        const { container } = render(
          <CollapseGroup spacing={spacing}>
            <Collapse>
              <CollapseTrigger>Question</CollapseTrigger>
              <CollapseContent>Answer</CollapseContent>
            </Collapse>
          </CollapseGroup>
        );

        expect(container.firstChild).toHaveClass(expectedClass);

        // Clean up for next iteration
        container.remove();
      });
    });

    it('allows multiple collapses to be open by default', async () => {
      const user = userEvent.setup();

      render(
        <CollapseGroup allowMultiple>
          <Collapse>
            <CollapseTrigger>Question 1</CollapseTrigger>
            <CollapseContent>Answer 1</CollapseContent>
          </Collapse>
          <Collapse>
            <CollapseTrigger>Question 2</CollapseTrigger>
            <CollapseContent>Answer 2</CollapseContent>
          </Collapse>
        </CollapseGroup>
      );

      // Open both collapses
      await user.click(screen.getByText('Question 1'));
      await user.click(screen.getByText('Question 2'));

      expect(screen.getByText('Answer 1')).toBeInTheDocument();
      expect(screen.getByText('Answer 2')).toBeInTheDocument();
    });

    it('restricts to single open collapse when allowMultiple is false', async () => {
      const user = userEvent.setup();

      render(
        <CollapseGroup allowMultiple={false}>
          <Collapse>
            <CollapseTrigger>Question 1</CollapseTrigger>
            <CollapseContent>Answer 1</CollapseContent>
          </Collapse>
          <Collapse>
            <CollapseTrigger>Question 2</CollapseTrigger>
            <CollapseContent>Answer 2</CollapseContent>
          </Collapse>
        </CollapseGroup>
      );

      // Open first collapse
      await user.click(screen.getByText('Question 1'));
      expect(screen.getByText('Answer 1')).toBeInTheDocument();

      // Open second collapse (should close first)
      await user.click(screen.getByText('Question 2'));
      expect(screen.queryByText('Answer 1')).not.toBeInTheDocument();
      expect(screen.getByText('Answer 2')).toBeInTheDocument();
    });

    it('supports default open items', () => {
      render(
        <CollapseGroup defaultOpenItems={[0]}>
          <Collapse>
            <CollapseTrigger>Question 1</CollapseTrigger>
            <CollapseContent>Answer 1</CollapseContent>
          </Collapse>
          <Collapse>
            <CollapseTrigger>Question 2</CollapseTrigger>
            <CollapseContent>Answer 2</CollapseContent>
          </Collapse>
        </CollapseGroup>
      );

      expect(screen.getByText('Answer 1')).toBeInTheDocument();
      expect(screen.queryByText('Answer 2')).not.toBeInTheDocument();
    });

    it('supports controlled open items', async () => {
      const user = userEvent.setup();
      const handleOpenItemsChange = jest.fn();

      render(
        <CollapseGroup
          openItems={[1]}
          onOpenItemsChange={handleOpenItemsChange}
        >
          <Collapse>
            <CollapseTrigger>Question 1</CollapseTrigger>
            <CollapseContent>Answer 1</CollapseContent>
          </Collapse>
          <Collapse>
            <CollapseTrigger>Question 2</CollapseTrigger>
            <CollapseContent>Answer 2</CollapseContent>
          </Collapse>
        </CollapseGroup>
      );

      expect(screen.queryByText('Answer 1')).not.toBeInTheDocument();
      expect(screen.getByText('Answer 2')).toBeInTheDocument();

      await user.click(screen.getByText('Question 1'));
      expect(handleOpenItemsChange).toHaveBeenCalledWith([1, 0]);
    });
  });

  describe('Error handling', () => {
    it('throws error when CollapseTrigger is used outside Collapse', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<CollapseTrigger>Expand me</CollapseTrigger>);
      }).toThrow('Collapse components must be used within a Collapse provider');

      consoleError.mockRestore();
    });

    it('throws error when CollapseContent is used outside Collapse', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<CollapseContent>Content here</CollapseContent>);
      }).toThrow('Collapse components must be used within a Collapse provider');

      consoleError.mockRestore();
    });
  });

  describe('Custom props and refs', () => {
    it('forwards refs correctly', () => {
      const collapseRef = React.createRef<HTMLDivElement>();
      const triggerRef = React.createRef<HTMLButtonElement>();
      const contentRef = React.createRef<HTMLDivElement>();

      render(
        <Collapse ref={collapseRef} defaultOpen>
          <CollapseTrigger ref={triggerRef}>Expand me</CollapseTrigger>
          <CollapseContent ref={contentRef}>Content here</CollapseContent>
        </Collapse>
      );

      expect(collapseRef.current).toBeInstanceOf(HTMLDivElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it('passes through custom props', () => {
      render(
        <Collapse data-testid="collapse" className="custom-class">
          <CollapseTrigger data-testid="trigger" className="custom-trigger">
            Expand me
          </CollapseTrigger>
          <CollapseContent data-testid="content" className="custom-content">
            Content here
          </CollapseContent>
        </Collapse>
      );

      expect(screen.getByTestId('collapse')).toHaveClass('custom-class');
      expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger');
    });

    it('handles custom onClick events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Collapse>
          <CollapseTrigger onClick={handleClick}>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('preserves onOpenChange callback from child components', async () => {
      const user = userEvent.setup();
      const childOnOpenChange = jest.fn();

      render(
        <CollapseGroup allowMultiple={false}>
          <Collapse onOpenChange={childOnOpenChange}>
            <CollapseTrigger>Question 1</CollapseTrigger>
            <CollapseContent>Answer 1</CollapseContent>
          </Collapse>
          <Collapse>
            <CollapseTrigger>Question 2</CollapseTrigger>
            <CollapseContent>Answer 2</CollapseContent>
          </Collapse>
        </CollapseGroup>
      );

      await user.click(screen.getByText('Question 1'));
      expect(childOnOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Data attributes and states', () => {
    it('sets correct data-state attributes', async () => {
      const user = userEvent.setup();

      render(
        <Collapse data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const container = screen.getByTestId('collapse');
      const trigger = screen.getByRole('button');

      // Initially closed
      expect(container).toHaveAttribute('data-state', 'closed');
      expect(trigger).toHaveAttribute('data-state', 'closed');

      // After opening
      await user.click(trigger);
      expect(container).toHaveAttribute('data-state', 'open');
      expect(trigger).toHaveAttribute('data-state', 'open');

      const content = screen.getByText('Content here');
      expect(content).toHaveAttribute('data-state', 'open');
    });

    it('sets data-disabled attribute when disabled', () => {
      render(
        <Collapse disabled data-testid="collapse">
          <CollapseTrigger>Expand me</CollapseTrigger>
          <CollapseContent>Content here</CollapseContent>
        </Collapse>
      );

      const container = screen.getByTestId('collapse');
      expect(container).toHaveAttribute('data-disabled', 'true');
    });
  });
});
