import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  RadioGroup,
  RadioGroupRoot,
  RadioInput,
  RadioIcon,
  RadioLabel,
  RadioDescription,
  RadioField,
  RecipeRadioGroup,
  RecipeRadioItem,
  AnimatedRadio,
  RadioCard,
} from '@/components/ui/radio';
import type { RadioOption, RecipeRadioOption } from '@/types/ui/radio';

expect.extend(toHaveNoViolations);

describe('RadioGroup Components', () => {
  const mockOptions: RadioOption[] = [
    { id: 'option1', value: 'value1', label: 'Option 1' },
    { id: 'option2', value: 'value2', label: 'Option 2' },
    { id: 'option3', value: 'value3', label: 'Option 3', disabled: true },
  ];

  const recipeOptions: RecipeRadioOption[] = [
    {
      id: 'italian',
      value: 'italian',
      label: 'Italian',
      description: 'Classic Italian cuisine',
      count: 24,
      context: 'cuisine',
    },
    {
      id: 'mexican',
      value: 'mexican',
      label: 'Mexican',
      description: 'Spicy Mexican dishes',
      count: 18,
      context: 'cuisine',
    },
  ];

  describe('RadioGroup', () => {
    it('renders correctly with basic props', () => {
      render(<RadioGroup options={mockOptions} />);

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
    });

    it('handles controlled value correctly', () => {
      const onValueChange = jest.fn();
      render(
        <RadioGroup
          options={mockOptions}
          value="value1"
          onValueChange={onValueChange}
        />
      );

      const option1 = screen.getByLabelText('Option 1');
      const option2 = screen.getByLabelText('Option 2');

      expect(option1).toBeChecked();
      expect(option2).not.toBeChecked();

      fireEvent.click(option2);
      expect(onValueChange).toHaveBeenCalledWith('value2');
    });

    it('handles uncontrolled value with defaultValue', () => {
      render(<RadioGroup options={mockOptions} defaultValue="value2" />);

      const option1 = screen.getByLabelText('Option 1');
      const option2 = screen.getByLabelText('Option 2');

      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
    });

    it('handles disabled state correctly', () => {
      render(<RadioGroup options={mockOptions} disabled />);

      const radioGroup = screen.getByRole('radiogroup');
      const option1 = screen.getByLabelText('Option 1');
      const option3 = screen.getByLabelText('Option 3');

      expect(radioGroup).toHaveAttribute('aria-disabled', 'true');
      expect(option1).toBeDisabled();
      expect(option3).toBeDisabled();
    });

    it('handles individual option disabled state', () => {
      render(<RadioGroup options={mockOptions} />);

      const option1 = screen.getByLabelText('Option 1');
      const option3 = screen.getByLabelText('Option 3');

      expect(option1).not.toBeDisabled();
      expect(option3).toBeDisabled();
    });

    it('displays error message correctly', () => {
      const errorMessage = 'Please select an option';
      render(<RadioGroup options={mockOptions} error={errorMessage} />);

      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      expect(screen.getByRole('radiogroup')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('displays helper text correctly', () => {
      const helperText = 'Choose your preferred option';
      render(<RadioGroup options={mockOptions} helperText={helperText} />);

      expect(screen.getByText(helperText)).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={mockOptions} />);

      // Focus the first radio option (this is how Radix UI works)
      await user.tab();
      expect(screen.getByLabelText('Option 1')).toHaveFocus();

      // Navigate with arrow keys
      await user.keyboard('{ArrowDown}');
      expect(screen.getByLabelText('Option 2')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByLabelText('Option 1')).toHaveFocus();

      // Select with space or enter
      await user.keyboard(' ');
      expect(screen.getByLabelText('Option 1')).toBeChecked();
    });

    it('supports different orientations', () => {
      const { rerender } = render(
        <RadioGroup options={mockOptions} orientation="horizontal" />
      );

      expect(screen.getByRole('radiogroup')).toHaveClass('flex-row');

      rerender(<RadioGroup options={mockOptions} orientation="vertical" />);
      expect(screen.getByRole('radiogroup')).toHaveClass('flex-col');
    });

    it('supports different sizes', () => {
      const { rerender } = render(
        <RadioGroup options={mockOptions} size="sm" />
      );

      const option1 = screen.getByLabelText('Option 1');
      expect(option1).toHaveClass('h-4', 'w-4');

      rerender(<RadioGroup options={mockOptions} size="lg" />);
      expect(screen.getByLabelText('Option 1')).toHaveClass('h-6', 'w-6');
    });

    it('supports different variants', () => {
      const { rerender } = render(
        <RadioGroup options={mockOptions} variant="success" />
      );

      const option1 = screen.getByLabelText('Option 1');
      expect(option1).toHaveClass('data-[state=checked]:bg-success');

      rerender(<RadioGroup options={mockOptions} variant="danger" />);
      expect(screen.getByLabelText('Option 1')).toHaveClass(
        'data-[state=checked]:bg-destructive'
      );
    });

    it('handles required validation', () => {
      render(<RadioGroup options={mockOptions} required />);

      expect(screen.getByRole('radiogroup')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('passes accessibility tests', async () => {
      const { container } = render(<RadioGroup options={mockOptions} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('RadioGroupRoot compound component', () => {
    it('renders compound components correctly', () => {
      render(
        <RadioGroupRoot defaultValue="value1">
          <RadioInput value="value1" id="option1" />
          <RadioLabel htmlFor="option1">Option 1</RadioLabel>
          <RadioDescription>Description for option 1</RadioDescription>
        </RadioGroupRoot>
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Description for option 1')).toBeInTheDocument();
    });

    it('manages state correctly in compound components', () => {
      const onValueChange = jest.fn();
      render(
        <RadioGroupRoot onValueChange={onValueChange}>
          <RadioInput value="value1" id="option1" />
          <RadioLabel htmlFor="option1">Option 1</RadioLabel>
          <RadioInput value="value2" id="option2" />
          <RadioLabel htmlFor="option2">Option 2</RadioLabel>
        </RadioGroupRoot>
      );

      const option1 = screen.getByRole('radio', { name: /Option 1/ });
      fireEvent.click(option1);
      expect(onValueChange).toHaveBeenCalledWith('value1');
    });

    it('provides context to child components', () => {
      render(
        <RadioGroupRoot defaultValue="value1" disabled>
          <RadioInput value="value1" id="option1" />
          <RadioLabel htmlFor="option1">Option 1</RadioLabel>
        </RadioGroupRoot>
      );

      const option1 = screen.getByRole('radio', { name: /Option 1/ });
      expect(option1).toBeDisabled();
    });
  });

  describe('RadioField', () => {
    it('renders form field wrapper correctly', () => {
      render(<RadioField options={mockOptions} />);

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('displays field error correctly', () => {
      const errorMessage = 'Field is required';
      render(<RadioField options={mockOptions} error={errorMessage} />);

      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });

  describe('RecipeRadioGroup', () => {
    it('renders recipe radio group correctly', () => {
      render(
        <RecipeRadioGroup
          title="Choose Cuisine"
          options={recipeOptions}
          variant="categories"
        />
      );

      expect(screen.getByText('Choose Cuisine')).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: /Italian/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: /Mexican/ })
      ).toBeInTheDocument();
    });

    it('displays option counts when enabled', () => {
      render(<RecipeRadioGroup options={recipeOptions} showCounts />);

      expect(screen.getByText('(24)')).toBeInTheDocument();
      expect(screen.getByText('(18)')).toBeInTheDocument();
    });

    it('hides option counts when disabled', () => {
      render(<RecipeRadioGroup options={recipeOptions} showCounts={false} />);

      expect(screen.queryByText('(24)')).not.toBeInTheDocument();
      expect(screen.queryByText('(18)')).not.toBeInTheDocument();
    });

    it('handles recipe-specific contexts', () => {
      render(<RecipeRadioGroup options={recipeOptions} variant="dietary" />);

      const radioGroup = screen.getByRole('radiogroup').parentElement;
      expect(radioGroup).toHaveClass('border-success/20');
    });

    it('supports different layouts', () => {
      const { rerender } = render(
        <RecipeRadioGroup options={recipeOptions} layout="horizontal" />
      );

      const container = screen.getByRole('radiogroup');
      expect(container).toHaveClass('flex-wrap');

      rerender(<RecipeRadioGroup options={recipeOptions} layout="grid" />);
      expect(screen.getByRole('radiogroup')).toHaveClass('grid');
    });

    it('manages recipe filter selection', () => {
      const onValueChange = jest.fn();
      render(
        <RecipeRadioGroup
          options={recipeOptions}
          onValueChange={onValueChange}
        />
      );

      const italianOption = screen.getByRole('radio', { name: /Italian/ });
      fireEvent.click(italianOption);
      expect(onValueChange).toHaveBeenCalledWith('italian');
    });
  });

  describe('AnimatedRadio', () => {
    it('renders with animation classes', () => {
      render(
        <AnimatedRadio
          options={mockOptions}
          animation="scale"
          animationDuration={300}
        />
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('transition-transform');
    });

    it('handles loading state correctly', () => {
      render(<AnimatedRadio options={mockOptions} loading />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('opacity-75');
    });

    it('applies bounce animation', () => {
      render(<AnimatedRadio options={mockOptions} animation="bounce" />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('hover:animate-pulse');
    });

    it('applies glow animation', () => {
      render(<AnimatedRadio options={mockOptions} animation="glow" />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('transition-all');
    });
  });

  describe('RadioCard', () => {
    it('renders card layout correctly', () => {
      render(
        <RadioCard
          value="recipe1"
          label="Spaghetti Carbonara"
          description="Classic Italian pasta dish"
        />
      );

      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(
        screen.getByText('Classic Italian pasta dish')
      ).toBeInTheDocument();
    });

    it('handles selection correctly', () => {
      const onSelect = jest.fn();
      render(
        <RadioCard
          value="recipe1"
          label="Spaghetti Carbonara"
          onSelect={onSelect}
        />
      );

      const card = screen.getByText('Spaghetti Carbonara').closest('div');
      fireEvent.click(card!);
      expect(onSelect).toHaveBeenCalledWith('recipe1');
    });

    it('displays badge when provided', () => {
      render(
        <RadioCard
          value="recipe1"
          label="Spaghetti Carbonara"
          badge={<span>Popular</span>}
        />
      );

      expect(screen.getByText('Popular')).toBeInTheDocument();
    });

    it('shows selected state correctly', () => {
      render(
        <RadioCard value="recipe1" label="Spaghetti Carbonara" selected />
      );

      const card = screen.getByRole('button');
      expect(card).toHaveClass('border-primary');
    });

    it('handles disabled state', () => {
      const onSelect = jest.fn();
      render(
        <RadioCard
          value="recipe1"
          label="Spaghetti Carbonara"
          disabled
          onSelect={onSelect}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(onSelect).not.toHaveBeenCalled();
      expect(card).toHaveClass('opacity-50');
    });

    it('displays image when provided', () => {
      render(
        <RadioCard
          value="recipe1"
          label="Spaghetti Carbonara"
          image="/recipe-image.jpg"
        />
      );

      const image = screen.getByRole('presentation');
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('recipe-image.jpg')
      );
    });
  });

  describe('Individual compound components', () => {
    describe('RadioInput', () => {
      it('renders within context correctly', () => {
        render(
          <RadioGroupRoot>
            <RadioInput value="test" />
          </RadioGroupRoot>
        );

        expect(screen.getByRole('radio')).toBeInTheDocument();
      });

      it('handles loading state', () => {
        render(
          <RadioGroupRoot>
            <RadioInput value="test" loading />
          </RadioGroupRoot>
        );

        const input = screen.getByRole('radio');
        expect(input).toBeDisabled();
      });
    });

    describe('RadioIcon', () => {
      it('renders icon correctly', () => {
        render(
          <RadioGroupRoot>
            <RadioIcon />
          </RadioGroupRoot>
        );

        expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      });

      it('handles checked state', () => {
        render(
          <RadioGroupRoot>
            <RadioIcon checked />
          </RadioGroupRoot>
        );

        const icon = document.querySelector('.opacity-100');
        expect(icon).toBeInTheDocument();
      });
    });

    describe('RadioLabel', () => {
      it('renders label correctly', () => {
        render(
          <RadioGroupRoot>
            <RadioLabel>Test Label</RadioLabel>
          </RadioGroupRoot>
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
      });

      it('shows required indicator', () => {
        render(
          <RadioGroupRoot>
            <RadioLabel required>Required Label</RadioLabel>
          </RadioGroupRoot>
        );

        const label = screen.getByText('Required Label');
        expect(label).toHaveClass("after:content-['*']");
      });
    });

    describe('RadioDescription', () => {
      it('renders description correctly', () => {
        render(
          <RadioGroupRoot>
            <RadioDescription>Test description</RadioDescription>
          </RadioGroupRoot>
        );

        expect(screen.getByText('Test description')).toBeInTheDocument();
      });

      it('applies size variants correctly', () => {
        render(
          <RadioGroupRoot>
            <RadioDescription size="lg">Large description</RadioDescription>
          </RadioGroupRoot>
        );

        const description = screen.getByText('Large description');
        expect(description).toHaveClass('text-base');
      });
    });
  });

  describe('Accessibility', () => {
    it('supports screen readers correctly', () => {
      render(
        <RadioGroup
          options={mockOptions}
          aria-label="Choose an option"
          required
        />
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-label', 'Choose an option');
      expect(radioGroup).toHaveAttribute('aria-required', 'true');
    });

    it('associates error messages correctly', () => {
      render(
        <RadioGroup options={mockOptions} error="Please select an option" />
      );

      const radioGroup = screen.getByRole('radiogroup');
      const errorMessage = screen.getByRole('alert');

      expect(radioGroup).toHaveAttribute('aria-invalid', 'true');
      expect(radioGroup).toHaveAttribute('aria-describedby');
      expect(errorMessage).toBeInTheDocument();
    });

    it('handles focus management correctly', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={mockOptions} />);

      // Focus moves to first radio option when tabbing into the group
      await user.tab();
      expect(screen.getByLabelText('Option 1')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      const secondOption = screen.getByLabelText('Option 2');
      await waitFor(() => {
        expect(secondOption).toHaveFocus();
      });
    });

    it('skips disabled options in keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={mockOptions} />);

      await user.tab();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Should skip disabled option 3 and go back to option 1
      const firstOption = screen.getByLabelText('Option 1');
      await waitFor(() => {
        expect(firstOption).toHaveFocus();
      });
    });

    it('passes comprehensive accessibility audit', async () => {
      const { container } = render(
        <div>
          <RadioGroup
            options={mockOptions}
            value="value1"
            onValueChange={() => {}}
            error="Error message"
            helperText="Helper text"
            required
          />
          <RecipeRadioGroup
            title="Recipe Selection"
            options={recipeOptions}
            value="italian"
            onValueChange={() => {}}
          />
          <AnimatedRadio options={mockOptions} animation="scale" />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge cases and error handling', () => {
    it('handles empty options array', () => {
      render(<RadioGroup options={[]} />);
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('handles missing option IDs gracefully', () => {
      const invalidOptions = [{ id: '', value: 'value1', label: 'Option 1' }];
      render(<RadioGroup options={invalidOptions} />);
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('handles rapid value changes correctly', async () => {
      const onValueChange = jest.fn();
      render(
        <RadioGroup options={mockOptions} onValueChange={onValueChange} />
      );

      const option1 = screen.getByLabelText('Option 1');
      const option2 = screen.getByLabelText('Option 2');

      fireEvent.click(option1);
      fireEvent.click(option2);
      fireEvent.click(option1);

      expect(onValueChange).toHaveBeenCalledTimes(3);
      expect(onValueChange).toHaveBeenLastCalledWith('value1');
    });

    it('maintains selection when options change', () => {
      const { rerender } = render(
        <RadioGroup options={mockOptions} value="value2" />
      );

      expect(screen.getByLabelText('Option 2')).toBeChecked();

      const newOptions = [
        ...mockOptions,
        { id: 'option4', value: 'value4', label: 'Option 4' },
      ];

      rerender(<RadioGroup options={newOptions} value="value2" />);
      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });

    it('handles undefined value gracefully', () => {
      render(<RadioGroup options={mockOptions} value={undefined} />);

      mockOptions.forEach(option => {
        if (!option.disabled) {
          expect(
            screen.getByLabelText(option.label as string)
          ).not.toBeChecked();
        }
      });
    });
  });
});
