import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  RecipeSection,
  RecipeIngredients,
  RecipeInstructions,
} from '@/components/ui/accordion';

// Mock ResizeObserver for JSDOM compatibility
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Accordion', () => {
  it('renders correctly with default props', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Item</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(
      <Accordion variant="outlined">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Item</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(container.firstChild).toHaveClass('border-2');
  });

  it('applies size classes correctly', () => {
    const { container } = render(
      <Accordion size="lg">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Item</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(container.firstChild).toHaveClass('text-lg');
  });

  it('handles single selection correctly', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText('Item 1');
    const trigger2 = screen.getByText('Item 2');

    await user.click(trigger1);
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(trigger2);
    const content1 = screen.getByText('Content 1').closest('[role="region"]');
    const content2 = screen.getByText('Content 2').closest('[role="region"]');
    expect(content1).toHaveClass('opacity-0', 'max-h-0');
    expect(content2).not.toHaveClass('opacity-0', 'max-h-0');
  });

  it('handles multiple selection correctly', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText('Item 1');
    const trigger2 = screen.getByText('Item 2');

    await user.click(trigger1);
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(trigger2);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('respects defaultValue prop', () => {
    render(
      <Accordion defaultValue="item-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const content1 = screen.getByText('Content 1').closest('[role="region"]');
    const content2 = screen.getByText('Content 2').closest('[role="region"]');
    expect(content2).not.toHaveClass('opacity-0', 'max-h-0');
    expect(content1).toHaveClass('opacity-0', 'max-h-0');
  });

  it('handles controlled value prop', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Accordion value="item-1" onValueChange={onValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(screen.getByText('Item 2'));
    expect(onValueChange).toHaveBeenCalledWith('item-2');
  });

  it('supports collapsible behavior', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible={true}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText('Item 1');

    await user.click(trigger);
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(trigger);
    const content1 = screen.getByText('Content 1').closest('[role="region"]');
    expect(content1).toHaveClass('opacity-0', 'max-h-0');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Accordion className="custom-class">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Item</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('AccordionItem', () => {
  it('renders children correctly', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Test Trigger')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const item = screen.getByText('Disabled Item').closest('div');
    expect(item).toHaveClass('opacity-50', 'pointer-events-none');
  });

  it('passes props to children correctly', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('AccordionTrigger', () => {
  it('renders with correct ARIA attributes', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows correct icon state when closed', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('rotate-0');
  });

  it('shows correct icon state when open', () => {
    const { container } = render(
      <Accordion defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('rotate-180');
  });

  it('supports custom icon', () => {
    const customIcon = <span data-testid="custom-icon">+</span>;

    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger icon={customIcon}>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('supports icon position', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger iconPosition="left">Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('mr-2');
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();

    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger disabled>Disabled Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    const content = screen.getByText('Content').closest('[role="region"]');
    expect(content).toHaveClass('opacity-0', 'max-h-0');
  });
});

describe('AccordionContent', () => {
  it('shows content when open', () => {
    render(
      <Accordion defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('hides content when closed', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const content = screen.getByText('Test Content').closest('[role="region"]');
    expect(content).toHaveClass('opacity-0', 'max-h-0');
  });

  it('has correct ARIA attributes', () => {
    render(
      <Accordion defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Trigger</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const content = screen.getByText('Test Content').closest('[role="region"]');
    expect(content).toHaveAttribute('role', 'region');
  });
});

describe('RecipeSection', () => {
  it('renders recipe section with title and icon', () => {
    render(
      <Accordion>
        <RecipeSection
          value="ingredients"
          title="Ingredients"
          section="ingredients"
          count={5}
        >
          <p>Ingredient list content</p>
        </RecipeSection>
      </Accordion>
    );

    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies correct section styling for ingredients', () => {
    const { container } = render(
      <Accordion>
        <RecipeSection
          value="ingredients"
          title="Ingredients"
          section="ingredients"
        >
          <p>Content</p>
        </RecipeSection>
      </Accordion>
    );

    expect(
      container.querySelector('[class*="border-l-green-500"]')
    ).toBeInTheDocument();
  });

  it('applies correct section styling for instructions', () => {
    const { container } = render(
      <Accordion>
        <RecipeSection
          value="instructions"
          title="Instructions"
          section="instructions"
        >
          <p>Content</p>
        </RecipeSection>
      </Accordion>
    );

    expect(
      container.querySelector('[class*="border-l-blue-500"]')
    ).toBeInTheDocument();
  });

  it('supports custom icon', () => {
    const customIcon = <span data-testid="custom-icon">🍳</span>;

    render(
      <Accordion>
        <RecipeSection
          value="cooking"
          title="Cooking"
          section="instructions"
          icon={customIcon}
        >
          <p>Content</p>
        </RecipeSection>
      </Accordion>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <Accordion>
        <RecipeSection
          value="ingredients"
          title="Ingredients"
          section="ingredients"
          disabled
        >
          <p>Content</p>
        </RecipeSection>
      </Accordion>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
  });
});

describe('RecipeIngredients', () => {
  const sampleIngredients = [
    {
      id: '1',
      name: 'flour',
      amount: '2',
      unit: 'cups',
      category: 'dry ingredients',
    },
    {
      id: '2',
      name: 'milk',
      amount: '1',
      unit: 'cup',
      category: 'wet ingredients',
    },
    {
      id: '3',
      name: 'salt',
      amount: '1',
      unit: 'tsp',
      optional: true,
    },
  ];

  it('renders ingredients list correctly', () => {
    render(<RecipeIngredients ingredients={sampleIngredients} />);

    expect(screen.getByText('flour')).toBeInTheDocument();
    expect(screen.getByText('2 cups')).toBeInTheDocument();
    expect(screen.getByText('milk')).toBeInTheDocument();
    expect(screen.getByText('1 cup')).toBeInTheDocument();
  });

  it('shows optional ingredients correctly', () => {
    render(<RecipeIngredients ingredients={sampleIngredients} />);

    expect(screen.getByText('salt (optional)')).toBeInTheDocument();
  });

  it('groups ingredients by category', () => {
    render(<RecipeIngredients ingredients={sampleIngredients} />);

    expect(screen.getByText('dry ingredients')).toBeInTheDocument();
    expect(screen.getByText('wet ingredients')).toBeInTheDocument();
  });

  it('shows checkboxes when enabled', () => {
    render(
      <RecipeIngredients
        ingredients={sampleIngredients}
        showCheckboxes={true}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('handles checkbox changes', async () => {
    const onItemCheck = jest.fn();
    const user = userEvent.setup();

    render(
      <RecipeIngredients
        ingredients={sampleIngredients}
        showCheckboxes={true}
        onItemCheck={onItemCheck}
      />
    );

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);

    expect(onItemCheck).toHaveBeenCalledWith('1', true);
  });

  it('shows checked items correctly', () => {
    render(
      <RecipeIngredients
        ingredients={sampleIngredients}
        showCheckboxes={true}
        checkedItems={['1', '2']}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('applies layout variants correctly', () => {
    const { container } = render(
      <RecipeIngredients ingredients={sampleIngredients} layout="compact" />
    );

    expect(container.firstChild).toHaveClass('space-y-1');
  });
});

describe('RecipeInstructions', () => {
  const sampleInstructions = [
    {
      id: '1',
      step: 1,
      text: 'Preheat oven to 350°F',
      temperature: '350°F',
      time: '5 min',
    },
    {
      id: '2',
      step: 2,
      text: 'Mix ingredients together',
      time: '3 min',
      notes: "Don't overmix",
    },
    {
      id: '3',
      step: 3,
      text: 'Bake until golden',
      time: '25 min',
    },
  ];

  it('renders instructions list correctly', () => {
    render(<RecipeInstructions instructions={sampleInstructions} />);

    expect(screen.getByText('Preheat oven to 350°F')).toBeInTheDocument();
    expect(screen.getByText('Mix ingredients together')).toBeInTheDocument();
    expect(screen.getByText('Bake until golden')).toBeInTheDocument();
  });

  it('shows step numbers by default', () => {
    render(<RecipeInstructions instructions={sampleInstructions} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides step numbers when disabled', () => {
    render(
      <RecipeInstructions
        instructions={sampleInstructions}
        showStepNumbers={false}
      />
    );

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('shows timing and temperature information', () => {
    render(<RecipeInstructions instructions={sampleInstructions} />);

    expect(screen.getByText('350°F')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
    expect(screen.getByText('3 min')).toBeInTheDocument();
  });

  it('shows notes when available', () => {
    render(<RecipeInstructions instructions={sampleInstructions} />);

    expect(screen.getByText("💡 Don't overmix")).toBeInTheDocument();
  });

  it('highlights current step', () => {
    const { container } = render(
      <RecipeInstructions instructions={sampleInstructions} currentStep={2} />
    );

    const highlightedSteps = container.querySelectorAll(
      '[class*="bg-yellow-100"]'
    );
    expect(highlightedSteps).toHaveLength(1);
  });

  it('shows completed steps with checkmarks', () => {
    const { container } = render(
      <RecipeInstructions instructions={sampleInstructions} currentStep={3} />
    );

    const completedSteps = container.querySelectorAll(
      'svg[viewBox="0 0 20 20"]'
    );
    expect(completedSteps.length).toBeGreaterThan(0);
  });

  it('handles step click events', async () => {
    const onStepClick = jest.fn();
    const user = userEvent.setup();

    render(
      <RecipeInstructions
        instructions={sampleInstructions}
        onStepClick={onStepClick}
      />
    );

    const stepNumber = screen.getByText('2');
    await user.click(stepNumber);

    expect(onStepClick).toHaveBeenCalledWith(2);
  });

  it('applies layout variants correctly', () => {
    const { container } = render(
      <RecipeInstructions instructions={sampleInstructions} layout="spacious" />
    );

    expect(container.firstChild).toHaveClass('space-y-3');
  });
});

describe('Accordion Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Item</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const content = screen.getByText('Test Content').closest('[role="region"]');
    expect(content).toHaveAttribute('role', 'region');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Test Item</AccordionTrigger>
          <AccordionContent>Test Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');

    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides meaningful labels for screen readers', () => {
    render(
      <Accordion>
        <RecipeSection
          value="ingredients"
          title="Recipe Ingredients"
          section="ingredients"
        >
          <p>Ingredient content</p>
        </RecipeSection>
      </Accordion>
    );

    expect(screen.getByText('Recipe Ingredients')).toBeInTheDocument();
  });
});
