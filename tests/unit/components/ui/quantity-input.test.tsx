import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  QuantityInput,
  type QuantityInputProps,
} from '@/components/ui/quantity-input';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render QuantityInput with default props
 */
const renderQuantityInput = (props: Partial<QuantityInputProps> = {}) => {
  const defaultProps: QuantityInputProps = {
    ...props,
  };

  return render(<QuantityInput {...defaultProps} />);
};

describe('QuantityInput', () => {
  describe('Basic Rendering', () => {
    test('renders input element', () => {
      renderQuantityInput();
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    test('renders increment and decrement buttons', () => {
      renderQuantityInput();
      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    });

    test('renders with label', () => {
      renderQuantityInput({ label: 'Quantity' });
      expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    });

    test('renders with placeholder', () => {
      renderQuantityInput({ placeholder: 'Enter amount' });
      expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<QuantityInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test('applies custom id', () => {
      renderQuantityInput({ id: 'custom-id' });
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    test('hides buttons when showButtons is false', () => {
      renderQuantityInput({ showButtons: false });
      expect(
        screen.queryByLabelText('Decrease quantity')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('Increase quantity')
      ).not.toBeInTheDocument();
    });
  });

  describe('Smart Stepping', () => {
    test('increments by 0.25 for values less than 10', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 1, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(1.25);
    });

    test('increments by 0.5 for values between 10 and 100', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 10, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(10.5);
    });

    test('increments by 1 for values 100 and above', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 100, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(101);
    });

    test('decrements by 0.25 for small values', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 2, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Decrease quantity'));

      expect(onChange).toHaveBeenCalledWith(1.75);
    });

    test('decrements by 0.5 for medium values', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 50, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Decrease quantity'));

      expect(onChange).toHaveBeenCalledWith(49.5);
    });

    test('decrements by 1 for large values', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 150, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Decrease quantity'));

      expect(onChange).toHaveBeenCalledWith(149);
    });

    test('snaps to nearest step when incrementing odd values', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      // Value 0.01 is not on a 0.25 step boundary - should snap to 0.25
      renderQuantityInput({ value: 0.01, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(0.25);
    });

    test('snaps to nearest step when decrementing odd values', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      // Value 0.26 is not on a 0.25 step boundary - should snap down to 0.25
      renderQuantityInput({ value: 0.26, onChange, smartStep: true });

      await user.click(screen.getByLabelText('Decrease quantity'));

      expect(onChange).toHaveBeenCalledWith(0.25);
    });

    test('starts from defaultValue when input is empty and increment clicked', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({
        value: '',
        onChange,
        smartStep: true,
        defaultValue: 1,
      });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(1.25);
    });
  });

  describe('Fixed Step', () => {
    test('uses fixed step when smartStep is false', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 5, onChange, smartStep: false, step: 0.5 });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(5.5);
    });

    test('decrements by fixed step', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 5, onChange, smartStep: false, step: 0.5 });

      await user.click(screen.getByLabelText('Decrease quantity'));

      expect(onChange).toHaveBeenCalledWith(4.5);
    });
  });

  describe('Min/Max Boundaries', () => {
    test('does not increment beyond max', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 99.9, onChange, max: 100, smartStep: true });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(100);
    });

    test('does not decrement below min', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 0.1, onChange, min: 0.01, smartStep: true });

      await user.click(screen.getByLabelText('Decrease quantity'));

      expect(onChange).toHaveBeenCalledWith(0.01);
    });

    test('disables increment button at max', () => {
      renderQuantityInput({ value: 100, max: 100 });

      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
    });

    test('disables decrement button at min', () => {
      renderQuantityInput({ value: 0.01, min: 0.01 });

      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    });

    test('clamps value on blur', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({
        value: 150,
        onChange,
        max: 100,
      });

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.tab();

      expect(onChange).toHaveBeenCalledWith(100);
    });
  });

  describe('Direct Input', () => {
    test('handles direct numeric input', async () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: '', onChange });

      const input = screen.getByRole('spinbutton');

      // Use fireEvent.change for direct input testing
      fireEvent.change(input, { target: { value: '5.5' } });

      expect(onChange).toHaveBeenCalledWith(5.5);
    });

    test('handles clearing input', async () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: 5, onChange });

      const input = screen.getByRole('spinbutton');

      // Use fireEvent.change to simulate clearing
      fireEvent.change(input, { target: { value: '' } });

      expect(onChange).toHaveBeenCalledWith('');
    });

    test('does not call onChange with NaN for invalid input', () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: 5, onChange });

      const input = screen.getByRole('spinbutton');

      // When native number input receives invalid text like "abc",
      // the browser clears the value to empty string
      fireEvent.change(input, { target: { value: 'abc' } });

      // Since 'abc' when parsed is NaN, component should not call onChange
      // The browser may convert this to empty string, which triggers onChange('')
      // But the component should never call onChange with a NaN value
      const calls = onChange.mock.calls;
      calls.forEach(call => {
        const value = call[0];
        if (typeof value === 'number') {
          expect(isNaN(value)).toBe(false);
        }
      });
    });
  });

  describe('Keyboard Support', () => {
    test('increments on ArrowUp', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 5, onChange, smartStep: true });

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('{ArrowUp}');

      expect(onChange).toHaveBeenCalledWith(5.25);
    });

    test('decrements on ArrowDown', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 5, onChange, smartStep: true });

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(onChange).toHaveBeenCalledWith(4.75);
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderQuantityInput({ size: 'sm' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('h-8');
    });

    test('applies default size classes', () => {
      renderQuantityInput({ size: 'default' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('h-9');
    });

    test('applies large size classes', () => {
      renderQuantityInput({ size: 'lg' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('h-11');
    });
  });

  describe('States', () => {
    test('applies error state classes', () => {
      renderQuantityInput({ state: 'error' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('border-destructive');
    });

    test('applies success state classes', () => {
      renderQuantityInput({ state: 'success' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('border-success');
    });

    test('applies warning state classes', () => {
      renderQuantityInput({ state: 'warning' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('border-warning');
    });

    test('error text overrides state', () => {
      renderQuantityInput({ state: 'success', errorText: 'Error message' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('border-destructive');
    });
  });

  describe('Helper and Error Text', () => {
    test('renders helper text', () => {
      renderQuantityInput({ helperText: 'This is helper text' });
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    test('renders error text', () => {
      renderQuantityInput({ errorText: 'This is an error' });
      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    test('error text overrides helper text', () => {
      renderQuantityInput({
        helperText: 'Helper text',
        errorText: 'Error text',
      });
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    test('error text has correct ARIA attributes', () => {
      renderQuantityInput({
        errorText: 'Error message',
        id: 'test-input',
      });
      const input = screen.getByRole('spinbutton');
      const errorId = 'test-input-error';

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

  describe('Disabled State', () => {
    test('disables input when disabled', () => {
      renderQuantityInput({ disabled: true });
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });

    test('disables both buttons when disabled', () => {
      renderQuantityInput({ disabled: true });
      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
    });

    test('does not call onChange when clicking disabled buttons', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({ value: 5, onChange, disabled: true });

      // The button is disabled, so clicking it should not trigger onChange
      const incrementBtn = screen.getByLabelText('Increase quantity');
      await user.click(incrementBtn);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Precision', () => {
    test('respects precision setting', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      // 1.111 is not on a 0.25 boundary, so it snaps up to 1.25
      renderQuantityInput({
        value: 1.111,
        onChange,
        smartStep: true,
        precision: 3,
      });

      await user.click(screen.getByLabelText('Increase quantity'));

      expect(onChange).toHaveBeenCalledWith(1.25);
    });

    test('rounds on blur to precision', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      renderQuantityInput({
        value: 1.999,
        onChange,
        precision: 2,
        min: 0.01,
        max: 100,
      });

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.tab();

      expect(onChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderQuantityInput({ label: 'Quantity' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations with error', async () => {
      const { container } = renderQuantityInput({
        label: 'Quantity',
        errorText: 'This field has an error',
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has correct ARIA value attributes', () => {
      renderQuantityInput({
        value: 5,
        min: 1,
        max: 100,
      });

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-valuemin', '1');
      expect(input).toHaveAttribute('aria-valuemax', '100');
      expect(input).toHaveAttribute('aria-valuenow', '5');
    });

    test('buttons have accessible labels', () => {
      renderQuantityInput();

      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    });

    test('buttons are not in tab order', () => {
      renderQuantityInput();

      expect(screen.getByLabelText('Decrease quantity')).toHaveAttribute(
        'tabindex',
        '-1'
      );
      expect(screen.getByLabelText('Increase quantity')).toHaveAttribute(
        'tabindex',
        '-1'
      );
    });
  });

  describe('Component Display Name', () => {
    test('has correct display name', () => {
      expect(QuantityInput.displayName).toBe('QuantityInput');
    });
  });

  describe('Custom Styling', () => {
    test('applies custom className to wrapper', () => {
      renderQuantityInput({ className: 'custom-wrapper-class' });
      const wrapper = screen.getByRole('spinbutton').closest('div');
      expect(wrapper).toHaveClass('custom-wrapper-class');
    });

    test('applies custom containerClassName', () => {
      renderQuantityInput({ containerClassName: 'custom-container-class' });
      const container = screen
        .getByRole('spinbutton')
        .closest('div')?.parentElement;
      expect(container).toHaveClass('custom-container-class');
    });
  });

  describe('Press and Hold', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('increments rapidly when holding increment button', async () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: 1, onChange, smartStep: true });

      const incrementBtn = screen.getByLabelText('Increase quantity');

      // Initial click
      fireEvent.click(incrementBtn);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(1.25);

      // Start holding
      fireEvent.mouseDown(incrementBtn);

      // Advance past initial delay (400ms)
      jest.advanceTimersByTime(400);

      // Should start rapid firing at 75ms intervals
      jest.advanceTimersByTime(75);
      expect(onChange.mock.calls.length).toBeGreaterThan(1);

      // Continue advancing to see more calls
      jest.advanceTimersByTime(150);
      expect(onChange.mock.calls.length).toBeGreaterThan(3);

      // Release
      fireEvent.mouseUp(incrementBtn);

      // No more calls after release
      const callsAtRelease = onChange.mock.calls.length;
      jest.advanceTimersByTime(300);
      expect(onChange.mock.calls.length).toBe(callsAtRelease);
    });

    test('decrements rapidly when holding decrement button', async () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: 5, onChange, smartStep: true });

      const decrementBtn = screen.getByLabelText('Decrease quantity');

      // Initial click
      fireEvent.click(decrementBtn);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(4.75);

      // Start holding
      fireEvent.mouseDown(decrementBtn);

      // Advance past initial delay (400ms)
      jest.advanceTimersByTime(400);

      // Should start rapid firing
      jest.advanceTimersByTime(75);
      expect(onChange.mock.calls.length).toBeGreaterThan(1);

      // Release
      fireEvent.mouseUp(decrementBtn);
    });

    test('stops incrementing when mouse leaves button while held', async () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: 1, onChange, smartStep: true });

      const incrementBtn = screen.getByLabelText('Increase quantity');

      // Start holding
      fireEvent.mouseDown(incrementBtn);

      // Advance past initial delay
      jest.advanceTimersByTime(400);

      // Get some rapid fire calls
      jest.advanceTimersByTime(150);
      const callsBeforeLeave = onChange.mock.calls.length;

      // Mouse leaves the button
      fireEvent.mouseLeave(incrementBtn);

      // Advance time - should not increment anymore
      jest.advanceTimersByTime(300);
      expect(onChange.mock.calls.length).toBe(callsBeforeLeave);
    });

    test('does not start rapid fire for disabled buttons', () => {
      const onChange = jest.fn();

      renderQuantityInput({ value: 5, onChange, disabled: true });

      const incrementBtn = screen.getByLabelText('Increase quantity');

      fireEvent.mouseDown(incrementBtn);
      jest.advanceTimersByTime(500);

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
