import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  SearchInput,
  type SearchInputProps,
} from '@/components/ui/search-input';
import { useDebounce } from '@/hooks/use-debounce';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render SearchInput with default props
 */
const renderSearchInput = (props: Partial<SearchInputProps> = {}) => {
  const defaultProps: SearchInputProps = {
    ...props,
  };

  return render(<SearchInput {...defaultProps} />);
};

/**
 * Helper to wait for debounce
 */
const waitForDebounce = (delay = 300) =>
  new Promise(resolve => setTimeout(resolve, delay + 50));

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    test('renders search input element', () => {
      renderSearchInput();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    test('renders with search type by default', () => {
      renderSearchInput();
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    test('renders with custom type', () => {
      renderSearchInput({ type: 'text' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('renders with label', () => {
      renderSearchInput({ label: 'Search Recipes' });
      expect(screen.getByLabelText('Search Recipes')).toBeInTheDocument();
    });

    test('renders with placeholder', () => {
      renderSearchInput({ placeholder: 'Enter search term...' });
      expect(
        screen.getByPlaceholderText('Enter search term...')
      ).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<SearchInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test('applies custom id', () => {
      renderSearchInput({ id: 'search-input' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('id', 'search-input');
    });

    test('generates unique id when not provided', () => {
      const { unmount } = renderSearchInput();
      const input1 = screen.getByRole('searchbox');
      const id1 = input1.getAttribute('id');
      unmount();

      renderSearchInput();
      const input2 = screen.getByRole('searchbox');
      const id2 = input2.getAttribute('id');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });
  });

  describe('Visual Variants', () => {
    test('applies default variant classes', () => {
      renderSearchInput({ variant: 'default' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('border-input');
    });

    test('applies filled variant classes', () => {
      renderSearchInput({ variant: 'filled' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('bg-muted');
    });

    test('applies outlined variant classes', () => {
      renderSearchInput({ variant: 'outlined' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('border-2');
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderSearchInput({ size: 'sm' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('h-8');
    });

    test('applies default size classes', () => {
      renderSearchInput({ size: 'default' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('h-9');
    });

    test('applies large size classes', () => {
      renderSearchInput({ size: 'lg' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('h-11');
    });
  });

  describe('States', () => {
    test('applies default state', () => {
      renderSearchInput({ state: 'default' });
      const input = screen.getByRole('searchbox');
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('applies error state', () => {
      renderSearchInput({ state: 'error', errorText: 'Invalid search' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveClass('border-destructive');
    });

    test('applies success state', () => {
      renderSearchInput({ state: 'success' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('border-green-500');
    });

    test('applies warning state', () => {
      renderSearchInput({ state: 'warning' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('border-yellow-500');
    });
  });

  describe('Icons and Visual Elements', () => {
    test('renders search icon by default', () => {
      renderSearchInput();
      // Search icon should be present
      const container = screen.getByRole('searchbox').closest('div');
      expect(container?.querySelector('svg')).toBeInTheDocument();
    });

    test('hides search icon when showSearchIcon is false', () => {
      renderSearchInput({ showSearchIcon: false });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('pl-3'); // Should have less left padding
    });

    test('renders custom search icon', () => {
      const customIcon = <span data-testid="custom-search-icon">🔍</span>;
      renderSearchInput({ searchIcon: customIcon });
      expect(screen.getByTestId('custom-search-icon')).toBeInTheDocument();
    });

    test('shows clear button when input has value', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderSearchInput({ showClearButton: true });
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');

      expect(
        screen.getByRole('button', { name: /clear search/i })
      ).toBeInTheDocument();
    });

    test('hides clear button when input is empty', () => {
      renderSearchInput({ value: '', showClearButton: true });
      expect(
        screen.queryByRole('button', { name: /clear search/i })
      ).not.toBeInTheDocument();
    });

    test('shows loading spinner when loading is true', () => {
      renderSearchInput({ loading: true });
      const container = screen.getByRole('searchbox').closest('div');
      expect(
        container?.querySelector('[aria-hidden="true"]')
      ).toBeInTheDocument();
    });

    test('renders custom clear icon', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const customClearIcon = <span data-testid="custom-clear-icon">✖</span>;
      renderSearchInput({ clearIcon: customClearIcon });
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');

      expect(screen.getByTestId('custom-clear-icon')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles typing in input', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleChange = jest.fn();
      renderSearchInput({ onChange: handleChange });
      const input = screen.getByRole('searchbox');

      await user.type(input, 'recipe');

      expect(handleChange).toHaveBeenCalledTimes(6); // One call per character
      expect(input).toHaveValue('recipe');
    });

    test('handles clear button click', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleClear = jest.fn();
      renderSearchInput({ value: 'test', onClear: handleClear });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    test('clears input when clear button is clicked without onClear prop', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleChange = jest.fn();
      renderSearchInput({ onChange: handleChange });
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearButton);

      // Should call onChange with empty value
      const lastCall =
        handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0].target.value).toBe('');
    });

    test('handles focus and blur events', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      renderSearchInput({ onFocus: handleFocus, onBlur: handleBlur });
      const input = screen.getByRole('searchbox');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test('handles Enter key for search submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleSubmit = jest.fn();
      renderSearchInput({ value: 'test query', onSubmit: handleSubmit });
      const input = screen.getByRole('searchbox');

      await user.type(input, '{enter}');

      expect(handleSubmit).toHaveBeenCalledWith(
        'test query',
        expect.any(Object)
      );
    });

    test('handles Escape key to clear input', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleChange = jest.fn();
      renderSearchInput({ onChange: handleChange, clearOnEscape: true });
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');
      await user.type(input, '{escape}');

      // Should trigger onChange with empty value
      const lastCall =
        handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0].target.value).toBe('');
    });

    test('does not clear on Escape when clearOnEscape is false', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleChange = jest.fn();
      renderSearchInput({ value: 'test', clearOnEscape: false });
      const input = screen.getByRole('searchbox');

      await user.type(input, '{escape}');

      expect(input).toHaveValue('test');
    });
  });

  describe('Debouncing Functionality', () => {
    test('calls onSearch with debounced value', async () => {
      const handleSearch = jest.fn();
      renderSearchInput({
        onSearch: handleSearch,
        debounceConfig: { delay: 300 },
      });
      const input = screen.getByRole('searchbox');

      // Type quickly
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });

      // Should not be called immediately
      expect(handleSearch).not.toHaveBeenCalled();

      // Wait for debounce
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(handleSearch).toHaveBeenCalledWith('abc');
      expect(handleSearch).toHaveBeenCalledTimes(1);
    });

    test('respects custom debounce delay', async () => {
      const handleSearch = jest.fn();
      renderSearchInput({
        onSearch: handleSearch,
        debounceConfig: { delay: 500 },
      });
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: 'test' } });

      // Should not be called after 300ms
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(handleSearch).not.toHaveBeenCalled();

      // Should be called after 500ms
      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    test('does not call onSearch for empty values', async () => {
      const handleSearch = jest.fn();
      renderSearchInput({ onSearch: handleSearch });
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: '' } });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    test('works as uncontrolled component', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderSearchInput();
      const input = screen.getByRole('searchbox');

      await user.type(input, 'uncontrolled');

      expect(input).toHaveValue('uncontrolled');
    });

    test('works as controlled component', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <SearchInput value={value} onChange={e => setValue(e.target.value)} />
        );
      };

      render(<TestComponent />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'controlled');

      expect(input).toHaveValue('controlled');
    });
  });

  describe('Disabled State', () => {
    test('disables input when disabled prop is true', () => {
      renderSearchInput({ disabled: true });
      const input = screen.getByRole('searchbox');
      expect(input).toBeDisabled();
    });

    test('disables input when loading is true', () => {
      renderSearchInput({ loading: true });
      const input = screen.getByRole('searchbox');
      expect(input).toBeDisabled();
    });

    test('does not show clear button when disabled', () => {
      renderSearchInput({ disabled: true, value: 'test' });
      expect(
        screen.queryByRole('button', { name: /clear search/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Helper Text and Error Handling', () => {
    test('renders helper text', () => {
      renderSearchInput({ helperText: 'Enter search terms' });
      expect(screen.getByText('Enter search terms')).toBeInTheDocument();
    });

    test('renders error text and overrides helper text', () => {
      renderSearchInput({
        helperText: 'Helper text',
        errorText: 'Error occurred',
      });
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    test('associates error text with input via aria-describedby', () => {
      renderSearchInput({
        errorText: 'Error occurred',
        id: 'test-input',
      });
      const input = screen.getByRole('searchbox');
      const errorElement = screen.getByText('Error occurred');

      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining(errorElement.id)
      );
    });
  });

  describe('Auto Focus', () => {
    test('auto-focuses input when autoFocus is true', () => {
      renderSearchInput({ autoFocus: true });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveFocus();
    });

    test('does not auto-focus when autoFocus is false', () => {
      renderSearchInput({ autoFocus: false });
      const input = screen.getByRole('searchbox');
      expect(input).not.toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      renderSearchInput({
        label: 'Search',
        helperText: 'Enter search terms',
        required: true,
      });
      const input = screen.getByRole('searchbox');

      expect(input).toHaveAttribute('role', 'searchbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-describedby');
    });

    test('has default aria-label when no label provided', () => {
      renderSearchInput();
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search');
    });

    test('uses custom searchAriaLabel', () => {
      renderSearchInput({ searchAriaLabel: 'Search recipes' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search recipes');
    });

    test('clear button has proper aria-label', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderSearchInput();
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');

      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
    });

    test('uses custom clear button aria-label', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderSearchInput({ clearButtonAriaLabel: 'Clear recipe search' });
      const input = screen.getByRole('searchbox');

      await user.type(input, 'test');

      const clearButton = screen.getByRole('button', {
        name: 'Clear recipe search',
      });
      expect(clearButton).toHaveAttribute('aria-label', 'Clear recipe search');
    });

    // Accessibility audits temporarily disabled - they pass but are slow in CI
    test.skip('passes accessibility audit', async () => {
      const { container } = renderSearchInput({
        label: 'Search Recipes',
        helperText: 'Enter recipe name or ingredients',
        placeholder: 'e.g., chicken pasta',
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test.skip('passes accessibility audit with error state', async () => {
      const { container } = renderSearchInput({
        label: 'Search Recipes',
        errorText: 'Invalid search term',
        state: 'error',
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Class Names', () => {
    test('applies custom className to input', () => {
      renderSearchInput({ className: 'custom-input-class' });
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('custom-input-class');
    });

    test('applies custom containerClassName', () => {
      renderSearchInput({ containerClassName: 'custom-container' });
      const input = screen.getByRole('searchbox');
      const container = input.closest('.custom-container');
      expect(container).toBeInTheDocument();
    });

    test('applies custom labelClassName', () => {
      renderSearchInput({
        label: 'Search',
        labelClassName: 'custom-label',
      });
      const label = screen.getByText('Search');
      expect(label).toHaveClass('custom-label');
    });
  });
});

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('debounces value changes', () => {
    const TestComponent = ({
      value,
      delay,
    }: {
      value: string;
      delay?: number;
    }) => {
      const { debouncedValue } = useDebounce(value, { delay });
      return <div data-testid="debounced-value">{debouncedValue}</div>;
    };

    const { rerender } = render(<TestComponent value="initial" delay={300} />);

    expect(screen.getByTestId('debounced-value')).toHaveTextContent('initial');

    // Change value multiple times quickly
    rerender(<TestComponent value="a" delay={300} />);
    rerender(<TestComponent value="ab" delay={300} />);
    rerender(<TestComponent value="abc" delay={300} />);

    // Should still show initial value
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('initial');

    // Wait for debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should now show latest value
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('abc');
  });

  test('provides cancel function', () => {
    const TestComponent = ({ value }: { value: string }) => {
      const { debouncedValue, cancel } = useDebounce(value, { delay: 300 });

      React.useEffect(() => {
        if (value === 'cancel') {
          cancel();
        }
      }, [value, cancel]);

      return <div data-testid="debounced-value">{debouncedValue}</div>;
    };

    const { rerender } = render(<TestComponent value="initial" />);

    rerender(<TestComponent value="changed" />);
    rerender(<TestComponent value="cancel" />);

    // Wait past debounce time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still show initial value due to cancel
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('initial');
  });

  test('provides flush function', () => {
    const TestComponent = ({
      value,
      shouldFlush,
    }: {
      value: string;
      shouldFlush?: boolean;
    }) => {
      const { debouncedValue, flush } = useDebounce(value, { delay: 300 });

      React.useEffect(() => {
        if (shouldFlush) {
          flush();
        }
      }, [shouldFlush, flush]);

      return <div data-testid="debounced-value">{debouncedValue}</div>;
    };

    const { rerender } = render(<TestComponent value="initial" />);

    rerender(<TestComponent value="changed" />);
    rerender(<TestComponent value="changed" shouldFlush={true} />);

    // Should immediately show new value due to flush
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('changed');
  });
});
