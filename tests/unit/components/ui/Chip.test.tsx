import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Chip, ChipGroup, ChipInput, RecipeChip } from '@/components/ui/chip';
import type { ChipProps } from '@/types/ui/chip.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Chip with default props
 */
const renderChip = (props: Partial<ChipProps> = {}) => {
  const defaultProps: ChipProps = {
    children: 'Test Chip',
    ...props,
  };

  return render(<Chip {...defaultProps} />);
};

describe('Chip', () => {
  describe('Basic Rendering', () => {
    test('renders chip with children', () => {
      renderChip();
      expect(screen.getByText('Test Chip')).toBeInTheDocument();
    });

    test('renders div element by default', () => {
      renderChip();
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip?.tagName).toBe('DIV');
    });

    test('applies default classes', () => {
      renderChip();
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-full'
      );
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Chip ref={ref}>Test</Chip>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    test('applies default variant classes', () => {
      renderChip({ variant: 'default' });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('border-input', 'bg-background');
    });

    test('applies outlined variant classes', () => {
      renderChip({ variant: 'outlined' });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('border-input', 'bg-transparent');
    });

    test('applies filled variant classes', () => {
      renderChip({ variant: 'filled' });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderChip({ size: 'sm' });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('h-7', 'px-2.5', 'text-xs');
    });

    test('applies medium size classes', () => {
      renderChip({ size: 'md' });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('h-8', 'px-3', 'text-sm');
    });

    test('applies large size classes', () => {
      renderChip({ size: 'lg' });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('h-9', 'px-4', 'text-sm');
    });
  });

  describe('Colors', () => {
    const colors = [
      'primary',
      'secondary',
      'success',
      'warning',
      'destructive',
      'info',
    ] as const;

    colors.forEach(color => {
      test(`applies ${color} color classes`, () => {
        renderChip({ color });
        const chip = screen.getByText('Test Chip').parentElement;
        const expectedColor =
          color === 'destructive'
            ? 'red'
            : color === 'success'
              ? 'green'
              : color === 'warning'
                ? 'yellow'
                : color === 'info'
                  ? 'blue'
                  : color;
        expect(chip?.className).toContain(expectedColor);
      });
    });
  });

  describe('Delete Functionality', () => {
    test('renders delete button when onDelete is provided', () => {
      const handleDelete = jest.fn();
      renderChip({ onDelete: handleDelete });
      const deleteButton = screen.getByRole('button', { name: 'Remove' });
      expect(deleteButton).toBeInTheDocument();
    });

    test('calls onDelete when delete button is clicked', async () => {
      const handleDelete = jest.fn();
      const user = userEvent.setup();

      renderChip({ onDelete: handleDelete });
      const deleteButton = screen.getByRole('button', { name: 'Remove' });

      await user.click(deleteButton);
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    test('does not render delete button when chip is disabled', () => {
      const handleDelete = jest.fn();

      renderChip({ onDelete: handleDelete, disabled: true });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveAttribute('aria-disabled', 'true');

      // When disabled, the delete button should not be rendered
      const deleteButton = screen.queryByRole('button', { name: 'Remove' });
      expect(deleteButton).not.toBeInTheDocument();
    });

    test('stops propagation on delete click', async () => {
      const handleDelete = jest.fn();
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderChip({ onDelete: handleDelete, onClick: handleClick });
      const deleteButton = screen.getByRole('button', { name: 'Remove' });

      await user.click(deleteButton);
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('renders custom delete icon', () => {
      renderChip({
        onDelete: jest.fn(),
        deleteIcon: <span data-testid="custom-delete">×</span>,
      });
      expect(screen.getByTestId('custom-delete')).toBeInTheDocument();
    });

    test('uses custom delete label', () => {
      renderChip({
        onDelete: jest.fn(),
        deleteLabel: 'Remove ingredient',
      });
      const deleteButton = screen.getByRole('button', {
        name: 'Remove ingredient',
      });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Click Functionality', () => {
    test('makes chip clickable when onClick is provided', () => {
      const handleClick = jest.fn();
      renderChip({ onClick: handleClick });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveAttribute('role', 'button');
      expect(chip).toHaveAttribute('tabIndex', '0');
    });

    test('calls onClick when chip is clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderChip({ onClick: handleClick });
      const chip = screen.getByText('Test Chip').parentElement;

      await user.click(chip!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderChip({ onClick: handleClick, disabled: true });
      const chip = screen.getByText('Test Chip').parentElement;

      await user.click(chip!);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Selection State', () => {
    test('applies selected styles', () => {
      renderChip({ selected: true, onClick: jest.fn() });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass('ring-2', 'ring-primary');
      expect(chip).toHaveAttribute('aria-pressed', 'true');
      expect(chip).toHaveAttribute('data-selected', 'true');
    });

    test('toggles selection on click', async () => {
      const user = userEvent.setup();
      let selected = false;
      const handleClick = jest.fn(() => {
        selected = !selected;
      });

      const { rerender } = renderChip({ onClick: handleClick, selected });
      const chip = screen.getByText('Test Chip').parentElement;

      await user.click(chip!);
      expect(handleClick).toHaveBeenCalled();

      rerender(
        <Chip onClick={handleClick} selected={true}>
          Test Chip
        </Chip>
      );
      expect(chip).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Icons and Avatars', () => {
    test('renders icon when provided', () => {
      renderChip({
        icon: <span data-testid="test-icon">📌</span>,
      });
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('renders avatar when provided', () => {
      renderChip({
        avatar: <img data-testid="test-avatar" src="avatar.jpg" alt="User" />,
      });
      expect(screen.getByTestId('test-avatar')).toBeInTheDocument();
    });

    test('prefers avatar over icon when both provided', () => {
      renderChip({
        icon: <span data-testid="test-icon">📌</span>,
        avatar: <span data-testid="test-avatar">👤</span>,
      });
      expect(screen.getByTestId('test-avatar')).toBeInTheDocument();
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    test('handles Enter key for clickable chips', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderChip({ onClick: handleClick });
      const chip = screen.getByText('Test Chip').parentElement;

      chip?.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles Space key for clickable chips', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      renderChip({ onClick: handleClick });
      const chip = screen.getByText('Test Chip').parentElement;

      chip?.focus();
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles Delete key for deletable chips', async () => {
      const handleDelete = jest.fn();
      const user = userEvent.setup();

      renderChip({ onDelete: handleDelete });
      const chip = screen.getByText('Test Chip').parentElement;

      chip?.focus();
      await user.keyboard('{Delete}');
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    test('handles Backspace key for deletable chips', async () => {
      const handleDelete = jest.fn();
      const user = userEvent.setup();

      renderChip({ onDelete: handleDelete });
      const chip = screen.getByText('Test Chip').parentElement;

      chip?.focus();
      await user.keyboard('{Backspace}');
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    test('does not handle keys when disabled', async () => {
      const handleClick = jest.fn();
      const handleDelete = jest.fn();
      const user = userEvent.setup();

      renderChip({
        onClick: handleClick,
        onDelete: handleDelete,
        disabled: true,
      });
      const chip = screen.getByText('Test Chip').parentElement;

      chip?.focus();
      await user.keyboard('{Enter}');
      await user.keyboard('{Delete}');

      expect(handleClick).not.toHaveBeenCalled();
      expect(handleDelete).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    test('applies disabled styles', () => {
      renderChip({ disabled: true });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass(
        'disabled:opacity-50',
        'disabled:pointer-events-none'
      );
      expect(chip).toHaveAttribute('aria-disabled', 'true');
      expect(chip).toHaveAttribute('data-disabled', 'true');
    });

    test('prevents interactions when disabled', async () => {
      const handleClick = jest.fn();
      const handleDelete = jest.fn();
      const user = userEvent.setup();

      renderChip({
        onClick: handleClick,
        onDelete: handleDelete,
        disabled: true,
      });

      const chip = screen.getByText('Test Chip').parentElement;
      await user.click(chip!);

      expect(handleClick).not.toHaveBeenCalled();
      expect(handleDelete).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderChip();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no violations with delete button', async () => {
      const { container } = renderChip({ onDelete: jest.fn() });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no violations when clickable', async () => {
      const { container } = renderChip({ onClick: jest.fn() });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no violations when selected', async () => {
      const { container } = renderChip({ selected: true, onClick: jest.fn() });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('maintains focus visibility', () => {
      renderChip({ onClick: jest.fn() });
      const chip = screen.getByText('Test Chip').parentElement;
      expect(chip).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2'
      );
    });
  });
});

describe('ChipGroup', () => {
  test('renders children chips', () => {
    render(
      <ChipGroup>
        <Chip>Chip 1</Chip>
        <Chip>Chip 2</Chip>
        <Chip>Chip 3</Chip>
      </ChipGroup>
    );

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
    expect(screen.getByText('Chip 3')).toBeInTheDocument();
  });

  test('applies spacing classes', () => {
    const { container } = render(
      <ChipGroup spacing="tight">
        <Chip>Chip 1</Chip>
      </ChipGroup>
    );

    const group = container.firstChild;
    expect(group).toHaveClass('gap-1');
  });

  test('limits display with maxDisplay', () => {
    render(
      <ChipGroup maxDisplay={2}>
        <Chip>Chip 1</Chip>
        <Chip>Chip 2</Chip>
        <Chip>Chip 3</Chip>
        <Chip>Chip 4</Chip>
      </ChipGroup>
    );

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
    expect(screen.queryByText('Chip 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Chip 4')).not.toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ChipGroup ref={ref}>
        <Chip>Test</Chip>
      </ChipGroup>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ChipInput', () => {
  test('renders input field', () => {
    const handleChange = jest.fn();
    render(
      <ChipInput value={[]} onChange={handleChange} placeholder="Add item..." />
    );

    const input = screen.getByPlaceholderText('Add item...');
    expect(input).toBeInTheDocument();
  });

  test('displays existing chips', () => {
    const handleChange = jest.fn();
    render(<ChipInput value={['Item 1', 'Item 2']} onChange={handleChange} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('adds new chip on Enter key', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ChipInput value={[]} onChange={handleChange} placeholder="Add item..." />
    );

    const input = screen.getByPlaceholderText('Add item...');
    await user.type(input, 'NewItem{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['NewItem']);
  });

  test('removes chip when delete button clicked', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<ChipInput value={['Item 1', 'Item 2']} onChange={handleChange} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Remove' });
    await user.click(deleteButtons[0]);

    expect(handleChange).toHaveBeenCalledWith(['Item 2']);
  });

  test('removes last chip on Backspace when input is empty', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<ChipInput value={['Item 1', 'Item 2']} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    input.focus();
    await user.keyboard('{Backspace}');

    expect(handleChange).toHaveBeenCalledWith(['Item 1']);
  });

  test('validates input with custom validator', async () => {
    const handleChange = jest.fn();
    const validator = jest.fn((value: string) => {
      if (value.length < 3) return 'Too short';
      return true;
    });
    const user = userEvent.setup();

    render(
      <ChipInput
        value={[]}
        onChange={handleChange}
        validate={validator}
        placeholder="Add item..."
      />
    );

    const input = screen.getByPlaceholderText('Add item...');
    await user.type(input, 'ab{Enter}');

    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('prevents duplicate chips', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ChipInput
        value={['Item1']}
        onChange={handleChange}
        placeholder="Add item..."
      />
    );

    const input = screen.getByRole('textbox');

    // Type the duplicate item
    await user.type(input, 'Item1');

    // Verify the text was typed
    expect(input).toHaveValue('Item1');

    // Press Enter to try to add it
    await user.keyboard('{Enter}');

    expect(await screen.findByText('Item already exists')).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('enforces maxChips limit', async () => {
    const handleChange = jest.fn();

    render(
      <ChipInput
        value={['Item 1', 'Item 2']}
        onChange={handleChange}
        maxChips={2}
        placeholder="Add item..."
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('shows suggestions when typing', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ChipInput
        value={[]}
        onChange={handleChange}
        suggestions={['Apple', 'Apricot', 'Banana']}
        placeholder="Add item..."
      />
    );

    const input = screen.getByPlaceholderText('Add item...');
    await user.type(input, 'ap');

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Apricot')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  test('adds suggestion on click', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ChipInput
        value={[]}
        onChange={handleChange}
        suggestions={['Apple']}
        placeholder="Add item..."
      />
    );

    const input = screen.getByPlaceholderText('Add item...');
    await user.type(input, 'ap');

    const suggestion = screen.getByText('Apple');
    await user.click(suggestion);

    expect(handleChange).toHaveBeenCalledWith(['Apple']);
  });

  test('handles disabled state', () => {
    const handleChange = jest.fn();

    render(
      <ChipInput
        value={['Item 1']}
        onChange={handleChange}
        disabled={true}
        placeholder="Add item..."
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});

describe('RecipeChip', () => {
  test('applies ingredient context styles', () => {
    render(<RecipeChip context="ingredient">Tomato</RecipeChip>);
    const chip = screen.getByText('Tomato').parentElement;
    expect(chip).toHaveClass('bg-blue-600');
  });

  test('applies dietary context styles', () => {
    render(<RecipeChip context="dietary">Vegetarian</RecipeChip>);
    const chip = screen.getByText('Vegetarian').parentElement;
    expect(chip?.className).toContain('green');
  });

  test('applies category context styles', () => {
    render(<RecipeChip context="category">Breakfast</RecipeChip>);
    const chip = screen.getByText('Breakfast').parentElement;
    expect(chip?.className).toContain('blue');
  });

  test('inherits chip functionality', async () => {
    const handleDelete = jest.fn();
    const user = userEvent.setup();

    render(
      <RecipeChip context="ingredient" onDelete={handleDelete}>
        Onion
      </RecipeChip>
    );

    const deleteButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RecipeChip ref={ref} context="tag">
        Test
      </RecipeChip>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Component Display Names', () => {
  test('Chip has correct display name', () => {
    expect(Chip.displayName).toBe('Chip');
  });

  test('ChipGroup has correct display name', () => {
    expect(ChipGroup.displayName).toBe('ChipGroup');
  });

  test('ChipInput has correct display name', () => {
    expect(ChipInput.displayName).toBe('ChipInput');
  });

  test('RecipeChip has correct display name', () => {
    expect(RecipeChip.displayName).toBe('RecipeChip');
  });
});
