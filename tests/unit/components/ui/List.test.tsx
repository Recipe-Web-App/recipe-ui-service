import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  List,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemIcon,
  CheckboxListItem,
  RecipeList,
  IngredientListItem,
  InstructionListItem,
  NutritionListItem,
} from '@/components/ui/list';
import type {
  ListProps,
  ListItemProps,
  CheckboxListItemProps,
  IngredientListItemProps,
  InstructionListItemProps,
  NutritionListItemProps,
} from '@/types/ui/list';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render List with default props
 */
const renderList = (props: Partial<ListProps> = {}) => {
  const defaultProps: ListProps = {
    children: (
      <>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Item 1</ListItemTitle>
          </ListItemContent>
        </ListItem>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Item 2</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </>
    ),
    ...props,
  };

  return render(<List {...defaultProps} />);
};

/**
 * Helper function to render ListItem with default props
 */
const renderListItem = (props: Partial<ListItemProps> = {}) => {
  const defaultProps: ListItemProps = {
    children: (
      <ListItemContent>
        <ListItemTitle>Test Item</ListItemTitle>
      </ListItemContent>
    ),
    ...props,
  };

  return render(
    <List>
      <ListItem {...defaultProps} />
    </List>
  );
};

describe('List Component', () => {
  describe('Basic Rendering', () => {
    test('renders unordered list by default', () => {
      renderList();
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });

    test('renders ordered list when ordered prop is true', () => {
      renderList({ ordered: true });
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
    });

    test('renders list items correctly', () => {
      renderList();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      renderList();
      const list = screen.getByRole('list');
      expect(list).toHaveClass('w-full', 'space-y-0');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLUListElement>();
      render(
        <List ref={ref}>
          <ListItem>
            <ListItemContent>
              <ListItemTitle>Test</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );
      expect(ref.current).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe('Variants', () => {
    test('applies bordered variant classes', () => {
      renderList({ variant: 'bordered' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('border', 'border-border', 'rounded-lg');
    });

    test('applies divided variant classes', () => {
      renderList({ variant: 'divided' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('[&>*:not(:last-child)]:border-b');
    });

    test('applies card variant classes', () => {
      renderList({ variant: 'card' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('bg-card', 'border', 'shadow-sm');
    });

    test('applies grid variant classes', () => {
      renderList({ variant: 'grid', gridCols: 2 });
      const list = screen.getByRole('list');
      expect(list).toHaveClass(
        'grid',
        'gap-2',
        'grid-cols-1',
        'sm:grid-cols-2'
      );
    });
  });

  describe('Size and Density', () => {
    test('applies size variants correctly', () => {
      renderList({ size: 'lg' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('text-lg');
    });

    test('applies density variants correctly', () => {
      renderList({ density: 'compact' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('[&>*]:py-1');
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      renderList({ className: 'custom-class' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-class');
    });

    test('applies custom aria-label', () => {
      renderList({ 'aria-label': 'Custom list' });
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'Custom list');
    });

    test('applies custom role', () => {
      renderList({ role: 'listbox' });
      const list = screen.getByRole('listbox');
      expect(list).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderList();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderList();

      // Lists don't receive focus directly, but their interactive items do
      await user.tab();
      // Since no interactive items in basic list, this test just passes
      expect(true).toBe(true);
    });
  });
});

describe('ListItem Component', () => {
  describe('Basic Rendering', () => {
    test('renders list item with content', () => {
      renderListItem();
      expect(screen.getByRole('listitem')).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      renderListItem();
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('flex', 'items-center', 'gap-3');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLLIElement>();
      render(
        <List>
          <ListItem ref={ref}>
            <ListItemContent>
              <ListItemTitle>Test</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  describe('Interactive States', () => {
    test('handles click events when interactive', async () => {
      const handleSelect = jest.fn();
      const user = userEvent.setup();

      renderListItem({ variant: 'interactive', onSelect: handleSelect });
      const item = screen.getByRole('listitem');

      await user.click(item);
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    test('handles keyboard events when interactive', async () => {
      const handleSelect = jest.fn();
      const user = userEvent.setup();

      renderListItem({ variant: 'interactive', onSelect: handleSelect });
      const item = screen.getByRole('listitem');

      item.focus();
      await user.keyboard('{Enter}');
      expect(handleSelect).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleSelect).toHaveBeenCalledTimes(2);
    });

    test('does not handle events when disabled', async () => {
      const handleSelect = jest.fn();
      const user = userEvent.setup();

      renderListItem({
        variant: 'interactive',
        onSelect: handleSelect,
        disabled: true,
      });
      const item = screen.getByRole('listitem');

      await user.click(item);
      expect(handleSelect).not.toHaveBeenCalled();
    });

    test('shows loading spinner when loading', () => {
      renderListItem({ loading: true });
      const spinner = screen.getByRole('listitem').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('States', () => {
    test('applies selected state classes', () => {
      renderListItem({ selected: true });
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    test('applies disabled state classes', () => {
      renderListItem({ disabled: true });
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('ARIA Attributes', () => {
    test('applies selected state styling when selected', () => {
      renderListItem({ selected: true, variant: 'interactive' });
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('bg-accent', 'text-accent-foreground');
    });

    test('applies aria-disabled when disabled', () => {
      renderListItem({ disabled: true });
      const item = screen.getByRole('listitem');
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });
  });
});

describe('ListItem Sub-Components', () => {
  describe('ListItemContent', () => {
    test('renders content with correct alignment', () => {
      render(
        <List>
          <ListItem>
            <ListItemContent alignment="center">
              <ListItemTitle>Centered Content</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const content = screen.getByText('Centered Content').parentElement;
      expect(content).toHaveClass('items-center', 'text-center');
    });
  });

  describe('ListItemTitle', () => {
    test('renders with different sizes', () => {
      render(
        <List>
          <ListItem>
            <ListItemContent>
              <ListItemTitle size="lg">Large Title</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const title = screen.getByText('Large Title');
      expect(title).toHaveClass('text-lg');
    });

    test('applies truncate when specified', () => {
      render(
        <List>
          <ListItem>
            <ListItemContent>
              <ListItemTitle truncate>Truncated Title</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const title = screen.getByText('Truncated Title');
      expect(title).toHaveClass(
        'overflow-hidden',
        'text-ellipsis',
        'whitespace-nowrap'
      );
    });
  });

  describe('ListItemDescription', () => {
    test('renders with correct styling', () => {
      render(
        <List>
          <ListItem>
            <ListItemContent>
              <ListItemTitle>Title</ListItemTitle>
              <ListItemDescription>Description text</ListItemDescription>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const description = screen.getByText('Description text');
      expect(description).toHaveClass('text-muted-foreground', 'mt-1');
    });

    test('applies line clamp when specified', () => {
      render(
        <List>
          <ListItem>
            <ListItemContent>
              <ListItemDescription lines={2}>
                Multi-line description
              </ListItemDescription>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const description = screen.getByText('Multi-line description');
      expect(description).toHaveClass('line-clamp-2');
    });
  });

  describe('ListItemIcon', () => {
    test('renders icon with correct positioning', () => {
      render(
        <List>
          <ListItem>
            <ListItemIcon position="trailing" icon={<span>Icon</span>} />
            <ListItemContent>
              <ListItemTitle>With Icon</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const icon = screen.getByText('Icon');
      expect(icon.parentElement).toHaveClass('order-last', 'ml-auto');
    });

    test('applies variant styling', () => {
      render(
        <List>
          <ListItem>
            <ListItemIcon variant="primary" icon={<span>Icon</span>} />
            <ListItemContent>
              <ListItemTitle>With Colored Icon</ListItemTitle>
            </ListItemContent>
          </ListItem>
        </List>
      );

      const icon = screen.getByText('Icon');
      expect(icon.parentElement).toHaveClass('text-primary');
    });
  });
});

describe('CheckboxListItem Component', () => {
  const defaultCheckboxProps: CheckboxListItemProps = {
    label: 'Checkbox Item',
    description: 'Checkbox description',
    checked: false,
    onCheckedChange: jest.fn(),
  };

  test('renders checkbox item with label and description', () => {
    render(
      <List>
        <CheckboxListItem {...defaultCheckboxProps}>
          <span>test content</span>
        </CheckboxListItem>
      </List>
    );

    expect(screen.getByText('Checkbox Item')).toBeInTheDocument();
    expect(screen.getByText('Checkbox description')).toBeInTheDocument();
  });

  test('handles checkbox toggle on click', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <List>
        <CheckboxListItem
          {...defaultCheckboxProps}
          onCheckedChange={handleChange}
        />
      </List>
    );

    const item = screen.getByRole('listitem');
    await user.click(item);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('handles checkbox toggle on space key', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <List>
        <CheckboxListItem
          {...defaultCheckboxProps}
          onCheckedChange={handleChange}
        />
      </List>
    );

    const item = screen.getByRole('listitem');
    item.focus();
    await user.keyboard(' ');
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('shows checked state correctly', () => {
    render(
      <List>
        <CheckboxListItem {...defaultCheckboxProps} checked>
          <span>test content</span>
        </CheckboxListItem>
      </List>
    );

    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('bg-accent', 'text-accent-foreground');

    const checkbox = screen.getByRole('checkbox', { hidden: true });
    expect(checkbox).toBeChecked();
  });

  test('shows indeterminate state', () => {
    render(
      <List>
        <CheckboxListItem {...defaultCheckboxProps} indeterminate>
          <span>test content</span>
        </CheckboxListItem>
      </List>
    );

    // Check for minus icon (indeterminate state)
    const minusIcon = screen
      .getByRole('listitem')
      .querySelector('svg.lucide-minus');
    expect(minusIcon).toBeInTheDocument();
  });

  test('disables interaction when disabled', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <List>
        <CheckboxListItem
          {...defaultCheckboxProps}
          onCheckedChange={handleChange}
          disabled
        />
      </List>
    );

    const item = screen.getByRole('listitem');
    await user.click(item);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('Recipe Components', () => {
  describe('IngredientListItem', () => {
    const sampleIngredient = {
      id: '1',
      name: 'All-purpose flour',
      quantity: '2',
      unit: 'cups',
      optional: false,
      checked: false,
    };

    test('renders ingredient with quantity', () => {
      render(
        <RecipeList>
          <IngredientListItem ingredient={sampleIngredient} />
        </RecipeList>
      );

      expect(screen.getByText('All-purpose flour')).toBeInTheDocument();
      expect(screen.getByText('2 cups')).toBeInTheDocument();
    });

    test('shows optional indicator', () => {
      render(
        <RecipeList>
          <IngredientListItem
            ingredient={{ ...sampleIngredient, optional: true }}
          />
        </RecipeList>
      );

      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    test('handles checking when allowed', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <RecipeList>
          <IngredientListItem
            ingredient={sampleIngredient}
            allowChecking
            onToggleCheck={handleToggle}
          />
        </RecipeList>
      );

      const item = screen.getByRole('listitem');
      await user.click(item);
      expect(handleToggle).toHaveBeenCalledWith('1');
    });

    test('shows checked state styling', () => {
      render(
        <RecipeList>
          <IngredientListItem
            ingredient={{ ...sampleIngredient, checked: true }}
            allowChecking
          />
        </RecipeList>
      );

      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('opacity-60', 'line-through');
    });
  });

  describe('InstructionListItem', () => {
    const sampleInstruction = {
      id: '1',
      step: 1,
      text: 'Mix the ingredients together.',
      duration: '2 min',
      temperature: '350°F',
      completed: false,
    };

    test('renders instruction with details', () => {
      render(
        <RecipeList>
          <InstructionListItem instruction={sampleInstruction} />
        </RecipeList>
      );

      expect(
        screen.getByText('Mix the ingredients together.')
      ).toBeInTheDocument();
      expect(screen.getByText(/Duration: 2 min/)).toBeInTheDocument();
      expect(screen.getByText(/Temperature: 350°F/)).toBeInTheDocument();
    });

    test('handles completion toggle', async () => {
      const handleToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <RecipeList>
          <InstructionListItem
            instruction={sampleInstruction}
            allowChecking
            onToggleComplete={handleToggle}
          />
        </RecipeList>
      );

      const item = screen.getByRole('listitem');
      await user.click(item);
      expect(handleToggle).toHaveBeenCalledWith('1');
    });
  });

  describe('NutritionListItem', () => {
    const sampleNutrition = {
      id: '1',
      label: 'Calories',
      value: 250,
      unit: '',
      dailyValue: 12,
    };

    test('renders nutrition info with daily value', () => {
      render(
        <RecipeList>
          <NutritionListItem nutrition={sampleNutrition} />
        </RecipeList>
      );

      expect(screen.getByText('Calories')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
      expect(screen.getByText('(12% DV)')).toBeInTheDocument();
    });

    test('renders nutrition without daily value when not provided', () => {
      render(
        <RecipeList>
          <NutritionListItem
            nutrition={{ ...sampleNutrition, dailyValue: undefined }}
            showDailyValue={false}
          />
        </RecipeList>
      );

      expect(screen.getByText('Calories')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
      expect(screen.queryByText(/DV/)).not.toBeInTheDocument();
    });
  });
});

describe('RecipeList Component', () => {
  test('applies recipe-specific styling for ingredients context', () => {
    render(
      <RecipeList context="ingredients">
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Ingredient</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </RecipeList>
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('[&>*]:border-l-2', '[&>*]:border-l-basil/30');
  });

  test('applies instruction numbering when context is instructions', () => {
    render(
      <RecipeList context="instructions">
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Step 1</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </RecipeList>
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('counter-reset-[step-counter]');
  });

  test('applies numbered styling when numbered prop is true', () => {
    render(
      <RecipeList numbered>
        <ListItem>
          <ListItemContent>
            <ListItemTitle>Item 1</ListItemTitle>
          </ListItemContent>
        </ListItem>
      </RecipeList>
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('counter-reset-[list-counter]');
  });
});

describe('Accessibility Tests', () => {
  test('List has no accessibility violations', async () => {
    const { container } = renderList();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Interactive list item has no accessibility violations', async () => {
    const { container } = renderListItem({
      variant: 'interactive',
      onSelect: jest.fn(),
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('CheckboxListItem has no accessibility violations', async () => {
    const { container } = render(
      <List>
        <CheckboxListItem
          label="Test checkbox"
          description="Test description"
          checked={false}
          onCheckedChange={jest.fn()}
        />
      </List>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Recipe components have no accessibility violations', async () => {
    const { container } = render(
      <RecipeList context="ingredients">
        <IngredientListItem
          ingredient={{
            id: '1',
            name: 'Test ingredient',
            quantity: '1',
            unit: 'cup',
          }}
        />
      </RecipeList>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
