import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input, type InputProps } from '@/components/ui/input';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Input with default props
 */
const renderInput = (props: Partial<InputProps> = {}) => {
  const defaultProps: InputProps = {
    ...props,
  };

  return render(<Input {...defaultProps} />);
};

describe('Input', () => {
  describe('Basic Rendering', () => {
    test('renders input element', () => {
      renderInput();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('renders with label', () => {
      renderInput({ label: 'Test Label' });
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    test('renders with placeholder', () => {
      renderInput({ placeholder: 'Test placeholder' });
      expect(
        screen.getByPlaceholderText('Test placeholder')
      ).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test('applies custom id', () => {
      renderInput({ id: 'custom-id' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    test('generates unique id when not provided', () => {
      const { unmount } = renderInput();
      const input1 = screen.getByRole('textbox');
      const id1 = input1.getAttribute('id');
      unmount();

      renderInput();
      const input2 = screen.getByRole('textbox');
      const id2 = input2.getAttribute('id');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });
  });

  describe('Input Types', () => {
    const inputTypes = [
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
      'search',
    ] as const;

    inputTypes.forEach(type => {
      test(`renders ${type} input correctly`, () => {
        renderInput({ type });

        // Password inputs don't have an accessible role, so we use a different approach
        if (type === 'password') {
          const input = document.querySelector('input[type="password"]');
          expect(input).toBeInTheDocument();
          expect(input).toHaveAttribute('type', type);
        } else {
          // For other types, use role-based queries
          const roleMap: Record<string, string> = {
            text: 'textbox',
            email: 'textbox',
            number: 'spinbutton',
            tel: 'textbox',
            url: 'textbox',
            search: 'searchbox',
          };

          const input = screen.getByRole(roleMap[type]);
          expect(input).toHaveAttribute('type', type);
        }
      });
    });
  });

  describe('Variants', () => {
    test('applies default variant classes', () => {
      renderInput({ variant: 'default' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-input');
    });

    test('applies filled variant classes', () => {
      renderInput({ variant: 'filled' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-transparent', 'bg-muted');
    });

    test('applies outlined variant classes', () => {
      renderInput({ variant: 'outlined' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-2', 'bg-transparent');
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderInput({ size: 'sm' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-8', 'text-xs');
    });

    test('applies default size classes', () => {
      renderInput({ size: 'default' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-9', 'text-sm');
    });

    test('applies large size classes', () => {
      renderInput({ size: 'lg' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-11', 'text-base');
    });
  });

  describe('States', () => {
    test('applies error state classes', () => {
      renderInput({ state: 'error' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
    });

    test('applies success state classes', () => {
      renderInput({ state: 'success' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-success');
    });

    test('applies warning state classes', () => {
      renderInput({ state: 'warning' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-warning');
    });

    test('error text overrides state', () => {
      renderInput({ state: 'success', errorText: 'Error message' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
    });
  });

  describe('Labels', () => {
    test('associates label with input', () => {
      renderInput({ label: 'Test Label', id: 'test-input' });
      const label = screen.getByText('Test Label');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    test('shows required indicator', () => {
      renderInput({ label: 'Required Field', required: true });
      const label = screen.getByText('Required Field').closest('label');
      expect(label).toHaveClass("after:content-['*']");
    });

    test('applies label state classes', () => {
      renderInput({
        label: 'Error Label',
        errorText: 'Error message',
        labelClassName: 'test-label-class',
      });
      const label = screen.getByText('Error Label');
      expect(label).toHaveClass('text-destructive', 'test-label-class');
    });

    describe('Floating Labels', () => {
      test('renders floating label', () => {
        renderInput({
          label: 'Floating Label',
          floatingLabel: true,
        });
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('peer', 'placeholder-transparent');
      });

      test('floating label shows required indicator', () => {
        renderInput({
          label: 'Required Floating',
          floatingLabel: true,
          required: true,
        });
        expect(screen.getByText('*')).toBeInTheDocument();
      });
    });
  });

  describe('Helper and Error Text', () => {
    test('renders helper text', () => {
      renderInput({ helperText: 'This is helper text' });
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    test('renders error text', () => {
      renderInput({ errorText: 'This is an error' });
      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    test('error text overrides helper text', () => {
      renderInput({
        helperText: 'Helper text',
        errorText: 'Error text',
      });
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    test('helper text has correct ARIA attributes', () => {
      renderInput({
        helperText: 'Helper text',
        id: 'test-input',
      });
      const input = screen.getByRole('textbox');
      const helperId = `test-input-helper`;

      expect(input).toHaveAttribute('aria-describedby', helperId);
      expect(screen.getByText('Helper text')).toHaveAttribute('id', helperId);
    });

    test('error text has correct ARIA attributes', () => {
      renderInput({
        errorText: 'Error message',
        id: 'test-input',
      });
      const input = screen.getByRole('textbox');
      const errorId = `test-input-error`;

      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining(errorId)
      );
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Error message')).toHaveAttribute('id', errorId);
      expect(screen.getByText('Error message')).toHaveAttribute(
        'role',
        'alert'
      );
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    test('renders left icon', () => {
      renderInput({ leftIcon: <TestIcon /> });
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('renders right icon', () => {
      renderInput({ rightIcon: <TestIcon /> });
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('adjusts padding for left icon', () => {
      renderInput({ leftIcon: <TestIcon /> });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-9');
    });

    test('adjusts padding for right icon', () => {
      renderInput({ rightIcon: <TestIcon /> });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-9');
    });

    test('adjusts padding for both icons', () => {
      renderInput({
        leftIcon: <TestIcon />,
        rightIcon: <TestIcon />,
      });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-9', 'pr-9');
    });
  });

  describe('Clear Functionality', () => {
    test('shows clear button when clearable and has value', () => {
      renderInput({ clearable: true, value: 'test value' });
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    test('does not show clear button when no value', () => {
      renderInput({ clearable: true, value: '' });
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    test('does not show clear button when disabled', () => {
      renderInput({ clearable: true, value: 'test', disabled: true });
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    test('calls onClear when clear button clicked', async () => {
      const onClear = jest.fn();
      const user = userEvent.setup();

      renderInput({
        clearable: true,
        value: 'test value',
        onClear,
      });

      const clearButton = screen.getByLabelText('Clear input');
      await user.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    test('calls onChange with empty value when no onClear provided', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderInput({
        clearable: true,
        value: 'test value',
        onChange,
      });

      const clearButton = screen.getByLabelText('Clear input');
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' }),
        })
      );
    });

    test('adjusts padding when clear button is shown', () => {
      renderInput({ clearable: true, value: 'test' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-9');
    });
  });

  describe('Loading State', () => {
    test('shows loading spinner', () => {
      renderInput({ loading: true });
      const spinner = screen
        .getByRole('textbox')
        .parentElement?.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    test('disables input when loading', () => {
      renderInput({ loading: true });
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('hides clear button when loading', () => {
      renderInput({
        loading: true,
        clearable: true,
        value: 'test',
      });
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    test('adjusts padding when loading', () => {
      renderInput({ loading: true });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-9');
    });
  });

  describe('Character Count', () => {
    test('shows character count when enabled', () => {
      renderInput({
        showCharacterCount: true,
        value: 'test',
      });
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    test('shows character limit', () => {
      renderInput({
        showCharacterCount: true,
        characterLimit: 10,
        value: 'test',
      });
      expect(screen.getByText('4/10')).toBeInTheDocument();
    });

    test('shows warning state near limit', () => {
      renderInput({
        showCharacterCount: true,
        characterLimit: 10,
        value: '12345678', // 8 chars, 80% of limit
      });
      const counter = screen.getByText('8/10');
      expect(counter).toHaveClass('text-warning');
    });

    test('shows error state over limit', () => {
      renderInput({
        showCharacterCount: true,
        characterLimit: 5,
        value: '123456', // 6 chars, over limit
      });
      const counter = screen.getByText('6/5');
      expect(counter).toHaveClass('text-destructive');
    });
  });

  describe('User Interactions', () => {
    test('handles typing', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderInput({ onChange });
      const input = screen.getByRole('textbox');

      await user.type(input, 'hello');

      expect(onChange).toHaveBeenCalledTimes(5); // One call per character
      expect(input).toHaveValue('hello');
    });

    test('handles focus and blur', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const user = userEvent.setup();

      renderInput({ onFocus, onBlur });
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(onFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('handles keyboard navigation', async () => {
      const user = userEvent.setup();

      renderInput({ value: 'test value' });
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.click(input);
      await user.keyboard('{Home}');

      expect(input.selectionStart).toBe(0);
    });
  });

  describe('Form Integration', () => {
    test('works with form submission', () => {
      const onSubmit = jest.fn();

      render(
        <form onSubmit={onSubmit}>
          <Input name="testField" value="test value" onChange={() => {}} />
          <button type="submit">Submit</button>
        </form>
      );

      fireEvent.submit(screen.getByRole('button'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test('supports required validation', () => {
      renderInput({ required: true });
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toBeRequired();
    });

    test('supports disabled state', () => {
      renderInput({ disabled: true });
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass(
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
    });

    test('supports readonly state', () => {
      renderInput({ readOnly: true });
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Custom Styling', () => {
    test('applies custom className', () => {
      renderInput({ className: 'custom-input-class' });
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input-class');
    });

    test('applies custom container className', () => {
      renderInput({ containerClassName: 'custom-container-class' });
      const container = screen
        .getByRole('textbox')
        .closest('.relative')?.parentElement;
      expect(container).toHaveClass('custom-container-class');
    });

    test('applies custom label className', () => {
      renderInput({
        label: 'Test Label',
        labelClassName: 'custom-label-class',
      });
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('custom-label-class');
    });

    test('applies custom helper className', () => {
      renderInput({
        helperText: 'Helper text',
        helperClassName: 'custom-helper-class',
      });
      const helper = screen.getByText('Helper text');
      expect(helper).toHaveClass('custom-helper-class');
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderInput({ label: 'Accessible Input' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations with error', async () => {
      const { container } = renderInput({
        label: 'Input with Error',
        errorText: 'This field has an error',
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations with icons', async () => {
      const { container } = renderInput({
        label: 'Input with Icons',
        leftIcon: <span>🔍</span>,
        rightIcon: <span>📧</span>,
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('maintains proper ARIA relationships', () => {
      renderInput({
        label: 'Test Input',
        helperText: 'Helper text',
        errorText: 'Error text',
        id: 'test-input',
      });

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('test-input-error')
      );
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('announces error changes to screen readers', () => {
      renderInput({
        errorText: 'This field is required',
        id: 'test-input',
      });

      const errorElement = screen.getByText('This field is required');
      expect(errorElement).toHaveAttribute('role', 'alert');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Component Display Name', () => {
    test('has correct display name', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Integration with tailwind-merge', () => {
    test('handles conflicting classes correctly', () => {
      renderInput({
        className: 'border-destructive h-12',
        variant: 'default',
        size: 'sm',
      });
      const input = screen.getByRole('textbox');

      // Should have custom classes
      expect(input.className).toContain('border-destructive');
      expect(input.className).toContain('h-12');
    });
  });
});
