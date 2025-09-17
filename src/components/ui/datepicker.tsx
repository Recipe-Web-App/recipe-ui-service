'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  datepickerVariants,
  datepickerInputVariants,
  datepickerTriggerVariants,
  calendarPopoverVariants,
  calendarHeaderVariants,
  calendarNavButtonVariants,
  calendarGridVariants,
  calendarCellVariants,
  calendarWeekHeaderVariants,
  timePickerVariants,
  timeInputVariants,
  datePresetVariants,
  datepickerLabelVariants,
  datepickerHelperVariants,
  datepickerIconVariants,
} from '@/lib/ui/datepicker-variants';
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Date utilities
 */
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

const formatDate = (date: Date, format: string = 'MM/dd/yyyy'): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'MM/dd/yyyy':
      return `${month}/${day}/${year}`;
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`;
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`;
    case 'MMM dd, yyyy':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    default:
      return date.toLocaleDateString();
  }
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const getCalendarDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startDay = start.getDay();
  const daysInMonth = end.getDate();

  const days: Date[] = [];

  // Add previous month's days to fill the week
  for (let i = startDay - 1; i >= 0; i--) {
    const prevDate = new Date(start);
    prevDate.setDate(prevDate.getDate() - i - 1);
    days.push(prevDate);
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  // Add next month's days to fill the week
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(end);
    nextDate.setDate(nextDate.getDate() + i);
    days.push(nextDate);
  }

  return days;
};

/**
 * Base DatePicker component props interface
 */
