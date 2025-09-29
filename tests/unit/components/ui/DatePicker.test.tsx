import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateRangePicker,
  MealPlanDatePicker,
  RecipeSchedulePicker,
  ExpirationDatePicker,
} from '@/components/ui/datepicker';

// Mock for testing
const mockDate = new Date('2024-01-15T12:00:00.000Z');

// Mock ResizeObserver for JSDOM compatibility
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe('DatePicker Components', () => {
  // Set up fake timers for consistent testing
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('DatePicker', () => {
    describe('Basic Rendering', () => {
      it('renders with default props', () => {
        render(<DatePicker />);

        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveAttribute('type', 'button');
      });

      it('renders with placeholder text', () => {
        render(<DatePicker placeholder="Select a date" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveTextContent('Select a date');
      });

      it('displays selected date', () => {
        const selectedDate = new Date('2024-01-20');
        render(<DatePicker value={selectedDate} />);

        const trigger = screen.getByRole('button');
        // Allow for timezone differences in date formatting
        const dateText = trigger.textContent;
        expect(dateText).toMatch(/\d{2}\/\d{2}\/2024/);
      });

      it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<DatePicker ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      });

      it('applies custom className', () => {
        render(<DatePicker className="custom-class" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('custom-class');
      });
    });

    describe('Variants and Sizes', () => {
      it('applies default variant classes', () => {
        render(<DatePicker variant="default" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('border', 'border-input', 'bg-background');
      });

      it('applies outlined variant classes', () => {
        render(<DatePicker variant="outlined" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('border-2');
      });

      it('applies filled variant classes', () => {
        render(<DatePicker variant="filled" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('bg-muted');
      });

      it('applies size variants', () => {
        const { rerender } = render(<DatePicker size="sm" />);
        let trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('h-8');

        rerender(<DatePicker size="default" />);
        trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('h-10');

        rerender(<DatePicker size="lg" />);
        trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('h-12');
      });
    });

    describe('States', () => {
      it('handles disabled state', () => {
        render(<DatePicker disabled />);

        const trigger = screen.getByRole('button');
        expect(trigger).toBeDisabled();
        expect(trigger).toHaveClass('disabled:opacity-50');
      });

      it('handles error state', () => {
        render(<DatePicker state="error" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('border-destructive');
      });

      it('handles success state', () => {
        render(<DatePicker state="success" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('border-green-500');
      });

      it('displays error text', () => {
        render(<DatePicker errorText="Invalid date" />);

        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toHaveClass(
          'text-destructive'
        );
      });

      it('displays helper text', () => {
        render(<DatePicker helperText="Choose your date" />);

        expect(screen.getByText('Choose your date')).toBeInTheDocument();
        expect(screen.getByText('Choose your date')).toHaveClass(
          'text-muted-foreground'
        );
      });
    });

    describe('Calendar Interactions', () => {
      it('opens calendar when clicked', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<DatePicker />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Calendar should be open - check for navigation buttons
        expect(
          screen.getByRole('button', { name: 'Go to previous month' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Go to next month' })
        ).toBeInTheDocument();
      });

      it('closes calendar when clicking outside', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(
          <div>
            <DatePicker />
            <div data-testid="outside">Outside</div>
          </div>
        );

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Calendar should be open
        expect(
          screen.getByRole('button', { name: 'Go to previous month' })
        ).toBeInTheDocument();

        // Click outside
        await user.click(screen.getByTestId('outside'));

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Calendar should be closed
        expect(
          screen.queryByRole('button', { name: 'Go to previous month' })
        ).not.toBeInTheDocument();
      });

      it('navigates months', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<DatePicker />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Should show January 2024
        expect(screen.getByText('January 2024')).toBeInTheDocument();

        // Click next month
        const nextButton = screen.getByRole('button', {
          name: 'Go to next month',
        });
        await user.click(nextButton);

        // Should show February 2024
        expect(screen.getByText('February 2024')).toBeInTheDocument();

        // Click previous month twice to go back to January
        const prevButton = screen.getByRole('button', {
          name: 'Go to previous month',
        });
        await user.click(prevButton);

        expect(screen.getByText('January 2024')).toBeInTheDocument();
      });
    });

    describe('Date Selection', () => {
      it('selects a date when clicked', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        render(<DatePicker onValueChange={onValueChange} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Click on day 20
        const day20 = screen.getByRole('button', { name: '20' });
        await user.click(day20);

        expect(onValueChange).toHaveBeenCalledWith(expect.any(Date));
        const calledDate = onValueChange.mock.calls[0][0];
        expect(calledDate.getDate()).toBe(20);
        expect(calledDate.getMonth()).toBe(0); // January
        expect(calledDate.getFullYear()).toBe(2024);
      });

      it('respects minDate constraint', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const minDate = new Date('2024-01-20');

        render(<DatePicker onValueChange={onValueChange} minDate={minDate} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Try to click on day 10 (before minDate)
        const day10Buttons = screen.getAllByRole('button', { name: '10' });
        // Find the day 10 button that's in the current month (January)
        const januaryDay10 = day10Buttons.find(btn => {
          const isDisabled = (btn as HTMLButtonElement).disabled;
          const isOutsideMonth = btn.classList.contains('opacity-50');
          return isDisabled && !isOutsideMonth;
        });
        expect(januaryDay10).toBeDefined();
        expect(januaryDay10).toBeDisabled();

        // Click on day 25 (after minDate)
        const day25 = screen.getByRole('button', { name: '25' });
        expect(day25).not.toBeDisabled();
        await user.click(day25);

        expect(onValueChange).toHaveBeenCalledWith(expect.any(Date));
      });

      it('respects maxDate constraint', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const maxDate = new Date('2024-01-20');

        render(<DatePicker onValueChange={onValueChange} maxDate={maxDate} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Try to click on day 25 (after maxDate)
        const day25 = screen.getByRole('button', { name: '25' });
        expect(day25).toBeDisabled();

        // Click on day 15 (before maxDate)
        const day15 = screen.getByRole('button', { name: '15' });
        expect(day15).not.toBeDisabled();
        await user.click(day15);

        expect(onValueChange).toHaveBeenCalledWith(expect.any(Date));
      });
    });

    describe('Presets', () => {
      it('renders preset options when showPresets is true', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const presets = [
          { label: 'Today', value: new Date() },
          {
            label: 'Tomorrow',
            value: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        ];

        render(<DatePicker showPresets presetOptions={presets} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(
          screen.getByRole('button', { name: 'Today' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Tomorrow' })
        ).toBeInTheDocument();
      });

      it('selects date when preset is clicked', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const presetDate = new Date('2024-01-25');
        const presets = [{ label: 'Preset Date', value: presetDate }];

        render(
          <DatePicker
            onValueChange={onValueChange}
            showPresets
            presetOptions={presets}
          />
        );

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        const presetButton = screen.getByRole('button', {
          name: 'Preset Date',
        });
        await user.click(presetButton);

        expect(onValueChange).toHaveBeenCalledWith(presetDate);
      });
    });

    describe('Accessibility', () => {
      it('has proper ARIA attributes', () => {
        render(<DatePicker aria-label="Select birth date" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveAttribute('aria-label', 'Select birth date');
      });

      it('supports keyboard navigation', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<DatePicker />);

        const trigger = screen.getByRole('button');

        // Focus and open with Enter
        trigger.focus();
        await user.keyboard('{Enter}');

        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(
          screen.getByRole('button', { name: 'Go to previous month' })
        ).toBeInTheDocument();

        // Close with Escape
        await user.keyboard('{Escape}');

        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(
          screen.queryByRole('button', { name: 'Go to previous month' })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('TimePicker', () => {
    describe('Basic Rendering', () => {
      it('renders with default props', () => {
        render(<TimePicker />);

        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveAttribute('type', 'button');
      });

      it('displays selected time', () => {
        const selectedTime = new Date('2024-01-15T14:30:00');
        render(<TimePicker value={selectedTime} />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveTextContent('2:30 PM');
      });

      it('handles 24h format', () => {
        const selectedTime = new Date('2024-01-15T14:30:00');
        render(<TimePicker value={selectedTime} timeFormat="24h" />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveTextContent('14:30');
      });
    });

    describe('Time Selection', () => {
      it('opens time dropdown when clicked', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<TimePicker />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Should show time options
        expect(screen.getByText('12:00 AM')).toBeInTheDocument();
        expect(screen.getByText('12:15 AM')).toBeInTheDocument();
      });

      it('respects minuteStep prop', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<TimePicker minuteStep={30} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(screen.getByText('12:00 AM')).toBeInTheDocument();
        expect(screen.getByText('12:30 AM')).toBeInTheDocument();
        expect(screen.queryByText('12:15 AM')).not.toBeInTheDocument();
      });

      it('selects time when option is clicked', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        render(<TimePicker onValueChange={onValueChange} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        const timeOption = screen.getByText('2:30 PM');
        await user.click(timeOption);

        expect(onValueChange).toHaveBeenCalledWith(expect.any(Date));
        const calledDate = onValueChange.mock.calls[0][0];
        expect(calledDate.getHours()).toBe(14);
        expect(calledDate.getMinutes()).toBe(30);
      });
    });
  });

  describe('DateTimePicker', () => {
    describe('Basic Rendering', () => {
      it('renders with default props', () => {
        render(<DateTimePicker />);

        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
      });

      it('displays selected date and time', () => {
        const selectedDateTime = new Date('2024-01-20T14:30:00');
        render(<DateTimePicker value={selectedDateTime} />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveTextContent('01/20/2024 2:30 PM');
      });
    });

    describe('Combined Functionality', () => {
      it('opens calendar with time controls', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<DateTimePicker />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Should have both calendar and time controls
        expect(
          screen.getByRole('button', { name: 'Go to previous month' })
        ).toBeInTheDocument();
        // Time controls should be present (look for hour/minute inputs)
        expect(screen.getByText('Time:')).toBeInTheDocument();
        // Check for hour and minute selects
        const selects = screen.getAllByRole('combobox');
        expect(selects.length).toBeGreaterThanOrEqual(2); // At least hour and minute selects
      });
    });
  });

  describe('DateRangePicker', () => {
    describe('Basic Rendering', () => {
      it('renders with default props', () => {
        render(<DateRangePicker />);

        const trigger = screen.getByRole('button');
        expect(trigger).toBeInTheDocument();
      });

      it('displays selected date range', () => {
        const startDate = new Date('2024-01-15');
        const endDate = new Date('2024-01-20');
        render(<DateRangePicker value={[startDate, endDate]} />);

        const trigger = screen.getByRole('button');
        // Allow for timezone differences in date formatting
        const expectedText = trigger.textContent;
        expect(expectedText).toMatch(/\d{2}\/\d{2}\/2024 - \d{2}\/\d{2}\/2024/);
      });
    });

    describe('Range Selection', () => {
      it('selects date range when two dates are clicked', async () => {
        const onValueChange = jest.fn();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        render(<DateRangePicker onValueChange={onValueChange} />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        // Click first date
        const day15 = screen.getByRole('button', { name: '15' });
        await user.click(day15);

        // Click second date
        const day20 = screen.getByRole('button', { name: '20' });
        await user.click(day20);

        expect(onValueChange).toHaveBeenLastCalledWith(expect.any(Array));
        const calledRange =
          onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
        expect(calledRange).toHaveLength(2);
        expect(calledRange[0].getDate()).toBe(15);
        expect(calledRange[1].getDate()).toBe(20);
      });
    });
  });

  describe('Recipe-Specific Variants', () => {
    describe('MealPlanDatePicker', () => {
      it('renders with meal type styling', () => {
        render(<MealPlanDatePicker mealType="breakfast" />);

        // The className is passed to the DatePicker which applies it to the trigger button
        const trigger = screen.getByRole('button');
        expect(trigger).toHaveClass('meal-plan-picker', 'border-warning/20');
      });

      it('has meal planning presets', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<MealPlanDatePicker />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(
          screen.getByRole('button', { name: 'Today' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Tomorrow' })
        ).toBeInTheDocument();
      });
    });

    describe('RecipeSchedulePicker', () => {
      it('shows duration warning', () => {
        render(
          <RecipeSchedulePicker
            cookingDuration={45}
            preparationTime={20}
            showDurationWarning
          />
        );

        expect(screen.getByText(/Allow 65 minutes total/)).toBeInTheDocument();
        expect(screen.getByText(/prep: 20min/)).toBeInTheDocument();
        expect(screen.getByText(/cooking: 45min/)).toBeInTheDocument();
      });
    });

    describe('ExpirationDatePicker', () => {
      it('shows expiration status for selected date', () => {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        render(<ExpirationDatePicker value={futureDate} foodType="produce" />);

        expect(screen.getByText('✓ Fresh')).toBeInTheDocument();
        expect(screen.getByText('Produce item')).toBeInTheDocument();
      });

      it('shows warning for soon-to-expire date', () => {
        const soonDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
        render(<ExpirationDatePicker value={soonDate} warningDays={3} />);

        expect(screen.getByText('⚠️ Expires soon')).toBeInTheDocument();
      });

      it('shows expired status for past date', () => {
        const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
        render(<ExpirationDatePicker value={pastDate} />);

        expect(screen.getByText('⚠️ Expired')).toBeInTheDocument();
      });

      it('has food type specific presets', async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<ExpirationDatePicker foodType="pantry" />);

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        expect(
          screen.getByRole('button', { name: 'In 1 month' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'In 6 months' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Component Display Names', () => {
    it('has correct display names', () => {
      expect(DatePicker.displayName).toBe('DatePicker');
      expect(TimePicker.displayName).toBe('TimePicker');
      expect(DateTimePicker.displayName).toBe('DateTimePicker');
      expect(DateRangePicker.displayName).toBe('DateRangePicker');
      expect(MealPlanDatePicker.displayName).toBe('MealPlanDatePicker');
      expect(RecipeSchedulePicker.displayName).toBe('RecipeSchedulePicker');
      expect(ExpirationDatePicker.displayName).toBe('ExpirationDatePicker');
    });
  });
});
