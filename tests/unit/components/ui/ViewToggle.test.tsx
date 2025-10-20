import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ViewToggle } from '@/components/ui/view-toggle';
import { useViewPreferenceStore } from '@/stores/ui/view-preference-store';
import type { ViewToggleProps } from '@/types/ui/view-toggle';
import type { ViewMode } from '@/stores/ui/view-preference-store';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Grid: ({ className, ...props }: any) => (
    <div data-testid="grid-icon" className={className} {...props} />
  ),
  List: ({ className, ...props }: any) => (
    <div data-testid="list-icon" className={className} {...props} />
  ),
}));

/**
 * Helper function to render ViewToggle with default props
 */
const renderViewToggle = (props: Partial<ViewToggleProps> = {}) => {
  return render(<ViewToggle {...props} />);
};

describe('ViewToggle Component', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useViewPreferenceStore.setState({
      viewMode: 'grid',
    });
  });

  describe('Basic Rendering', () => {
    test('renders correctly with default props', () => {
      renderViewToggle();

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeInTheDocument();
      expect(radiogroup).toHaveAttribute('aria-label', 'Switch view mode');
    });

    test('renders both grid and list buttons', () => {
      renderViewToggle();

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();
    });

    test('renders grid and list icons', () => {
      renderViewToggle();

      expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
      expect(screen.getByTestId('list-icon')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      renderViewToggle({ className: 'custom-class' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('custom-class');
    });

    test('applies custom aria-label', () => {
      renderViewToggle({ 'aria-label': 'Toggle view' });

      const radiogroup = screen.getByRole('radiogroup', {
        name: 'Toggle view',
      });
      expect(radiogroup).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ViewToggle ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Controlled Mode', () => {
    test('renders with controlled value - grid', () => {
      renderViewToggle({ value: 'grid' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'true');
      expect(listButton).toHaveAttribute('aria-checked', 'false');
    });

    test('renders with controlled value - list', () => {
      renderViewToggle({ value: 'list' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });

    test('calls onValueChange when clicking grid button', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'list', onValueChange });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      fireEvent.click(gridButton);

      expect(onValueChange).toHaveBeenCalledWith('grid');
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    test('calls onValueChange when clicking list button', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      expect(onValueChange).toHaveBeenCalledWith('list');
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    test('does not update store in controlled mode', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      // Store should remain unchanged in controlled mode
      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
    });

    test('updates when controlled value changes', () => {
      const { rerender } = render(<ViewToggle value="grid" />);

      let gridButton = screen.getByRole('radio', { name: 'Grid view' });
      let listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'true');
      expect(listButton).toHaveAttribute('aria-checked', 'false');

      rerender(<ViewToggle value="list" />);

      gridButton = screen.getByRole('radio', { name: 'Grid view' });
      listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Uncontrolled Mode', () => {
    test('uses store value by default', () => {
      useViewPreferenceStore.setState({ viewMode: 'list' });
      renderViewToggle();

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });

    test('uses defaultValue when provided', () => {
      renderViewToggle({ defaultValue: 'list' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });

    test('updates store when clicking buttons', () => {
      renderViewToggle();

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');
    });

    test('calls onValueChange in uncontrolled mode', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ onValueChange });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      expect(onValueChange).toHaveBeenCalledWith('list');
    });

    test('updates when clicking buttons in uncontrolled mode', () => {
      renderViewToggle();

      let gridButton = screen.getByRole('radio', { name: 'Grid view' });
      let listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'true');
      expect(listButton).toHaveAttribute('aria-checked', 'false');

      // Click list button
      fireEvent.click(listButton);

      gridButton = screen.getByRole('radio', { name: 'Grid view' });
      listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Size Variants', () => {
    test('renders with small size', () => {
      renderViewToggle({ size: 'sm' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('h-8');
    });

    test('renders with medium size (default)', () => {
      renderViewToggle({ size: 'md' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('h-10');
    });

    test('renders with large size', () => {
      renderViewToggle({ size: 'lg' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('h-12');
    });

    test('applies size classes to buttons', () => {
      renderViewToggle({ size: 'lg' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      expect(gridButton).toHaveClass('h-10');
    });
  });

  describe('Visual Variants', () => {
    test('renders with default variant', () => {
      renderViewToggle({ variant: 'default' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('bg-muted/50');
    });

    test('renders with outline variant', () => {
      renderViewToggle({ variant: 'outline' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('bg-transparent');
    });

    test('renders with ghost variant', () => {
      renderViewToggle({ variant: 'ghost' });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('border-transparent', 'bg-transparent');
    });

    test('applies active state classes for default variant', () => {
      renderViewToggle({ variant: 'default', value: 'grid' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      expect(gridButton).toHaveClass(
        'bg-background',
        'text-foreground',
        'shadow-sm'
      );
    });
  });

  describe('Disabled State', () => {
    test('disables both buttons when disabled prop is true', () => {
      renderViewToggle({ disabled: true });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toBeDisabled();
      expect(listButton).toBeDisabled();
    });

    test('does not call onClick when disabled', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ disabled: true, onValueChange });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      fireEvent.click(gridButton);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    test('sets tabIndex to -1 when disabled', () => {
      renderViewToggle({ disabled: true });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('tabIndex', '-1');
      expect(listButton).toHaveAttribute('tabIndex', '-1');
    });

    test('sets tabIndex to 0 when enabled', () => {
      renderViewToggle({ disabled: false });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('tabIndex', '0');
      expect(listButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Keyboard Navigation', () => {
    test('handles Enter key on grid button', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'list', onValueChange });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      gridButton.focus();
      await user.keyboard('{Enter}');

      expect(onValueChange).toHaveBeenCalledWith('grid');
    });

    test('handles Space key on list button', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      listButton.focus();
      await user.keyboard(' ');

      expect(onValueChange).toHaveBeenCalledWith('list');
    });

    test('does not handle keyboard when disabled', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      renderViewToggle({ disabled: true, onValueChange });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      gridButton.focus();
      await user.keyboard('{Enter}');

      expect(onValueChange).not.toHaveBeenCalled();
    });

    test('prevents default behavior for Enter key', async () => {
      const user = userEvent.setup();
      renderViewToggle({ value: 'grid' });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      listButton.focus();

      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = jest.spyOn(keydownEvent, 'preventDefault');
      listButton.dispatchEvent(keydownEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('prevents default behavior for Space key', async () => {
      const user = userEvent.setup();
      renderViewToggle({ value: 'grid' });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      listButton.focus();

      const keydownEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = jest.spyOn(keydownEvent, 'preventDefault');
      listButton.dispatchEvent(keydownEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Store Integration', () => {
    test('reads initial value from store', () => {
      useViewPreferenceStore.setState({ viewMode: 'list' });
      renderViewToggle();

      const listButton = screen.getByRole('radio', { name: 'List view' });
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });

    test('updates store on button click', () => {
      renderViewToggle();

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      expect(useViewPreferenceStore.getState().viewMode).toBe('list');
    });

    test('does not update store in controlled mode', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      // Store should not change
      expect(useViewPreferenceStore.getState().viewMode).toBe('grid');
      // But callback should be called
      expect(onValueChange).toHaveBeenCalledWith('list');
    });

    test('uses defaultValue for initial render', () => {
      renderViewToggle({ defaultValue: 'list' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      // defaultValue is used for initial state
      expect(gridButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderViewToggle();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper ARIA attributes for radiogroup', () => {
      renderViewToggle();

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('aria-label', 'Switch view mode');
    });

    test('has proper ARIA attributes for radio buttons', () => {
      renderViewToggle({ value: 'grid' });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      expect(gridButton).toHaveAttribute('aria-checked', 'true');
      expect(gridButton).toHaveAttribute('aria-label', 'Grid view');

      expect(listButton).toHaveAttribute('aria-checked', 'false');
      expect(listButton).toHaveAttribute('aria-label', 'List view');
    });

    test('has screen reader only text for icons', () => {
      renderViewToggle();

      const gridSrText = screen.getByText('Grid', { selector: '.sr-only' });
      const listSrText = screen.getByText('List', { selector: '.sr-only' });

      expect(gridSrText).toBeInTheDocument();
      expect(listSrText).toBeInTheDocument();
    });

    test('icons are hidden from screen readers', () => {
      renderViewToggle();

      const gridIcon = screen.getByTestId('grid-icon');
      const listIcon = screen.getByTestId('list-icon');

      expect(gridIcon).toHaveAttribute('aria-hidden', 'true');
      expect(listIcon).toHaveAttribute('aria-hidden', 'true');
    });

    test('has focusable buttons', () => {
      renderViewToggle();

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      const listButton = screen.getByRole('radio', { name: 'List view' });

      gridButton.focus();
      expect(gridButton).toHaveFocus();

      listButton.focus();
      expect(listButton).toHaveFocus();
    });
  });

  describe('Integration Scenarios', () => {
    test('handles complete workflow: controlled -> uncontrolled', () => {
      const { rerender } = render(<ViewToggle value="grid" />);

      let gridButton = screen.getByRole('radio', { name: 'Grid view' });
      expect(gridButton).toHaveAttribute('aria-checked', 'true');

      // Switch to uncontrolled
      rerender(<ViewToggle />);

      // Should use store value (grid is default)
      gridButton = screen.getByRole('radio', { name: 'Grid view' });
      expect(gridButton).toHaveAttribute('aria-checked', 'true');
    });

    test('handles size and variant combinations', () => {
      const { rerender } = render(<ViewToggle size="sm" variant="default" />);

      let radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('h-8', 'bg-muted/50');

      rerender(<ViewToggle size="lg" variant="ghost" />);

      radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveClass('h-12', 'border-transparent');
    });

    test('handles disabled state with controlled value', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange, disabled: true });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      expect(onValueChange).not.toHaveBeenCalled();
      expect(listButton).toBeDisabled();
    });

    test('maintains callback reference across re-renders', () => {
      const onValueChange = jest.fn();
      const { rerender } = render(
        <ViewToggle value="grid" onValueChange={onValueChange} />
      );

      const listButton = screen.getByRole('radio', { name: 'List view' });
      fireEvent.click(listButton);

      expect(onValueChange).toHaveBeenCalledTimes(1);

      rerender(<ViewToggle value="list" onValueChange={onValueChange} />);

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });
      fireEvent.click(gridButton);

      expect(onValueChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid clicks', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange });

      const listButton = screen.getByRole('radio', { name: 'List view' });
      const gridButton = screen.getByRole('radio', { name: 'Grid view' });

      fireEvent.click(listButton);
      fireEvent.click(gridButton);
      fireEvent.click(listButton);
      fireEvent.click(gridButton);

      expect(onValueChange).toHaveBeenCalledTimes(4);
    });

    test('handles clicking the same button multiple times', () => {
      const onValueChange = jest.fn();
      renderViewToggle({ value: 'grid', onValueChange });

      const gridButton = screen.getByRole('radio', { name: 'Grid view' });

      fireEvent.click(gridButton);
      fireEvent.click(gridButton);
      fireEvent.click(gridButton);

      expect(onValueChange).toHaveBeenCalledTimes(3);
      expect(onValueChange).toHaveBeenCalledWith('grid');
    });

    test('handles null/undefined className', () => {
      renderViewToggle({ className: undefined });

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeInTheDocument();
    });

    test('handles all props together', () => {
      const onValueChange = jest.fn();
      renderViewToggle({
        value: 'list',
        onValueChange,
        size: 'lg',
        variant: 'outline',
        disabled: false,
        className: 'custom-class',
        'aria-label': 'Custom label',
      });

      const radiogroup = screen.getByRole('radiogroup', {
        name: 'Custom label',
      });
      expect(radiogroup).toHaveClass('custom-class', 'h-12', 'bg-transparent');

      const listButton = screen.getByRole('radio', { name: 'List view' });
      expect(listButton).toHaveAttribute('aria-checked', 'true');
    });
  });
});