export interface DatePickerProps
  extends VariantProps<typeof datepickerVariants> {
  // Core date functionality
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;

  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];

  // Display options
  placeholder?: string;
  dateFormat?: string;
  label?: string;
  helperText?: string;
  errorText?: string;

  // Styling
  className?: string;
  calendarClassName?: string;

  // Behavior
  closeOnSelect?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;

  // Preset options
  showPresets?: boolean;
  presetOptions?: Array<{
    label: string;
    value: Date;
  }>;

  // Calendar options
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/**
 * Core DatePicker component
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minDate,
      maxDate,
      disabledDates = [],
      disabledDaysOfWeek = [],
      placeholder = 'Select date',
      dateFormat = 'MM/dd/yyyy',
      label,
      helperText,
      errorText,
      variant = 'default',
      size = 'default',
      state = 'default',
      fullWidth = false,
      className,
      calendarClassName,
      closeOnSelect = true,
      disabled = false,
      required = false,
      readOnly = false,
      clearable = false,
      autoFocus = false,
      showPresets = false,
      presetOptions = [],
      weekStartsOn: _weekStartsOn,
      showWeekNumbers: _showWeekNumbers,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      defaultValue
    );
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      value ?? selectedDate ?? new Date()
    );
    const [isOpen, setIsOpen] = React.useState(false);

    const currentValue = value ?? selectedDate;
    const currentState = errorText ? 'error' : (state ?? 'default');

    const handleDateSelect = React.useCallback(
      (date: Date) => {
        const isDateDisabled =
          (minDate != null && date < minDate) ||
          (maxDate != null && date > maxDate) ||
          disabledDates.some(disabledDate => isSameDay(date, disabledDate)) ||
          disabledDaysOfWeek.includes(date.getDay());

        if (isDateDisabled) return;

        setSelectedDate(date);
        onValueChange?.(date);

        if (closeOnSelect) {
          setIsOpen(false);
        }
      },
      [
        minDate,
        maxDate,
        disabledDates,
        disabledDaysOfWeek,
        onValueChange,
        closeOnSelect,
      ]
    );

    const handleClear = React.useCallback(() => {
      setSelectedDate(undefined);
      onValueChange?.(undefined);
    }, [onValueChange]);

    const handlePresetSelect = React.useCallback(
      (presetValue: Date) => {
        handleDateSelect(presetValue);
      },
      [handleDateSelect]
    );

    const navigateMonth = React.useCallback((direction: 'prev' | 'next') => {
      setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    }, []);

    const calendarDays = React.useMemo(
      () => getCalendarDays(currentMonth),
      [currentMonth]
    );

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const isDayDisabled = React.useCallback(
      (date: Date) => {
        return (
          (minDate != null && date < minDate) ||
          (maxDate != null && date > maxDate) ||
          disabledDates.some(disabledDate => isSameDay(date, disabledDate)) ||
          disabledDaysOfWeek.includes(date.getDay())
        );
      },
      [minDate, maxDate, disabledDates, disabledDaysOfWeek]
    );

    const isDayInCurrentMonth = React.useCallback(
      (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
      },
      [currentMonth]
    );

    const getDayVariant = React.useCallback(
      (date: Date) => {
        if (isDayDisabled(date)) return 'disabled';
        if (!isDayInCurrentMonth(date)) return 'outside';
        if (currentValue && isSameDay(date, currentValue)) return 'selected';
        if (isToday(date)) return 'today';
        if (isWeekend(date)) return 'weekend';
        return 'default';
      },
      [currentValue, isDayDisabled, isDayInCurrentMonth]
    );

    const displayValue = currentValue
      ? formatDate(currentValue, dateFormat)
      : '';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              datepickerLabelVariants({
                size,
                state: currentState,
              })
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* DatePicker Input */}
        <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <PopoverPrimitive.Trigger
            ref={ref}
            className={cn(
              datepickerTriggerVariants({
                variant,
                size,
                state: currentState,
              }),
              fullWidth && 'w-full justify-between',
              className
            )}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            autoFocus={autoFocus}
            {...props}
          >
            <span
              className={cn(
                datepickerInputVariants({ size }),
                !displayValue && 'text-muted-foreground'
              )}
            >
              {displayValue || placeholder}
            </span>
            <div className="flex items-center space-x-1">
              {clearable && currentValue && !disabled && !readOnly && (
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  className={cn(
                    datepickerIconVariants({
                      size,
                      state: currentState,
                    }),
                    'hover:text-foreground'
                  )}
                >
                  <X />
                </button>
              )}
              <Calendar
                className={cn(
                  datepickerIconVariants({
                    position: 'right',
                    size,
                    state: currentState,
                  })
                )}
              />
            </div>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className={cn(
                calendarPopoverVariants({ size }),
                'bg-white dark:bg-gray-900',
                calendarClassName
              )}
              align="start"
              sideOffset={4}
            >
              {/* Preset Options */}
              {showPresets && presetOptions.length > 0 && (
                <div className="border-border mb-4 flex flex-wrap gap-1 border-b pb-4">
                  {presetOptions.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset.value)}
                      className={cn(
                        datePresetVariants({
                          active:
                            currentValue &&
                            isSameDay(currentValue, preset.value),
                        })
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Calendar Header */}
              <div className={cn(calendarHeaderVariants({ size }))}>
                <button
                  onClick={() => navigateMonth('prev')}
                  className={cn(calendarNavButtonVariants({ size }))}
                  disabled={
                    minDate &&
                    startOfMonth(currentMonth) <= startOfMonth(minDate)
                  }
                  aria-label="Go to previous month"
                >
                  <ChevronLeft />
                </button>

                <h2 className="text-sm font-semibold">
                  {currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>

                <button
                  onClick={() => navigateMonth('next')}
                  className={cn(calendarNavButtonVariants({ size }))}
                  disabled={
                    maxDate && endOfMonth(currentMonth) >= endOfMonth(maxDate)
                  }
                  aria-label="Go to next month"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Calendar Grid */}
              <table className={cn(calendarGridVariants())}>
                {/* Week Headers */}
                <thead>
                  <tr>
                    {weekDays.map(day => (
                      <th
                        key={day}
                        className={cn(calendarWeekHeaderVariants({ size }))}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Calendar Days */}
                <tbody>
                  {Array.from({ length: 6 }, (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const dayIndexInMonth = weekIndex * 7 + dayIndex;
                        const date = calendarDays.at(dayIndexInMonth);

                        if (!date) return <td key={dayIndex} />;

                        return (
                          <td key={dayIndex}>
                            <button
                              onClick={() => handleDateSelect(date)}
                              disabled={isDayDisabled(date)}
                              className={cn(
                                calendarCellVariants({
                                  size,
                                  variant: getDayVariant(date),
                                })
                              )}
                            >
                              {date.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {/* Helper Text */}
        {(helperText ?? errorText) && (
          <div
            className={cn(
              datepickerHelperVariants({
                state: currentState,
              })
            )}
          >
            {errorText ?? helperText}
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

/**
 * Time utilities
 */
const formatTime = (date: Date, format: '12h' | '24h' = '12h'): string => {
  if (format === '24h') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * TimePicker component props interface
 */
export interface TimePickerProps
  extends VariantProps<typeof datepickerVariants> {
  // Core time functionality
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;

  // Time constraints
  minTime?: Date;
  maxTime?: Date;
  minuteStep?: number;

  // Display options
  placeholder?: string;
  timeFormat?: '12h' | '24h';
  label?: string;
  helperText?: string;
  errorText?: string;

  // Styling
  className?: string;

  // Behavior
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/**
 * TimePicker component
 */
const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minTime,
      maxTime,
      minuteStep = 15,
      placeholder = 'Select time',
      timeFormat = '12h',
      label,
      helperText,
      errorText,
      variant = 'default',
      size = 'default',
      state = 'default',
      fullWidth = false,
      className,
      disabled = false,
      required = false,
      readOnly = false,
      clearable = false,
      autoFocus = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = React.useState(false);

    const currentValue = value ?? selectedTime;
    const currentState = errorText ? 'error' : (state ?? 'default');

    const handleTimeSelect = React.useCallback(
      (hours: number, minutes: number) => {
        const newTime = new Date();
        newTime.setHours(hours, minutes, 0, 0);

        const isTimeDisabled =
          (minTime != null && newTime < minTime) ||
          (maxTime != null && newTime > maxTime);

        if (isTimeDisabled) return;

        setSelectedTime(newTime);
        onValueChange?.(newTime);
        setIsOpen(false);
      },
      [minTime, maxTime, onValueChange]
    );

    const handleClear = React.useCallback(() => {
      setSelectedTime(undefined);
      onValueChange?.(undefined);
    }, [onValueChange]);

    const generateTimeOptions = React.useMemo(() => {
      const options: Array<{ hours: number; minutes: number; label: string }> =
        [];

      for (let hours = 0; hours < 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += minuteStep) {
          const timeDate = new Date();
          timeDate.setHours(hours, minutes, 0, 0);

          const isDisabled =
            (minTime != null && timeDate < minTime) ||
            (maxTime != null && timeDate > maxTime);

          if (!isDisabled) {
            options.push({
              hours,
              minutes,
              label: formatTime(timeDate, timeFormat),
            });
          }
        }
      }

      return options;
    }, [minuteStep, minTime, maxTime, timeFormat]);

    const displayValue = currentValue
      ? formatTime(currentValue, timeFormat)
      : '';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              datepickerLabelVariants({
                size,
                state: currentState,
              })
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* TimePicker Input */}
        <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <PopoverPrimitive.Trigger
            ref={ref}
            className={cn(
              datepickerTriggerVariants({
                variant,
                size,
                state: currentState,
              }),
              fullWidth && 'w-full justify-between',
              className
            )}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            autoFocus={autoFocus}
            {...props}
          >
            <span
              className={cn(
                datepickerInputVariants({ size }),
                !displayValue && 'text-muted-foreground'
              )}
            >
              {displayValue || placeholder}
            </span>
            <div className="flex items-center space-x-1">
              {clearable && currentValue && !disabled && !readOnly && (
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  className={cn(
                    datepickerIconVariants({
                      size,
                      state: currentState,
                    }),
                    'hover:text-foreground'
                  )}
                >
                  <X />
                </button>
              )}
              <Clock
                className={cn(
                  datepickerIconVariants({
                    position: 'right',
                    size,
                    state: currentState,
                  })
                )}
              />
            </div>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className={cn(
                calendarPopoverVariants({ size }),
                'max-h-64 overflow-y-auto bg-white dark:bg-gray-900'
              )}
              align="start"
              sideOffset={4}
            >
              <div className="space-y-1">
                {generateTimeOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleTimeSelect(option.hours, option.minutes)
                    }
                    className={cn(
                      'hover:bg-accent hover:text-accent-foreground w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                      currentValue &&
                        currentValue.getHours() === option.hours &&
                        currentValue.getMinutes() === option.minutes &&
                        'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {/* Helper Text */}
        {(helperText ?? errorText) && (
          <div
            className={cn(
              datepickerHelperVariants({
                state: currentState,
              })
            )}
          >
            {errorText ?? helperText}
          </div>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

/**
 * DateTimePicker component props interface
 */
export interface DateTimePickerProps
  extends VariantProps<typeof datepickerVariants> {
  // Core date/time functionality
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;

  // Date constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];

  // Time constraints
  minTime?: Date;
  maxTime?: Date;
  minuteStep?: number;

  // Display options
  placeholder?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  label?: string;
  helperText?: string;
  errorText?: string;

  // Styling
  className?: string;
  calendarClassName?: string;

  // Behavior
  closeOnSelect?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;

  // Preset options
  showPresets?: boolean;
  presetOptions?: Array<{
    label: string;
    value: Date;
  }>;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/**
 * DateTimePicker component
 */
const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minDate,
      maxDate,
      disabledDates = [],
      disabledDaysOfWeek = [],
      minTime,
      maxTime,
      minuteStep = 15,
      placeholder = 'Select date and time',
      dateFormat = 'MM/dd/yyyy',
      timeFormat = '12h',
      label,
      helperText,
      errorText,
      variant = 'default',
      size = 'default',
      state = 'default',
      fullWidth = false,
      className,
      calendarClassName,
      closeOnSelect = false,
      disabled = false,
      required = false,
      readOnly = false,
      clearable = false,
      autoFocus = false,
      showPresets = false,
      presetOptions = [],
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [selectedDateTime, setSelectedDateTime] = React.useState<
      Date | undefined
    >(defaultValue);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      value ?? selectedDateTime ?? new Date()
    );
    const [selectedTime, setSelectedTime] = React.useState<{
      hours: number;
      minutes: number;
    }>(() => {
      const initial = value ?? selectedDateTime;
      return initial
        ? { hours: initial.getHours(), minutes: initial.getMinutes() }
        : { hours: 12, minutes: 0 };
    });
    const [isOpen, setIsOpen] = React.useState(false);

    const currentValue = value ?? selectedDateTime;
    const currentState = errorText ? 'error' : (state ?? 'default');

    const handleDateSelect = React.useCallback(
      (date: Date) => {
        const isDateDisabled =
          (minDate != null && date < minDate) ||
          (maxDate != null && date > maxDate) ||
          disabledDates.some(disabledDate => isSameDay(date, disabledDate)) ||
          disabledDaysOfWeek.includes(date.getDay());

        if (isDateDisabled) return;

        // Combine selected date with current time
        const newDateTime = new Date(date);
        newDateTime.setHours(selectedTime.hours, selectedTime.minutes, 0, 0);

        setSelectedDateTime(newDateTime);

        // Don't call onValueChange here - it will be called when popover closes
        if (closeOnSelect) {
          setIsOpen(false);
        }
      },
      [
        minDate,
        maxDate,
        disabledDates,
        disabledDaysOfWeek,
        selectedTime,
        closeOnSelect,
      ]
    );

    const handleTimeChange = React.useCallback(
      (hours: number, minutes: number) => {
        setSelectedTime({ hours, minutes });

        if (selectedDateTime) {
          const newDateTime = new Date(selectedDateTime);
          newDateTime.setHours(hours, minutes, 0, 0);

          const isTimeDisabled =
            (minTime != null && newDateTime < minTime) ||
            (maxTime != null && newDateTime > maxTime);

          if (!isTimeDisabled) {
            setSelectedDateTime(newDateTime);
            // Don't call onValueChange immediately - wait for popover close
          }
        }
      },
      [selectedDateTime, minTime, maxTime]
    );

    const handleClear = React.useCallback(() => {
      setSelectedDateTime(undefined);
      setSelectedTime({ hours: 12, minutes: 0 });
      onValueChange?.(undefined);
    }, [onValueChange]);

    const handlePresetSelect = React.useCallback(
      (presetValue: Date) => {
        setSelectedDateTime(presetValue);
        setSelectedTime({
          hours: presetValue.getHours(),
          minutes: presetValue.getMinutes(),
        });
        onValueChange?.(presetValue);
      },
      [onValueChange]
    );

    const navigateMonth = React.useCallback((direction: 'prev' | 'next') => {
      setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    }, []);

    const calendarDays = React.useMemo(
      () => getCalendarDays(currentMonth),
      [currentMonth]
    );

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const isDayDisabled = React.useCallback(
      (date: Date) => {
        return (
          (minDate != null && date < minDate) ||
          (maxDate != null && date > maxDate) ||
          disabledDates.some(disabledDate => isSameDay(date, disabledDate)) ||
          disabledDaysOfWeek.includes(date.getDay())
        );
      },
      [minDate, maxDate, disabledDates, disabledDaysOfWeek]
    );

    const isDayInCurrentMonth = React.useCallback(
      (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
      },
      [currentMonth]
    );

    const getDayVariant = React.useCallback(
      (date: Date) => {
        if (isDayDisabled(date)) return 'disabled';
        if (!isDayInCurrentMonth(date)) return 'outside';
        if (currentValue && isSameDay(date, currentValue)) return 'selected';
        if (isToday(date)) return 'today';
        if (isWeekend(date)) return 'weekend';
        return 'default';
      },
      [currentValue, isDayDisabled, isDayInCurrentMonth]
    );

    const displayValue = currentValue
      ? `${formatDate(currentValue, dateFormat)} ${formatTime(currentValue, timeFormat)}`
      : '';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              datepickerLabelVariants({
                size,
                state: currentState,
              })
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* DateTimePicker Input */}
        <PopoverPrimitive.Root
          open={isOpen}
          onOpenChange={open => {
            setIsOpen(open);
            // Call onValueChange when closing with the latest value
            if (!open && selectedDateTime) {
              onValueChange?.(selectedDateTime);
            }
          }}
        >
          <PopoverPrimitive.Trigger
            ref={ref}
            className={cn(
              datepickerTriggerVariants({
                variant,
                size,
                state: currentState,
              }),
              fullWidth && 'w-full justify-between',
              className
            )}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            autoFocus={autoFocus}
            {...props}
          >
            <span
              className={cn(
                datepickerInputVariants({ size }),
                !displayValue && 'text-muted-foreground'
              )}
            >
              {displayValue || placeholder}
            </span>
            <div className="flex items-center space-x-1">
              {clearable && currentValue && !disabled && !readOnly && (
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  className={cn(
                    datepickerIconVariants({
                      size,
                      state: currentState,
                    }),
                    'hover:text-foreground'
                  )}
                >
                  <X />
                </button>
              )}
              <Calendar
                className={cn(
                  datepickerIconVariants({
                    position: 'right',
                    size,
                    state: currentState,
                  })
                )}
              />
            </div>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className={cn(
                calendarPopoverVariants({ size }),
                'w-80 bg-white dark:bg-gray-900',
                calendarClassName
              )}
              align="start"
              sideOffset={4}
              onOpenAutoFocus={e => e.preventDefault()}
              onInteractOutside={e => {
                // Check if the interaction is with a select element inside the popover
                const target = e.target as HTMLElement;
                if (target.tagName === 'SELECT' || target.closest('select')) {
                  e.preventDefault();
                }
              }}
            >
              {/* Preset Options */}
              {showPresets && presetOptions.length > 0 && (
                <div className="border-border mb-4 flex flex-wrap gap-1 border-b pb-4">
                  {presetOptions.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset.value)}
                      className={cn(
                        datePresetVariants({
                          active:
                            currentValue &&
                            isSameDay(currentValue, preset.value),
                        })
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Calendar Header */}
              <div className={cn(calendarHeaderVariants({ size }))}>
                <button
                  onClick={() => navigateMonth('prev')}
                  className={cn(calendarNavButtonVariants({ size }))}
                  disabled={
                    minDate &&
                    startOfMonth(currentMonth) <= startOfMonth(minDate)
                  }
                  aria-label="Go to previous month"
                >
                  <ChevronLeft />
                </button>

                <h2 className="text-sm font-semibold">
                  {currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>

                <button
                  onClick={() => navigateMonth('next')}
                  className={cn(calendarNavButtonVariants({ size }))}
                  disabled={
                    maxDate && endOfMonth(currentMonth) >= endOfMonth(maxDate)
                  }
                  aria-label="Go to next month"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Calendar Grid */}
              <table className={cn(calendarGridVariants())}>
                <thead>
                  <tr>
                    {weekDays.map(day => (
                      <th
                        key={day}
                        className={cn(calendarWeekHeaderVariants({ size }))}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }, (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const dayIndexInMonth = weekIndex * 7 + dayIndex;
                        const date = calendarDays.at(dayIndexInMonth);

                        if (!date) return <td key={dayIndex} />;

                        return (
                          <td key={dayIndex}>
                            <button
                              onClick={() => handleDateSelect(date)}
                              disabled={isDayDisabled(date)}
                              className={cn(
                                calendarCellVariants({
                                  size,
                                  variant: getDayVariant(date),
                                })
                              )}
                            >
                              {date.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Time Picker Section */}
              <div className={cn(timePickerVariants({ size }))}>
                <div className="flex items-center space-x-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Time:</span>
                </div>
                <div className="flex items-center space-x-1">
                  <select
                    value={selectedTime.hours}
                    onChange={e =>
                      handleTimeChange(
                        parseInt(e.target.value, 10),
                        selectedTime.minutes
                      )
                    }
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => e.stopPropagation()}
                    className={cn(timeInputVariants({ size }))}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground text-sm">:</span>
                  <select
                    value={selectedTime.minutes}
                    onChange={e =>
                      handleTimeChange(
                        selectedTime.hours,
                        parseInt(e.target.value, 10)
                      )
                    }
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => e.stopPropagation()}
                    className={cn(timeInputVariants({ size }))}
                  >
                    {Array.from({ length: 60 / minuteStep }, (_, i) => {
                      const minutes = i * minuteStep;
                      return (
                        <option key={minutes} value={minutes}>
                          {String(minutes).padStart(2, '0')}
                        </option>
                      );
                    })}
                  </select>
                  {timeFormat === '12h' && (
                    <select
                      value={selectedTime.hours >= 12 ? 'PM' : 'AM'}
                      onChange={e => {
                        const isPM = e.target.value === 'PM';
                        let newHours = selectedTime.hours;

                        if (isPM && newHours < 12) {
                          newHours += 12;
                        } else if (!isPM && newHours >= 12) {
                          newHours -= 12;
                        }

                        handleTimeChange(newHours, selectedTime.minutes);
                      }}
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => e.stopPropagation()}
                      className={cn(timeInputVariants({ size }))}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  )}
                </div>
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {/* Helper Text */}
        {(helperText ?? errorText) && (
          <div
            className={cn(
              datepickerHelperVariants({
                state: currentState,
              })
            )}
          >
            {errorText ?? helperText}
          </div>
        )}
      </div>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';

/**
 * Date range utilities
 */
const isDateInRange = (
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!startDate || !endDate) return false;
  return date >= startDate && date <= endDate;
};

const isDateRangeStart = (date: Date, startDate: Date | null): boolean => {
  return startDate ? isSameDay(date, startDate) : false;
};

const isDateRangeEnd = (date: Date, endDate: Date | null): boolean => {
  return endDate ? isSameDay(date, endDate) : false;
};

/**
 * DateRangePicker component props interface
 */
export interface DateRangePickerProps
  extends VariantProps<typeof datepickerVariants> {
  // Core date range functionality
  value?: [Date, Date] | null;
  defaultValue?: [Date, Date] | null;
  onValueChange?: (dateRange: [Date, Date] | null) => void;

  // Range constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  maxRange?: number; // Maximum days between start and end

  // Display options
  placeholder?: string;
  dateFormat?: string;
  label?: string;
  helperText?: string;
  errorText?: string;

  // Styling
  className?: string;
  calendarClassName?: string;

  // Behavior
  closeOnSelect?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;

  // Preset options
  showPresets?: boolean;
  presetOptions?: Array<{
    label: string;
    value: [Date, Date];
  }>;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/**
 * DateRangePicker component
 */
const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minDate,
      maxDate,
      disabledDates = [],
      disabledDaysOfWeek = [],
      maxRange,
      placeholder = 'Select date range',
      dateFormat = 'MM/dd/yyyy',
      label,
      helperText,
      errorText,
      variant = 'default',
      size = 'default',
      state = 'default',
      fullWidth = false,
      className,
      calendarClassName,
      closeOnSelect = true,
      disabled = false,
      required = false,
      readOnly = false,
      clearable = false,
      autoFocus = false,
      showPresets = false,
      presetOptions = [],
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [selectedRange, setSelectedRange] = React.useState<
      [Date, Date] | null
    >(defaultValue ?? null);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      value?.[0] ?? selectedRange?.[0] ?? new Date()
    );
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
    const [selectionState, setSelectionState] = React.useState<'start' | 'end'>(
      'start'
    );
    const [isOpen, setIsOpen] = React.useState(false);

    const currentValue = value ?? selectedRange;
    const currentState = errorText ? 'error' : (state ?? 'default');

    const handleDateSelect = React.useCallback(
      (date: Date) => {
        const isDateDisabled =
          (minDate != null && date < minDate) ||
          (maxDate != null && date > maxDate) ||
          disabledDates.some(disabledDate => isSameDay(date, disabledDate)) ||
          disabledDaysOfWeek.includes(date.getDay());

        if (isDateDisabled) return;

        if (selectionState === 'start' || !currentValue) {
          // Starting new selection
          setSelectedRange([date, date]);
          setSelectionState('end');
          onValueChange?.([date, date]);
        } else {
          // Completing the range
          const [startDate] = currentValue;
          let newRange: [Date, Date];

          if (date < startDate) {
            // User selected earlier date, make it the start
            newRange = [date, startDate];
          } else {
            // Normal case: end date after start date
            newRange = [startDate, date];
          }

          // Check max range constraint
          if (maxRange) {
            const daysDiff = Math.abs(
              (newRange[1].getTime() - newRange[0].getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (daysDiff > maxRange) {
              return; // Don't allow selection beyond max range
            }
          }

          setSelectedRange(newRange);
          setSelectionState('start');
          onValueChange?.(newRange);

          if (closeOnSelect) {
            setIsOpen(false);
          }
        }
      },
      [
        minDate,
        maxDate,
        disabledDates,
        disabledDaysOfWeek,
        maxRange,
        selectionState,
        currentValue,
        onValueChange,
        closeOnSelect,
      ]
    );

    const handleClear = React.useCallback(() => {
      setSelectedRange(null);
      setSelectionState('start');
      onValueChange?.(null);
    }, [onValueChange]);

    const handlePresetSelect = React.useCallback(
      (presetValue: [Date, Date]) => {
        setSelectedRange(presetValue);
        setSelectionState('start');
        onValueChange?.(presetValue);
      },
      [onValueChange]
    );

    const navigateMonth = React.useCallback((direction: 'prev' | 'next') => {
      setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    }, []);

    const calendarDays = React.useMemo(
      () => getCalendarDays(currentMonth),
      [currentMonth]
    );

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const isDayDisabled = React.useCallback(
      (date: Date) => {
        return (
          (minDate != null && date < minDate) ||
          (maxDate != null && date > maxDate) ||
          disabledDates.some(disabledDate => isSameDay(date, disabledDate)) ||
          disabledDaysOfWeek.includes(date.getDay())
        );
      },
      [minDate, maxDate, disabledDates, disabledDaysOfWeek]
    );

    const isDayInCurrentMonth = React.useCallback(
      (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
      },
      [currentMonth]
    );

    const getDayVariant = React.useCallback(
      (date: Date) => {
        if (isDayDisabled(date)) return 'disabled';
        if (!isDayInCurrentMonth(date)) return 'outside';

        if (currentValue) {
          const [startDate, endDate] = currentValue;

          if (
            isDateRangeStart(date, startDate) &&
            isDateRangeEnd(date, endDate)
          ) {
            return 'selected'; // Single day selection
          }
          if (isDateRangeStart(date, startDate)) return 'rangeStart';
          if (isDateRangeEnd(date, endDate)) return 'rangeEnd';
          if (isDateInRange(date, startDate, endDate)) return 'inRange';
        }

        // Preview hover effect for range selection
        if (selectionState === 'end' && currentValue && hoverDate) {
          const [startDate] = currentValue;
          const previewStart = hoverDate < startDate ? hoverDate : startDate;
          const previewEnd = hoverDate < startDate ? startDate : hoverDate;

          if (isDateInRange(date, previewStart, previewEnd)) {
            return 'inRange';
          }
        }

        if (isToday(date)) return 'today';
        if (isWeekend(date)) return 'weekend';
        return 'default';
      },
      [
        currentValue,
        selectionState,
        hoverDate,
        isDayDisabled,
        isDayInCurrentMonth,
      ]
    );

    const displayValue = currentValue
      ? `${formatDate(currentValue[0], dateFormat)} - ${formatDate(currentValue[1], dateFormat)}`
      : '';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              datepickerLabelVariants({
                size,
                state: currentState,
              })
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* DateRangePicker Input */}
        <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <PopoverPrimitive.Trigger
            ref={ref}
            className={cn(
              datepickerTriggerVariants({
                variant,
                size,
                state: currentState,
              }),
              fullWidth && 'w-full justify-between',
              className
            )}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            autoFocus={autoFocus}
            {...props}
          >
            <span
              className={cn(
                datepickerInputVariants({ size }),
                !displayValue && 'text-muted-foreground'
              )}
            >
              {displayValue || placeholder}
            </span>
            <div className="flex items-center space-x-1">
              {clearable && currentValue && !disabled && !readOnly && (
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }}
                  className={cn(
                    datepickerIconVariants({
                      size,
                      state: currentState,
                    }),
                    'hover:text-foreground'
                  )}
                >
                  <X />
                </button>
              )}
              <Calendar
                className={cn(
                  datepickerIconVariants({
                    position: 'right',
                    size,
                    state: currentState,
                  })
                )}
              />
            </div>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className={cn(
                calendarPopoverVariants({ size }),
                'bg-white dark:bg-gray-900',
                calendarClassName
              )}
              align="start"
              sideOffset={4}
            >
              {/* Preset Options */}
              {showPresets && presetOptions.length > 0 && (
                <div className="border-border mb-4 flex flex-wrap gap-1 border-b pb-4">
                  {presetOptions.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset.value)}
                      className={cn(
                        datePresetVariants({
                          active:
                            currentValue &&
                            isSameDay(currentValue[0], preset.value[0]) &&
                            isSameDay(currentValue[1], preset.value[1]),
                        })
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Selection Status */}
              <div className="text-muted-foreground mb-4 text-xs">
                {selectionState === 'start'
                  ? 'Select start date'
                  : 'Select end date'}
                {maxRange && (
                  <span className="ml-2">
                    (Max {maxRange} day{maxRange !== 1 ? 's' : ''})
                  </span>
                )}
              </div>

              {/* Calendar Header */}
              <div className={cn(calendarHeaderVariants({ size }))}>
                <button
                  onClick={() => navigateMonth('prev')}
                  className={cn(calendarNavButtonVariants({ size }))}
                  disabled={
                    minDate &&
                    startOfMonth(currentMonth) <= startOfMonth(minDate)
                  }
                  aria-label="Go to previous month"
                >
                  <ChevronLeft />
                </button>

                <h2 className="text-sm font-semibold">
                  {currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>

                <button
                  onClick={() => navigateMonth('next')}
                  className={cn(calendarNavButtonVariants({ size }))}
                  disabled={
                    maxDate && endOfMonth(currentMonth) >= endOfMonth(maxDate)
                  }
                  aria-label="Go to next month"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Calendar Grid */}
              <table className={cn(calendarGridVariants())}>
                <thead>
                  <tr>
                    {weekDays.map(day => (
                      <th
                        key={day}
                        className={cn(calendarWeekHeaderVariants({ size }))}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }, (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const dayIndexInMonth = weekIndex * 7 + dayIndex;
                        const date = calendarDays.at(dayIndexInMonth);

                        if (!date) return <td key={dayIndex} />;

                        return (
                          <td key={dayIndex}>
                            <button
                              onClick={() => handleDateSelect(date)}
                              onMouseEnter={() => setHoverDate(date)}
                              onMouseLeave={() => setHoverDate(null)}
                              disabled={isDayDisabled(date)}
                              className={cn(
                                calendarCellVariants({
                                  size,
                                  variant: getDayVariant(date),
                                })
                              )}
                            >
                              {date.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {/* Helper Text */}
        {(helperText ?? errorText) && (
          <div
            className={cn(
              datepickerHelperVariants({
                state: currentState,
              })
            )}
          >
            {errorText ?? helperText}
          </div>
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';

/**
 * Recipe-specific DatePicker variants
 */

/**
 * Meal Plan Date Picker - for selecting meal planning dates
 */
export interface MealPlanDatePickerProps
  extends Omit<DatePickerProps, 'presetOptions' | 'disabledDaysOfWeek'> {
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  highlightWeekends?: boolean;
}

const MealPlanDatePicker = React.forwardRef<
  HTMLButtonElement,
  MealPlanDatePickerProps
>(
  (
    {
      mealType = 'dinner',
      weekStartsOn = 1,
      showWeekNumbers = true,
      highlightWeekends: _highlightWeekends = true,
      variant = 'outlined',
      placeholder = 'Select meal date',
      ...props
    },
    ref
  ) => {
    const mealPlanPresets = React.useMemo(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      return [
        { label: 'Today', value: today },
        { label: 'Tomorrow', value: tomorrow },
        { label: 'Next Week', value: nextWeek },
        {
          label: 'This Weekend',
          value: (() => {
            const saturday = new Date(today);
            const daysUntilSaturday = 6 - today.getDay();
            saturday.setDate(today.getDate() + daysUntilSaturday);
            return saturday;
          })(),
        },
      ];
    }, []);

    return (
      <DatePicker
        ref={ref}
        variant={variant}
        placeholder={placeholder}
        presetOptions={mealPlanPresets}
        showPresets={true}
        weekStartsOn={weekStartsOn}
        showWeekNumbers={showWeekNumbers}
        className={cn(
          'meal-plan-picker',
          mealType === 'breakfast' && 'border-yellow-200',
          mealType === 'lunch' && 'border-orange-200',
          mealType === 'dinner' && 'border-blue-200',
          mealType === 'snack' && 'border-green-200'
        )}
        {...props}
      />
    );
  }
);

MealPlanDatePicker.displayName = 'MealPlanDatePicker';

/**
 * Recipe Schedule Picker - for scheduling cooking times
 */
export interface RecipeSchedulePickerProps
  extends Omit<DateTimePickerProps, 'presetOptions'> {
  cookingDuration?: number;
  preparationTime?: number;
  showDurationWarning?: boolean;
}

const RecipeSchedulePicker = React.forwardRef<
  HTMLButtonElement,
  RecipeSchedulePickerProps
>(
  (
    {
      cookingDuration = 30,
      preparationTime = 15,
      showDurationWarning = true,
      variant = 'filled',
      placeholder = 'Schedule cooking time',
      minuteStep = 15,
      ...props
    },
    ref
  ) => {
    const totalDuration = cookingDuration + preparationTime;

    const schedulePresets = React.useMemo(() => {
      const now = new Date();
      const in30Minutes = new Date(now.getTime() + 30 * 60000);
      const in1Hour = new Date(now.getTime() + 60 * 60000);
      const in2Hours = new Date(now.getTime() + 2 * 60 * 60000);
      const tomorrow6pm = new Date(now);
      tomorrow6pm.setDate(now.getDate() + 1);
      tomorrow6pm.setHours(18, 0, 0, 0);

      return [
        { label: 'In 30 min', value: in30Minutes },
        { label: 'In 1 hour', value: in1Hour },
        { label: 'In 2 hours', value: in2Hours },
        { label: 'Tomorrow 6 PM', value: tomorrow6pm },
      ];
    }, []);

    return (
      <div className="space-y-2">
        <DateTimePicker
          ref={ref}
          variant={variant}
          placeholder={placeholder}
          presetOptions={schedulePresets}
          showPresets={true}
          minuteStep={minuteStep}
          {...props}
        />
        {showDurationWarning && totalDuration > 0 && (
          <p className="text-muted-foreground text-xs">
            Allow {totalDuration} minutes total (prep: {preparationTime}min +
            cooking: {cookingDuration}min)
          </p>
        )}
      </div>
    );
  }
);

RecipeSchedulePicker.displayName = 'RecipeSchedulePicker';

/**
 * Expiration Date Picker - for tracking food expiration
 */
export interface ExpirationDatePickerProps
  extends Omit<DatePickerProps, 'presetOptions' | 'minDate'> {
  foodType?: 'produce' | 'dairy' | 'meat' | 'pantry' | 'leftovers';
  showExpirationWarning?: boolean;
  warningDays?: number;
}

const ExpirationDatePicker = React.forwardRef<
  HTMLButtonElement,
  ExpirationDatePickerProps
>(
  (
    {
      foodType = 'produce',
      showExpirationWarning = true,
      warningDays = 3,
      variant = 'default',
      placeholder = 'Select expiration date',
      ...props
    },
    ref
  ) => {
    const today = React.useMemo(() => new Date(), []);

    const expirationPresets = React.useMemo(() => {
      const in3Days = new Date(today);
      in3Days.setDate(today.getDate() + 3);
      const in1Week = new Date(today);
      in1Week.setDate(today.getDate() + 7);
      const in2Weeks = new Date(today);
      in2Weeks.setDate(today.getDate() + 14);
      const in1Month = new Date(today);
      in1Month.setMonth(today.getMonth() + 1);

      const defaultPresets = [
        { label: 'In 3 days', value: in3Days },
        { label: 'In 1 week', value: in1Week },
        { label: 'In 2 weeks', value: in2Weeks },
        { label: 'In 1 month', value: in1Month },
      ];

      // Food type specific presets
      const foodTypePresets: Record<string, typeof defaultPresets> = {
        produce: [
          { label: 'In 3 days', value: in3Days },
          { label: 'In 1 week', value: in1Week },
        ],
        dairy: [
          { label: 'In 1 week', value: in1Week },
          { label: 'In 2 weeks', value: in2Weeks },
        ],
        meat: [
          { label: 'In 3 days', value: in3Days },
          { label: 'In 1 week', value: in1Week },
        ],
        pantry: [
          { label: 'In 1 month', value: in1Month },
          {
            label: 'In 6 months',
            value: (() => {
              const in6Months = new Date(today);
              in6Months.setMonth(today.getMonth() + 6);
              return in6Months;
            })(),
          },
        ],
        leftovers: [
          { label: 'In 3 days', value: in3Days },
          { label: 'In 1 week', value: in1Week },
        ],
      };

      return (
        (foodType in foodTypePresets
          ? foodTypePresets[foodType as keyof typeof foodTypePresets]
          : defaultPresets) ?? defaultPresets
      );
    }, [foodType, today]);

    const getExpirationStatus = React.useCallback(
      (date: Date | undefined) => {
        if (!date) return null;
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'expired';
        if (diffDays <= warningDays) return 'warning';
        return 'good';
      },
      [today, warningDays]
    );

    const currentValue = props.value ?? props.defaultValue;
    const expirationStatus = getExpirationStatus(currentValue);

    return (
      <div className="space-y-2">
        <DatePicker
          ref={ref}
          variant={variant}
          placeholder={placeholder}
          presetOptions={expirationPresets}
          showPresets={true}
          minDate={today}
          className={cn(
            expirationStatus === 'expired' && 'border-red-500',
            expirationStatus === 'warning' && 'border-yellow-500',
            expirationStatus === 'good' && 'border-green-500'
          )}
          {...props}
        />
        {showExpirationWarning && currentValue && (
          <div className="flex items-center space-x-2 text-xs">
            {expirationStatus === 'expired' && (
              <span className="font-medium text-red-600">⚠️ Expired</span>
            )}
            {expirationStatus === 'warning' && (
              <span className="font-medium text-yellow-600">
                ⚠️ Expires soon
              </span>
            )}
            {expirationStatus === 'good' && (
              <span className="font-medium text-green-600">✓ Fresh</span>
            )}
            <span className="text-muted-foreground">
              {foodType.charAt(0).toUpperCase() + foodType.slice(1)} item
            </span>
          </div>
        )}
      </div>
    );
  }
);

ExpirationDatePicker.displayName = 'ExpirationDatePicker';

export {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateRangePicker,
  MealPlanDatePicker,
  RecipeSchedulePicker,
  ExpirationDatePicker,
};
