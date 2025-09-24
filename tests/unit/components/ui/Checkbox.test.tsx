import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Checkbox,
  CheckboxRoot,
  CheckboxInput,
  CheckboxIcon,
  CheckboxLabel,
  CheckboxDescription,
  CheckboxField,
  FilterCheckboxGroup,
  FilterCheckboxItem,
  AnimatedCheckbox,
  SearchCheckbox,
  MultiSelectFilter,
} from '@/components/ui/checkbox';
import type { FilterCheckboxItemProps } from '@/types/ui/checkbox';
import { Check, Minus, Search } from 'lucide-react';

describe('Checkbox Components', () => {
  describe('Checkbox (Main)', () => {
    it('renders with default props', () => {
      render(<Checkbox />);
      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeInTheDocument();
      expect(checkboxElement).toHaveAttribute('aria-checked', 'false');
    });

    it('renders with label', () => {
      render(<Checkbox label="Test Checkbox" />);
      expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(<Checkbox description="This is a test checkbox" />);
      expect(screen.getByText('This is a test checkbox')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(<Checkbox size="sm" />);
      let checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('h-4', 'w-4');

      rerender(<Checkbox size="md" />);
      checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('h-5', 'w-5');

      rerender(<Checkbox size="lg" />);
      checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('h-6', 'w-6');

      rerender(<Checkbox size="xl" />);
      checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('h-7', 'w-7');
    });

    it('applies variant classes correctly', () => {
      const { rerender } = render(<Checkbox variant="default" />);
      let checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('border-gray-300');

      rerender(<Checkbox variant="success" />);
      checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('data-[state=checked]:bg-green-500');

      rerender(<Checkbox variant="danger" />);
      checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveClass('data-[state=checked]:bg-red-500');
    });

    it('handles checked state', () => {
      const handleChange = jest.fn();
      render(<Checkbox checked={true} onCheckedChange={handleChange} />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveAttribute('aria-checked', 'true');
      expect(checkboxElement).toHaveAttribute('data-state', 'checked');
    });

    it('handles indeterminate state', () => {
      const handleChange = jest.fn();
      render(<Checkbox indeterminate={true} onCheckedChange={handleChange} />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveAttribute('aria-checked', 'mixed');
      expect(checkboxElement).toHaveAttribute('data-state', 'indeterminate');
    });

    it('handles click events', async () => {
      const handleChange = jest.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      const checkboxElement = screen.getByRole('checkbox');
      await userEvent.click(checkboxElement);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles disabled state', () => {
      render(<Checkbox disabled label="Disabled Checkbox" />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeDisabled();
      expect(checkboxElement.closest('div')).toHaveClass('opacity-50');
    });

    it('handles loading state', () => {
      render(<Checkbox loading />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeDisabled();
    });

    it('displays error message', () => {
      render(<Checkbox error="This field is required" />);

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent('This field is required');
    });

    it('marks as required', () => {
      render(<Checkbox required label="Required Checkbox" />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveAttribute('aria-required', 'true');

      const label = screen.getByText('Required Checkbox');
      expect(label).toHaveClass("after:content-['*']");
    });

    it('renders with custom icons', () => {
      render(
        <Checkbox
          checkedIcon={<Check data-testid="check-icon" />}
          uncheckedIcon={<Search data-testid="search-icon" />}
          indeterminateIcon={<Minus data-testid="minus-icon" />}
          indeterminate={true}
        />
      );

      const minusIcon = screen.getByTestId('minus-icon');
      expect(minusIcon).toBeInTheDocument();
    });

    it('applies orientation classes', () => {
      const { rerender } = render(<Checkbox orientation="horizontal" />);
      expect(screen.getByRole('checkbox').closest('div')).toHaveClass(
        'flex-row'
      );

      rerender(<Checkbox orientation="vertical" />);
      expect(screen.getByRole('checkbox').closest('div')).toHaveClass(
        'flex-col'
      );

      rerender(<Checkbox orientation="reverse-horizontal" />);
      expect(screen.getByRole('checkbox').closest('div')).toHaveClass(
        'flex-row-reverse'
      );
    });
  });

  describe('Compound Components', () => {
    it('CheckboxRoot provides context to children', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxRoot onCheckedChange={handleChange}>
          <CheckboxInput />
          <CheckboxLabel>Test Label</CheckboxLabel>
        </CheckboxRoot>
      );

      const input = screen.getByRole('checkbox');
      fireEvent.click(input);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('CheckboxInput toggles state on click', () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
          false
        );
        return (
          <CheckboxRoot checked={checked} onCheckedChange={setChecked}>
            <CheckboxInput />
          </CheckboxRoot>
        );
      };

      render(<TestComponent />);
      const input = screen.getByRole('checkbox');

      expect(input).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(input);
      expect(input).toHaveAttribute('aria-checked', 'true');
    });

    it('CheckboxLabel renders correctly', () => {
      render(
        <CheckboxRoot>
          <CheckboxLabel>Test Label</CheckboxLabel>
        </CheckboxRoot>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('CheckboxDescription renders correctly', () => {
      render(
        <CheckboxRoot>
          <CheckboxDescription>Test Description</CheckboxDescription>
        </CheckboxRoot>
      );

      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('CheckboxIcon displays correct icon based on state', () => {
      const { rerender } = render(
        <CheckboxRoot checked={false}>
          <CheckboxIcon data-testid="checkbox-icon" />
        </CheckboxRoot>
      );

      // Should be empty for unchecked state
      let icon = screen.getByTestId('checkbox-icon');
      expect(icon).toHaveClass('opacity-0');

      rerender(
        <CheckboxRoot checked={true}>
          <CheckboxIcon data-testid="checkbox-icon" />
        </CheckboxRoot>
      );

      icon = screen.getByTestId('checkbox-icon');
      expect(icon).toHaveClass('opacity-100');
    });
  });

  describe('CheckboxField', () => {
    it('renders with label and helper text', () => {
      render(
        <CheckboxField label="Field Label" helperText="This is helper text" />
      );

      expect(screen.getByText('Field Label')).toBeInTheDocument();
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('displays error state', () => {
      render(<CheckboxField label="Field Label" error="Field is required" />);

      expect(screen.getByRole('alert')).toHaveTextContent('Field is required');
    });
  });

  describe('FilterCheckboxGroup', () => {
    const testCheckboxes: FilterCheckboxItemProps[] = [
      {
        id: 'checkbox1',
        label: 'Checkbox 1',
        description: 'Description 1',
        defaultChecked: true,
      },
      {
        id: 'checkbox2',
        label: 'Checkbox 2',
        description: 'Description 2',
        defaultChecked: false,
      },
      {
        id: 'checkbox3',
        label: 'Checkbox 3',
        description: 'Description 3',
        defaultChecked: false,
      },
    ];

    it('renders group with title', () => {
      render(<FilterCheckboxGroup title="Test Group" items={testCheckboxes} />);

      expect(screen.getByText('Test Group')).toBeInTheDocument();
      expect(screen.getByText('Checkbox 1')).toBeInTheDocument();
      expect(screen.getByText('Checkbox 2')).toBeInTheDocument();
      expect(screen.getByText('Checkbox 3')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      const { rerender } = render(
        <FilterCheckboxGroup variant="filters" items={testCheckboxes} />
      );
      expect(screen.getByText('Checkbox 1').closest('.rounded-lg')).toHaveClass(
        'border-blue-200'
      );

      rerender(
        <FilterCheckboxGroup variant="categories" items={testCheckboxes} />
      );
      expect(screen.getByText('Checkbox 1').closest('.rounded-lg')).toHaveClass(
        'border-green-200'
      );
    });

    it('handles batch changes', async () => {
      const handleBatchChange = jest.fn();
      render(
        <FilterCheckboxGroup
          items={testCheckboxes}
          onBatchChange={handleBatchChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[1]); // Click second checkbox

      expect(handleBatchChange).toHaveBeenCalledWith({
        checkbox1: true,
        checkbox2: true,
        checkbox3: false,
      });
    });

    it('maintains individual checkbox states', () => {
      render(<FilterCheckboxGroup items={testCheckboxes} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');
      expect(checkboxes[1]).toHaveAttribute('aria-checked', 'false');
      expect(checkboxes[2]).toHaveAttribute('aria-checked', 'false');
    });

    it('renders search functionality when enabled', () => {
      render(
        <FilterCheckboxGroup
          items={testCheckboxes}
          searchable={true}
          searchPlaceholder="Search items..."
        />
      );

      expect(
        screen.getByPlaceholderText('Search items...')
      ).toBeInTheDocument();
    });

    it('filters items based on search term', async () => {
      render(<FilterCheckboxGroup items={testCheckboxes} searchable={true} />);

      const searchInput = screen.getByPlaceholderText('Search filters...');
      await userEvent.type(searchInput, 'Checkbox 1');

      expect(screen.getByText('Checkbox 1')).toBeInTheDocument();
      expect(screen.queryByText('Checkbox 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Checkbox 3')).not.toBeInTheDocument();
    });

    it('shows "no results" message when search yields no results', async () => {
      render(<FilterCheckboxGroup items={testCheckboxes} searchable={true} />);

      const searchInput = screen.getByPlaceholderText('Search filters...');
      await userEvent.type(searchInput, 'nonexistent');

      expect(screen.getByText(/No filters found for/)).toBeInTheDocument();
    });

    it('handles select all functionality', async () => {
      render(<FilterCheckboxGroup items={testCheckboxes} selectAll={true} />);

      const selectAllButton = screen.getByText(/Select All/);
      await userEvent.click(selectAllButton);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
      });
    });

    it('handles clear all functionality', async () => {
      render(<FilterCheckboxGroup items={testCheckboxes} clearAll={true} />);

      const clearAllButton = screen.getByText(/Clear All/);
      await userEvent.click(clearAllButton);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('applies layout classes correctly', () => {
      const { rerender } = render(
        <FilterCheckboxGroup items={testCheckboxes} layout="vertical" />
      );
      const verticalContainer = screen
        .getByText('Checkbox 1')
        .closest('[class*="space-y-3"]');
      expect(verticalContainer).toBeInTheDocument();

      rerender(
        <FilterCheckboxGroup items={testCheckboxes} layout="horizontal" />
      );
      const horizontalContainer = screen
        .getByText('Checkbox 1')
        .closest('[class*="flex-wrap"]');
      expect(horizontalContainer).toBeInTheDocument();

      rerender(<FilterCheckboxGroup items={testCheckboxes} layout="grid" />);
      const gridContainer = screen
        .getByText('Checkbox 1')
        .closest('[class*="grid-cols-2"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('AnimatedCheckbox', () => {
    it('renders with animation properties', () => {
      render(
        <AnimatedCheckbox
          animation="scale"
          animationDuration={300}
          label="Animated Checkbox"
        />
      );

      const checkboxElement = screen.getByRole('checkbox');
      const checkboxWrapper = checkboxElement.closest('div');

      expect(checkboxWrapper).toHaveClass('transition-transform');
      expect(screen.getByText('Animated Checkbox')).toBeInTheDocument();
    });

    it('applies loading state correctly', () => {
      render(<AnimatedCheckbox loading={true} />);

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeDisabled();
    });
  });

  describe('SearchCheckbox', () => {
    it('renders with search highlighting', () => {
      render(
        <SearchCheckbox
          label="Test Label"
          searchTerm="Test"
          highlightMatch={true}
        />
      );

      const highlightedText = screen.getByText('Test');
      expect(highlightedText.tagName).toBe('MARK');
    });

    it('displays count and badge', () => {
      render(
        <SearchCheckbox
          label="Test Label"
          count={5}
          badge={<span data-testid="badge">New</span>}
        />
      );

      expect(screen.getByText('(5)')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toBeInTheDocument();
    });

    it('applies selected styling', () => {
      render(<SearchCheckbox label="Test" selected={true} />);

      const container = screen
        .getByText('Test')
        .closest('[class*="border-blue-500"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('MultiSelectFilter', () => {
    const options: FilterCheckboxItemProps[] = [
      { id: 'option1', label: 'Option 1', value: 'val1' },
      { id: 'option2', label: 'Option 2', value: 'val2' },
      { id: 'option3', label: 'Option 3', value: 'val3' },
    ];

    it('renders with title and shows selection count', () => {
      render(
        <MultiSelectFilter
          title="Multi Select"
          options={options}
          selectedValues={['val1']}
          onSelectionChange={() => {}}
          showCount={true}
        />
      );

      expect(screen.getByText('Multi Select')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('handles selection changes', async () => {
      const handleChange = jest.fn();
      render(
        <MultiSelectFilter
          title="Multi Select"
          options={options}
          selectedValues={[]}
          onSelectionChange={handleChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[0]);

      expect(handleChange).toHaveBeenCalledWith(['val1']);
    });

    it('respects max selections limit', async () => {
      const handleChange = jest.fn();
      render(
        <MultiSelectFilter
          title="Multi Select"
          options={options}
          selectedValues={['val1']}
          onSelectionChange={handleChange}
          maxSelections={1}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[1]); // Try to select second option

      // Should not call handleChange since we're at max selections
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - basic Checkbox', async () => {
      const { container } = render(
        <Checkbox label="Accessible Checkbox" description="Test description" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - CheckboxField', async () => {
      const { container } = render(
        <CheckboxField label="Field Label" helperText="Helper text" required />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - FilterCheckboxGroup', async () => {
      const { container } = render(
        <FilterCheckboxGroup
          title="Group Title"
          items={[
            { id: '1', label: 'Checkbox 1' },
            { id: '2', label: 'Checkbox 2' },
          ]}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const handleChange = jest.fn();
      render(
        <Checkbox onCheckedChange={handleChange} label="Keyboard Checkbox" />
      );

      const checkboxElement = screen.getByRole('checkbox');
      checkboxElement.focus();

      await userEvent.click(checkboxElement);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('has proper ARIA attributes', () => {
      render(
        <Checkbox
          label="ARIA Checkbox"
          description="Description"
          required
          error="Error message"
        />
      );

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toHaveAttribute('aria-required', 'true');
      expect(checkboxElement).toHaveAttribute('aria-invalid', 'true');
      expect(checkboxElement).toHaveAttribute('aria-describedby');
    });

    it('associates label with checkbox', () => {
      render(<Checkbox label="Associated Label" />);

      const checkboxElement = screen.getByRole('checkbox');
      const label = screen.getByText('Associated Label');

      expect(label).toHaveAttribute('for', checkboxElement.id);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicks', async () => {
      const handleChange = jest.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      const checkboxElement = screen.getByRole('checkbox');

      // Rapid clicks
      await userEvent.click(checkboxElement);
      await userEvent.click(checkboxElement);
      await userEvent.click(checkboxElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('handles undefined props gracefully', () => {
      render(
        <Checkbox label={undefined} description={undefined} error={undefined} />
      );

      const checkboxElement = screen.getByRole('checkbox');
      expect(checkboxElement).toBeInTheDocument();
    });

    it('maintains controlled state', () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);
        const handleChange = (newChecked: boolean | 'indeterminate') => {
          if (typeof newChecked === 'boolean') {
            setChecked(newChecked);
          }
        };
        return (
          <>
            <Checkbox checked={checked} onCheckedChange={handleChange} />
            <button onClick={() => setChecked(true)}>Set True</button>
          </>
        );
      };

      render(<TestComponent />);

      const checkboxElement = screen.getByRole('checkbox');
      const button = screen.getByText('Set True');

      expect(checkboxElement).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(button);
      expect(checkboxElement).toHaveAttribute('aria-checked', 'true');
    });

    it('handles context items with counts', () => {
      const itemsWithCounts: FilterCheckboxItemProps[] = [
        { id: '1', label: 'Item 1', count: 5 },
        { id: '2', label: 'Item 2', count: 10 },
      ];

      render(<FilterCheckboxGroup items={itemsWithCounts} />);

      expect(screen.getByText('(5)')).toBeInTheDocument();
      expect(screen.getByText('(10)')).toBeInTheDocument();
    });

    it('handles empty search results', async () => {
      render(
        <FilterCheckboxGroup
          items={[{ id: '1', label: 'Test Item' }]}
          searchable={true}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search filters...');
      await userEvent.type(searchInput, 'nonexistent');

      expect(screen.getByText(/No filters found for/)).toBeInTheDocument();
    });
  });
});
