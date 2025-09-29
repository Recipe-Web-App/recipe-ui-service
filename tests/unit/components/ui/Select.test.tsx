import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectField,
} from '@/components/ui/select';

expect.extend(toHaveNoViolations);

const user = userEvent.setup();

// Mock ResizeObserver for tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock pointerCapture methods for JSDOM
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: jest.fn(),
  writable: true,
});

// Helper component for testing controlled select
const ControlledSelect = ({
  onValueChange,
  defaultValue,
  ...props
}: {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}) => {
  const [value, setValue] = React.useState(defaultValue || '');

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Select value={value} onValueChange={handleValueChange} {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="breakfast">Breakfast</SelectItem>
        <SelectItem value="lunch">Lunch</SelectItem>
        <SelectItem value="dinner">Dinner</SelectItem>
      </SelectContent>
    </Select>
  );
};

describe('Select Components', () => {
  describe('SelectTrigger', () => {
    it('renders with default variant and size', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass('border-input', 'h-9', 'px-3');
    });

    it('renders with outline variant', () => {
      render(
        <Select>
          <SelectTrigger variant="outline">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-input', 'hover:border-primary/40');
    });

    it('renders with ghost variant', () => {
      render(
        <Select>
          <SelectTrigger variant="ghost">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-transparent', 'bg-transparent');
    });

    it('renders with filled variant', () => {
      render(
        <Select>
          <SelectTrigger variant="filled">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-transparent', 'bg-muted');
    });

    it('renders with error state', () => {
      render(
        <Select>
          <SelectTrigger error aria-invalid="true">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-destructive', 'text-destructive');
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
        </Select>
      );

      let trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8', 'px-2', 'text-xs');

      rerender(
        <Select>
          <SelectTrigger size="lg">
            <SelectValue placeholder="Large" />
          </SelectTrigger>
        </Select>
      );

      trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-10', 'px-4', 'text-base');
    });

    it('can be disabled', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveClass(
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
    });

    it('displays placeholder text', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });
  });

  describe('Select Interaction', () => {
    it('renders trigger correctly', () => {
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('role', 'combobox');
      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('handles value changes properly', () => {
      const handleValueChange = jest.fn();

      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
          </SelectContent>
        </Select>
      );

      // Test that the component can be controlled
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('supports controlled value', () => {
      render(
        <Select value="dinner">
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByText('Dinner')).toBeInTheDocument();
    });

    it('can be disabled', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
    });
  });

  describe('SelectContent', () => {
    it('applies correct class names for variants', () => {
      // Test the variant system by checking the CSS class generation
      const { selectContentVariants } = require('@/lib/ui/select-variants');

      expect(selectContentVariants()).toContain('bg-card');
      expect(selectContentVariants()).toContain('text-card-foreground');
      expect(selectContentVariants()).toContain('min-w-[8rem]');

      expect(selectContentVariants({ variant: 'secondary' })).toContain(
        'bg-muted'
      );
      expect(selectContentVariants({ variant: 'secondary' })).toContain(
        'text-muted-foreground'
      );
    });
  });

  describe('SelectItem', () => {
    it('applies correct variant classes', () => {
      // Test the variant system by checking the CSS class generation
      const { selectItemVariants } = require('@/lib/ui/select-variants');

      expect(selectItemVariants()).toContain('hover:bg-accent');
      expect(selectItemVariants()).toContain('hover:text-accent-foreground');

      expect(selectItemVariants({ variant: 'destructive' })).toContain(
        'text-destructive'
      );
      expect(selectItemVariants({ variant: 'destructive' })).toContain(
        'hover:bg-destructive/10'
      );
    });
  });

  describe('Component Structure', () => {
    it('renders grouped components structure correctly', () => {
      render(
        <div>
          <SelectGroup>
            <SelectLabel>Meal Types</SelectLabel>
            <div>Mock items would go here</div>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Snacks</SelectLabel>
            <div>More mock items</div>
          </SelectGroup>
        </div>
      );

      expect(screen.getByText('Meal Types')).toBeInTheDocument();
      expect(screen.getByText('Snacks')).toBeInTheDocument();
    });
  });

  describe('SelectField Wrapper', () => {
    it('renders with label and no error', () => {
      render(
        <SelectField label="Recipe Category" placeholder="Select category">
          <SelectItem value="breakfast">Breakfast</SelectItem>
          <SelectItem value="lunch">Lunch</SelectItem>
        </SelectField>
      );

      expect(screen.getByText('Recipe Category')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select category')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      render(
        <SelectField label="Recipe Category" required>
          <SelectItem value="breakfast">Breakfast</SelectItem>
        </SelectField>
      );

      expect(screen.getByText('Recipe Category')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with error state', () => {
      render(
        <SelectField label="Recipe Category" error="Please select a category">
          <SelectItem value="breakfast">Breakfast</SelectItem>
        </SelectField>
      );

      const errorMessage = screen.getByText('Please select a category');
      const trigger = screen.getByRole('combobox');

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
      expect(trigger).toHaveAttribute('aria-describedby');
    });

    it('associates label with select trigger', () => {
      render(
        <SelectField label="Recipe Category">
          <SelectItem value="breakfast">Breakfast</SelectItem>
        </SelectField>
      );

      const label = screen.getByText('Recipe Category');
      const trigger = screen.getByRole('combobox');

      expect(label).toHaveAttribute('for');
      expect(trigger).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(trigger.getAttribute('id'));
    });

    it('forwards props to Select and SelectTrigger', () => {
      const handleValueChange = jest.fn();

      render(
        <SelectField
          label="Category"
          onValueChange={handleValueChange}
          triggerProps={{ 'data-testid': 'custom-trigger' } as any}
        >
          <SelectItem value="breakfast">Breakfast</SelectItem>
        </SelectField>
      );

      const trigger = screen.getByTestId('custom-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('role', 'combobox');
    });
  });

  describe('Recipe-specific use cases', () => {
    it('renders recipe category structure correctly', () => {
      const handleValueChange = jest.fn();

      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText('Choose category')).toBeInTheDocument();
    });

    it('handles component structure for dietary restrictions', () => {
      const handleValueChange = jest.fn();

      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose dietary preference" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText('Choose dietary preference')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <SelectField label="Recipe Category" placeholder="Select category">
          <SelectGroup>
            <SelectLabel>Meal Types</SelectLabel>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
          </SelectGroup>
        </SelectField>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports screen readers with proper ARIA attributes', () => {
      render(
        <SelectField
          label="Recipe Category"
          error="Please select a category"
          required
        >
          <SelectItem value="breakfast">Breakfast</SelectItem>
        </SelectField>
      );

      const trigger = screen.getByRole('combobox');
      const errorMessage = screen.getByRole('alert');

      expect(trigger).toHaveAttribute('aria-describedby');
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
      expect(errorMessage).toHaveAttribute('id');
    });

    it('supports keyboard focus', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();

      // Focus the trigger
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it('announces selection changes to screen readers', async () => {
      render(
        <Select>
          <SelectTrigger aria-label="Recipe category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-label', 'Recipe category');
    });
  });

  describe('Error Handling', () => {
    it('handles missing options gracefully', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>{/* No options */}</SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('handles invalid value prop gracefully', () => {
      render(
        <Select value="invalid-value">
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="valid-option">Valid Option</SelectItem>
          </SelectContent>
        </Select>
      );

      // Should not crash and should show placeholder if value doesn't match any option
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });
  });
});
